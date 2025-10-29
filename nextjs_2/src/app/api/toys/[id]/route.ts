import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ToySchema, UpdateToySchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid toy ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("toys");
    const toy = await collection.findOne({ _id: new ObjectId(id) });

    if (!toy) {
      return NextResponse.json(
        { success: false, error: "Toy not found" },
        { status: 404 }
      );
    }

    const parsedToy = {
      ...toy,
      _id: toy._id.toString(),
      createdAt: toy.createdAt.toISOString(),
      updatedAt: toy.updatedAt.toISOString(),
    };

    const validatedToy = ToySchema.parse(parsedToy);

    return NextResponse.json({
      success: true,
      data: validatedToy,
    });
  } catch (error) {
    console.error("Error fetching toy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch toy" },
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
        { success: false, error: "Invalid toy ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateToySchema.parse(body);

    const collection = await getCollection("toys");
    const now = new Date();

    const updateData = {
      ...validatedData,
      updatedAt: now,
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Toy not found" },
        { status: 404 }
      );
    }

    const parsedToy = {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    const validatedToy = ToySchema.parse(parsedToy);

    return NextResponse.json({
      success: true,
      data: validatedToy,
    });
  } catch (error) {
    console.error("Error updating toy:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid toy data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update toy" },
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
        { success: false, error: "Invalid toy ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("toys");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Toy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Toy deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting toy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete toy" },
      { status: 500 }
    );
  }
}
