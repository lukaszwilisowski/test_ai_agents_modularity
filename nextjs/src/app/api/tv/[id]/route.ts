import { tvModel } from "@/lib/models/tv.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tv = await tvModel.findById(params.id);
    if (!tv) {
      return NextResponse.json({ error: "TV not found" }, { status: 404 });
    }
    return NextResponse.json(tv);
  } catch (error) {
    console.error("Failed to fetch TV:", error);
    return NextResponse.json({ error: "Failed to fetch TV" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const tv = await tvModel.update(params.id, body);
    if (!tv) {
      return NextResponse.json({ error: "TV not found" }, { status: 404 });
    }
    return NextResponse.json(tv);
  } catch (error) {
    console.error("Failed to update TV:", error);
    return NextResponse.json({ error: "Failed to update TV" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tv = await tvModel.delete(params.id);
    if (!tv) {
      return NextResponse.json({ error: "TV not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "TV deleted successfully" });
  } catch (error) {
    console.error("Failed to delete TV:", error);
    return NextResponse.json({ error: "Failed to delete TV" }, { status: 500 });
  }
}
