import { type NextRequest, NextResponse } from "next/server";
import { drumsModel } from "@/lib/models/drums.model";

export async function GET() {
  try {
    const drums = await drumsModel.findAll();
    return NextResponse.json(drums);
  } catch (error) {
    console.error("Failed to fetch drums:", error);
    return NextResponse.json(
      { error: "Failed to fetch drums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const drums = await drumsModel.create(body);
    return NextResponse.json(drums);
  } catch (error) {
    console.error("Failed to create drums:", error);
    return NextResponse.json(
      { error: "Failed to create drums" },
      { status: 500 }
    );
  }
}
