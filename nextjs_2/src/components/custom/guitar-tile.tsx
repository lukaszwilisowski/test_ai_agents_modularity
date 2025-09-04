import Link from "next/link";
import type { Guitar } from "@/models/types";

interface GuitarTileProps {
  guitar: Guitar;
}

export function GuitarTile({ guitar }: GuitarTileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border">
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img 
          src={guitar.imageUrl} 
          alt={guitar.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{guitar.name}</h3>
          <span className="text-sm text-gray-500">{guitar.brand}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${guitar.price}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            guitar.inStock 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {guitar.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="capitalize">{guitar.type}</span>
          <span>{guitar.stockCount} available</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{guitar.description}</p>
        
        <Link 
          href={`/guitars/${guitar._id}`}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}