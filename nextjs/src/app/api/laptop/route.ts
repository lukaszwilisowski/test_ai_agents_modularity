import { type NextRequest, NextResponse } from "next/server";
import { laptopModel } from "@/lib/models/laptop.model";

export async function GET() {
  try {
    const laptops = await laptopModel.findAll();
    return NextResponse.json(laptops);
  } catch (error) {
    console.error("Failed to fetch laptops:", error);
    return NextResponse.json(
      { error: "Failed to fetch laptops" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const laptop = await laptopModel.create(body);
    return NextResponse.json(laptop);
  } catch (error) {
    console.error("Failed to create laptop:", error);
    return NextResponse.json(
      { error: "Failed to create laptop" },
      { status: 500 }
    );
  }
}
