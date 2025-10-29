import Link from "next/link";
import type { Toy } from "@/models/types";

interface ToyTileProps {
  toy: Toy;
}

export function ToyTile({ toy }: ToyTileProps) {
  const categoryDisplay = toy.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border">
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img
          src={toy.imageUrl}
          alt={toy.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{toy.name}</h3>
          <span className="text-sm text-gray-500">{toy.brand}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">${toy.price}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            toy.inStock
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {toy.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{categoryDisplay}</span>
          <span>Ages {toy.ageRange}</span>
        </div>

        <div className="text-sm text-gray-600">
          <span>{toy.stockCount} available</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{toy.description}</p>

        <Link
          href={`/toys/${toy._id}` as any}
          className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
