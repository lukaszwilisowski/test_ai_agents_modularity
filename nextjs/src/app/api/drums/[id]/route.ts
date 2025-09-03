import { type NextRequest, NextResponse } from "next/server";
import { drumsModel } from "@/lib/models/drums.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const drums = await drumsModel.findById(params.id);
    if (!drums) {
      return NextResponse.json({ error: "Drums not found" }, { status: 404 });
    }
    return NextResponse.json(drums);
  } catch (error) {
    console.error("Failed to fetch drums:", error);
    return NextResponse.json(
      { error: "Failed to fetch drums" },
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
    const drums = await drumsModel.update(params.id, body);
    if (!drums) {
      return NextResponse.json({ error: "Drums not found" }, { status: 404 });
    }
    return NextResponse.json(drums);
  } catch (error) {
    console.error("Failed to update drums:", error);
    return NextResponse.json(
      { error: "Failed to update drums" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const drums = await drumsModel.delete(params.id);
    if (!drums) {
      return NextResponse.json({ error: "Drums not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Drums deleted successfully" });
  } catch (error) {
    console.error("Failed to delete drums:", error);
    return NextResponse.json(
      { error: "Failed to delete drums" },
      { status: 500 }
    );
  }
}
