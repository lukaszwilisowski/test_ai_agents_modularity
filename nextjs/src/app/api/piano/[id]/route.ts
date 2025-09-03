import { pianoModel } from "@/lib/models/piano.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const piano = await pianoModel.findById(params.id);
    if (!piano) {
      return NextResponse.json({ error: "Piano not found" }, { status: 404 });
    }
    return NextResponse.json(piano);
  } catch (error) {
    console.error("Error fetching piano:", error);
    return NextResponse.json(
      { error: "Failed to fetch piano" },
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
    const piano = await pianoModel.update(params.id, body);
    if (!piano) {
      return NextResponse.json({ error: "Piano not found" }, { status: 404 });
    }
    return NextResponse.json(piano);
  } catch (error) {
    console.error("Error updating piano:", error);
    return NextResponse.json(
      { error: "Failed to update piano" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const piano = await pianoModel.delete(params.id);
    if (!piano) {
      return NextResponse.json({ error: "Piano not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Piano deleted successfully" });
  } catch (error) {
    console.error("Error deleting piano:", error);
    return NextResponse.json(
      { error: "Failed to delete piano" },
      { status: 500 }
    );
  }
}
