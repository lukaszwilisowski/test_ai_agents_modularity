import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { GuitarSchema, UpdateGuitarSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid guitar ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("guitars");
    const guitar = await collection.findOne({ _id: new ObjectId(id) });

    if (!guitar) {
      return NextResponse.json(
        { success: false, error: "Guitar not found" },
        { status: 404 }
      );
    }

    const parsedGuitar = {
      ...guitar,
      _id: guitar._id.toString(),
      createdAt: guitar.createdAt.toISOString(),
      updatedAt: guitar.updatedAt.toISOString(),
    };

    const validatedGuitar = GuitarSchema.parse(parsedGuitar);

    return NextResponse.json({
      success: true,
      data: validatedGuitar,
    });
  } catch (error) {
    console.error("Error fetching guitar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guitar" },
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
        { success: false, error: "Invalid guitar ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateGuitarSchema.parse(body);
    
    const collection = await getCollection("guitars");
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
        { success: false, error: "Guitar not found" },
        { status: 404 }
      );
    }

    const parsedGuitar = {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    const validatedGuitar = GuitarSchema.parse(parsedGuitar);

    return NextResponse.json({
      success: true,
      data: validatedGuitar,
    });
  } catch (error) {
    console.error("Error updating guitar:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid guitar data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update guitar" },
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
        { success: false, error: "Invalid guitar ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("guitars");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Guitar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Guitar deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting guitar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete guitar" },
      { status: 500 }
    );
  }
}