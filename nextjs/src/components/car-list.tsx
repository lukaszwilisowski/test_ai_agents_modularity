"use client";

import { useCarQuery } from "@/hooks/use-car-query";
import { CarDetailCard } from "./car-detail-card";

export function CarList() {
  const { data: cars, isLoading, error } = useCarQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading cars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
        Error loading cars: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        No cars found. Add some cars to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car: any) => (
        <CarDetailCard key={car._id} car={car} />
      ))}
    </div>
  );
}