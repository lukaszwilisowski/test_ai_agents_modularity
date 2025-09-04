import { getCollection } from "@/lib/mongodb";
import { CreateTVSchema, TVSchema } from "@/models/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await getCollection("tvs");
    const tvs = await collection.find({}).toArray();

    const parsedTVs = tvs.map((tv) => ({
      ...tv,
      _id: tv._id.toString(),
      createdAt: tv.createdAt.toISOString(),
      updatedAt: tv.updatedAt.toISOString(),
    }));

    const validatedTVs = TVSchema.array().parse(parsedTVs);

    return NextResponse.json({
      success: true,
      data: validatedTVs,
    });
  } catch (error) {
    console.error("Error fetching TVs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch TVs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateTVSchema.parse(body);

    const collection = await getCollection("tvs");
    const now = new Date();

    const tvToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(tvToInsert);

    const createdTV = {
      ...tvToInsert,
      _id: result.insertedId.toString(),
      createdAt: tvToInsert.createdAt.toISOString(),
      updatedAt: tvToInsert.updatedAt.toISOString(),
    };

    const validatedTV = TVSchema.parse(createdTV);

    return NextResponse.json(
      {
        success: true,
        data: validatedTV,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating TV:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid TV data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create TV" },
      { status: 500 }
    );
  }
}
