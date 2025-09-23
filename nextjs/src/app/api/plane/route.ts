import { NextRequest, NextResponse } from "next/server";
import { planeModel } from "@/lib/models/plane.model";
import { planeSchema } from "@/lib/schemas/plane.schema";

export async function GET() {
  try {
    const items = await planeModel.findAll();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch planes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = planeSchema.parse(body);
    const item = await planeModel.create(validatedData);
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create plane" }, { status: 500 });
  }
}
