"use client";

import { useGuitarsQuery } from "@/hooks/queries";
import { useCreateGuitarMutation } from "@/hooks/mutations";
import { GuitarTile } from "@/components/custom/guitar-tile";
import Link from "next/link";

export default function GuitarsPage() {
  const { data: guitars, isLoading, error } = useGuitarsQuery();
  const createGuitarMutation = useCreateGuitarMutation();

  const handleAddExample = () => {
    const exampleGuitar = {
      name: "Stratocaster Classic",
      brand: "Fender",
      type: "electric" as const,
      price: 1299.99,
      description: "A classic electric guitar with iconic tone and playability. Perfect for rock, blues, and pop music.",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      inStock: true,
      stockCount: 5,
      specifications: {
        bodyType: "Solid",
        neckType: "Maple",
        frets: 21,
        pickups: "3x Single Coil",
      },
    };

    createGuitarMutation.mutate(exampleGuitar);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading guitars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load guitars</p>
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
          <h1 className="text-3xl font-bold mb-2">Guitars</h1>
          <p className="text-gray-600">Discover our amazing collection of guitars</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddExample}
            disabled={createGuitarMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createGuitarMutation.isPending ? "Adding..." : "Add Example"}
          </button>
          <Link 
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {!guitars || guitars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No guitars available at the moment</p>
          <p className="text-sm text-gray-500">Check back later for new arrivals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guitars.map((guitar) => (
            <GuitarTile key={guitar._id} guitar={guitar} />
          ))}
        </div>
      )}
    </div>
  );
}