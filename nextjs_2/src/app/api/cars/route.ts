import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { CreateCarSchema, CarSchema } from "@/models/schemas";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const collection = await getCollection("cars");
    const cars = await collection.find({}).toArray();

    const parsedCars = cars.map((car) => ({
      ...car,
      _id: car._id.toString(),
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    }));

    const validatedCars = CarSchema.array().parse(parsedCars);

    return NextResponse.json({
      success: true,
      data: validatedCars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateCarSchema.parse(body);

    const collection = await getCollection("cars");
    const now = new Date();

    const carToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(carToInsert);

    const createdCar = {
      ...carToInsert,
      _id: result.insertedId.toString(),
      createdAt: carToInsert.createdAt.toISOString(),
      updatedAt: carToInsert.updatedAt.toISOString(),
    };

    const validatedCar = CarSchema.parse(createdCar);

    return NextResponse.json(
      {
        success: true,
        data: validatedCar,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating car:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid car data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create car" },
      { status: 500 }
    );
  }
}
