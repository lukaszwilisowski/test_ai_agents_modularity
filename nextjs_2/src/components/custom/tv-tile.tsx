import type { TV } from "@/models/types";
import Link from "next/link";

interface TVTileProps {
  tv: TV;
}

export function TVTile({ tv }: TVTileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border">
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img
          src={tv.imageUrl}
          alt={tv.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{tv.name}</h3>
          <span className="text-sm text-gray-500">{tv.brand}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${tv.price}</span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              tv.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {tv.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="capitalize">{tv.type}</span>
          <span>{tv.stockCount} available</span>
        </div>

        {tv.specifications?.screenSize && (
          <div className="text-sm text-gray-600">
            {tv.specifications.screenSize}" screen
            {tv.specifications.resolution &&
              ` • ${tv.specifications.resolution}`}
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-2">{tv.description}</p>

        <Link
          href={`/tvs/${tv._id}` as any}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
