import { type NextRequest, NextResponse } from "next/server";
import { laptopModel } from "@/lib/models/laptop.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const laptop = await laptopModel.findById(params.id);
    if (!laptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }
    return NextResponse.json(laptop);
  } catch (error) {
    console.error("Failed to fetch laptop:", error);
    return NextResponse.json(
      { error: "Failed to fetch laptop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const laptop = await laptopModel.update(params.id, body);
    if (!laptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }
    return NextResponse.json(laptop);
  } catch (error) {
    console.error("Failed to update laptop:", error);
    return NextResponse.json(
      { error: "Failed to update laptop" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const laptop = await laptopModel.delete(params.id);
    if (!laptop) {
      return NextResponse.json({ error: "Laptop not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Laptop deleted successfully" });
  } catch (error) {
    console.error("Failed to delete laptop:", error);
    return NextResponse.json(
      { error: "Failed to delete laptop" },
      { status: 500 }
    );
  }
}
