import { tvModel } from "@/lib/models/tv.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const tvs = await tvModel.findAll();
    return NextResponse.json(tvs);
  } catch (error) {
    console.error("Failed to fetch TVs:", error);
    return NextResponse.json({ error: "Failed to fetch TVs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tv = await tvModel.create(body);
    return NextResponse.json(tv);
  } catch (error) {
    console.error("Failed to create TV:", error);
    return NextResponse.json({ error: "Failed to create TV" }, { status: 500 });
  }
}
