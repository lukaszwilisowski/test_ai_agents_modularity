import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CreateGuitarSchema, GuitarSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const collection = await getCollection("guitars");
    const guitars = await collection.find({}).toArray();
    
    const parsedGuitars = guitars.map(guitar => ({
      ...guitar,
      _id: guitar._id.toString(),
      createdAt: guitar.createdAt.toISOString(),
      updatedAt: guitar.updatedAt.toISOString(),
    }));

    const validatedGuitars = GuitarSchema.array().parse(parsedGuitars);
    
    return NextResponse.json({
      success: true,
      data: validatedGuitars,
    });
  } catch (error) {
    console.error("Error fetching guitars:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guitars" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateGuitarSchema.parse(body);
    
    const collection = await getCollection("guitars");
    const now = new Date();
    
    const guitarToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(guitarToInsert);
    
    const createdGuitar = {
      ...guitarToInsert,
      _id: result.insertedId.toString(),
      createdAt: guitarToInsert.createdAt.toISOString(),
      updatedAt: guitarToInsert.updatedAt.toISOString(),
    };

    const validatedGuitar = GuitarSchema.parse(createdGuitar);

    return NextResponse.json({
      success: true,
      data: validatedGuitar,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating guitar:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid guitar data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create guitar" },
      { status: 500 }
    );
  }
}