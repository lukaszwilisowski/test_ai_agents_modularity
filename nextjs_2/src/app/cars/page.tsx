"use client";

import { useCarsQuery } from "@/hooks/queries";
import { useCreateCarMutation } from "@/hooks/mutations";
import { CarTile } from "@/components/custom/car-tile";
import Link from "next/link";

export default function CarsPage() {
  const { data: cars, isLoading, error } = useCarsQuery();
  const createCarMutation = useCreateCarMutation();

  const handleAddExample = () => {
    const exampleCar = {
      name: "Model S",
      brand: "Tesla",
      type: "sedan" as const,
      price: 79999,
      description:
        "A luxury electric sedan with cutting-edge technology and impressive performance. Zero emissions with incredible range.",
      imageUrl:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
      inStock: true,
      stockCount: 3,
      specifications: {
        engine: "Electric Motor",
        transmission: "Single-Speed",
        fuelType: "Electric",
        year: 2024,
        mileage: 0,
      },
    };

    createCarMutation.mutate(exampleCar);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load cars</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cars</h1>
          <p className="text-gray-600">
            Discover our amazing collection of cars
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddExample}
            disabled={createCarMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCarMutation.isPending ? "Adding..." : "Add Example"}
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {!cars || cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No cars available at the moment</p>
          <p className="text-sm text-gray-500">
            Check back later for new arrivals
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarTile key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
