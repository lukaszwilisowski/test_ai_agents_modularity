import { guitarModel } from "@/lib/models/guitar.model";
import { pianoModel } from "@/lib/models/piano.model";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const guitars = await guitarModel.createSampleData();
    const pianos = await pianoModel.createSampleData();

    return NextResponse.json({
      success: true,
      message: "Sample data created successfully",
      guitars: guitars.length,
      pianos: pianos.length,
    });
  } catch (error) {
    console.error("Failed to create sample data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sample data",
      },
      { status: 500 }
    );
  }
}
