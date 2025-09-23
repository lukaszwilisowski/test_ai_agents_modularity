import { NextRequest, NextResponse } from "next/server";
import { planeModel } from "@/lib/models/plane.model";
import { planeUpdateSchema } from "@/lib/schemas/plane.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await planeModel.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Plane not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plane" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = planeUpdateSchema.parse(body);
    const item = await planeModel.updateById(params.id, validatedData);
    if (!item) {
      return NextResponse.json({ error: "Plane not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update plane" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await planeModel.deleteById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Plane not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Plane deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plane" }, { status: 500 });
  }
}
