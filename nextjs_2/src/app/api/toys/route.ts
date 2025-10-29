import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CreateToySchema, ToySchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const collection = await getCollection("toys");
    const toys = await collection.find({}).toArray();

    const parsedToys = toys.map(toy => ({
      ...toy,
      _id: toy._id.toString(),
      createdAt: toy.createdAt.toISOString(),
      updatedAt: toy.updatedAt.toISOString(),
    }));

    const validatedToys = ToySchema.array().parse(parsedToys);

    return NextResponse.json({
      success: true,
      data: validatedToys,
    });
  } catch (error) {
    console.error("Error fetching toys:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch toys" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateToySchema.parse(body);

    const collection = await getCollection("toys");
    const now = new Date();

    const toyToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(toyToInsert);

    const createdToy = {
      ...toyToInsert,
      _id: result.insertedId.toString(),
      createdAt: toyToInsert.createdAt.toISOString(),
      updatedAt: toyToInsert.updatedAt.toISOString(),
    };

    const validatedToy = ToySchema.parse(createdToy);

    return NextResponse.json({
      success: true,
      data: validatedToy,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating toy:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid toy data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create toy" },
      { status: 500 }
    );
  }
}
