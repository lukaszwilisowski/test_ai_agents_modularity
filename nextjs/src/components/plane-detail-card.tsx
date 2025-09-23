"use client";

import { Plane } from "@/lib/schemas/plane.schema";

interface PlaneDetailCardProps {
  plane: Plane;
}

export function PlaneDetailCard({ plane }: PlaneDetailCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{plane.name}</h3>
      <div className="space-y-2 text-gray-600">
        <p><span className="font-medium">Airline:</span> {plane.airline}</p>
        <p><span className="font-medium">Model:</span> {plane.model}</p>
        <p><span className="font-medium">Capacity:</span> {plane.capacity} passengers</p>
        <p><span className="font-medium">Range:</span> {plane.range.toLocaleString()} km</p>
        <p className="text-lg font-bold text-green-600">
          ${plane.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
