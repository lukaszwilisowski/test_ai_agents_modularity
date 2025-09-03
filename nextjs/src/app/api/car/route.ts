import { NextRequest, NextResponse } from "next/server";
import { carModel } from "@/lib/models/car.model";
import { carSchema } from "@/lib/schemas/car.schema";

export async function GET() {
  try {
    const items = await carModel.findAll();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = carSchema.parse(body);
    const item = await carModel.create(validatedData);
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}