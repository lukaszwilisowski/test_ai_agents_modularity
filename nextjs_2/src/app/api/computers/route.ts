import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CreateComputerSchema, ComputerSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const collection = await getCollection("computers");
    const computers = await collection.find({}).toArray();

    const parsedComputers = computers.map((computer) => ({
      ...computer,
      _id: computer._id.toString(),
      createdAt: computer.createdAt.toISOString(),
      updatedAt: computer.updatedAt.toISOString(),
    }));

    const validatedComputers = ComputerSchema.array().parse(parsedComputers);

    return NextResponse.json({
      success: true,
      data: validatedComputers,
    });
  } catch (error) {
    console.error("Error fetching computers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch computers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateComputerSchema.parse(body);

    const collection = await getCollection("computers");
    const now = new Date();

    const computerToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(computerToInsert);

    const createdComputer = {
      ...computerToInsert,
      _id: result.insertedId.toString(),
      createdAt: computerToInsert.createdAt.toISOString(),
      updatedAt: computerToInsert.updatedAt.toISOString(),
    };

    const validatedComputer = ComputerSchema.parse(createdComputer);

    return NextResponse.json(
      {
        success: true,
        data: validatedComputer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating computer:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid computer data",
          details: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create computer" },
      { status: 500 }
    );
  }
}
