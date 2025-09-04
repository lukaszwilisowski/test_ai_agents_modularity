import Link from "next/link";
import type { Car } from "@/models/types";

interface CarTileProps {
  car: Car;
}

export function CarTile({ car }: CarTileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border">
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{car.name}</h3>
          <span className="text-sm text-gray-500">{car.brand}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${car.price.toLocaleString()}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              car.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {car.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="capitalize">{car.type}</span>
          <span>{car.stockCount} available</span>
        </div>

        {car.specifications.year && (
          <div className="text-sm text-gray-600">
            <span>{car.specifications.year}</span>
            {car.specifications.engine && (
              <span> • {car.specifications.engine}</span>
            )}
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-2">{car.description}</p>

        <Link
          href={`/cars/${car._id}` as any}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
