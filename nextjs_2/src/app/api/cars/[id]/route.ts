import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CarSchema, UpdateCarSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid car ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("cars");
    const car = await collection.findOne({ _id: new ObjectId(id) });

    if (!car) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    const parsedCar = {
      ...car,
      _id: car._id.toString(),
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    };

    const validatedCar = CarSchema.parse(parsedCar);

    return NextResponse.json({
      success: true,
      data: validatedCar,
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch car" },
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
        { success: false, error: "Invalid car ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateCarSchema.parse(body);

    const collection = await getCollection("cars");
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
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    const parsedCar = {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    const validatedCar = CarSchema.parse(parsedCar);

    return NextResponse.json({
      success: true,
      data: validatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid car data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update car" },
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
        { success: false, error: "Invalid car ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("cars");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
