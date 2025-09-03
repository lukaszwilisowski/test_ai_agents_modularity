import { pianoModel } from "@/lib/models/piano.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const pianos = await pianoModel.findAll();
    return NextResponse.json(pianos);
  } catch (error) {
    console.error("Error fetching pianos:", error);
    return NextResponse.json(
      { error: "Failed to fetch pianos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const piano = await pianoModel.create(body);
    return NextResponse.json(piano, { status: 201 });
  } catch (error) {
    console.error("Error creating piano:", error);
    return NextResponse.json(
      { error: "Failed to create piano" },
      { status: 500 }
    );
  }
}
