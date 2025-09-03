import { NextRequest, NextResponse } from "next/server";
import { carModel } from "@/lib/models/car.model";
import { carUpdateSchema } from "@/lib/schemas/car.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await carModel.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = carUpdateSchema.parse(body);
    const item = await carModel.updateById(params.id, validatedData);
    if (!item) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await carModel.deleteById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}