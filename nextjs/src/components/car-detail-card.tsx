"use client";

import { Car } from "@/lib/schemas/car.schema";

interface CarDetailCardProps {
  car: Car;
}

export function CarDetailCard({ car }: CarDetailCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
      <div className="space-y-2 text-gray-600">
        <p><span className="font-medium">Brand:</span> {car.brand}</p>
        <p><span className="font-medium">Year:</span> {car.year}</p>
        <p><span className="font-medium">Color:</span> {car.color}</p>
        <p><span className="font-medium">Mileage:</span> {car.mileage.toLocaleString()} miles</p>
        <p className="text-lg font-bold text-green-600">
          ${car.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}