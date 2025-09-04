import { getCollection } from "@/lib/mongodb";
import { TVSchema, UpdateTVSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid TV ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("tvs");
    const tv = await collection.findOne({ _id: new ObjectId(id) });

    if (!tv) {
      return NextResponse.json(
        { success: false, error: "TV not found" },
        { status: 404 }
      );
    }

    const parsedTV = {
      ...tv,
      _id: tv._id.toString(),
      createdAt: tv.createdAt.toISOString(),
      updatedAt: tv.updatedAt.toISOString(),
    };

    const validatedTV = TVSchema.parse(parsedTV);

    return NextResponse.json({
      success: true,
      data: validatedTV,
    });
  } catch (error) {
    console.error("Error fetching TV:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch TV" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid TV ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateTVSchema.parse(body);

    const collection = await getCollection("tvs");

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "TV not found" },
        { status: 404 }
      );
    }

    const parsedTV = {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    const validatedTV = TVSchema.parse(parsedTV);

    return NextResponse.json({
      success: true,
      data: validatedTV,
    });
  } catch (error) {
    console.error("Error updating TV:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid TV data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update TV" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid TV ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("tvs");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "TV not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error("Error deleting TV:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete TV" },
      { status: 500 }
    );
  }
}
