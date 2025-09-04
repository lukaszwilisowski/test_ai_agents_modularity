import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ComputerSchema, UpdateComputerSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid computer ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("computers");
    const computer = await collection.findOne({ _id: new ObjectId(id) });

    if (!computer) {
      return NextResponse.json(
        { success: false, error: "Computer not found" },
        { status: 404 }
      );
    }

    const parsedComputer = {
      ...computer,
      _id: computer._id.toString(),
      createdAt: computer.createdAt.toISOString(),
      updatedAt: computer.updatedAt.toISOString(),
    };

    const validatedComputer = ComputerSchema.parse(parsedComputer);

    return NextResponse.json({
      success: true,
      data: validatedComputer,
    });
  } catch (error) {
    console.error("Error fetching computer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch computer" },
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
        { success: false, error: "Invalid computer ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateComputerSchema.parse(body);

    const collection = await getCollection("computers");
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
        { success: false, error: "Computer not found" },
        { status: 404 }
      );
    }

    const parsedComputer = {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    const validatedComputer = ComputerSchema.parse(parsedComputer);

    return NextResponse.json({
      success: true,
      data: validatedComputer,
    });
  } catch (error) {
    console.error("Error updating computer:", error);
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
      { success: false, error: "Failed to update computer" },
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
        { success: false, error: "Invalid computer ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("computers");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Computer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Computer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting computer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete computer" },
      { status: 500 }
    );
  }
}
