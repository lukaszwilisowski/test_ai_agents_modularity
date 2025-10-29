"use client";

import { useToysQuery } from "@/hooks/queries";
import { useCreateToyMutation } from "@/hooks/mutations";
import { ToyTile } from "@/components/custom/toy-tile";
import Link from "next/link";

export default function ToysPage() {
  const { data: toys, isLoading, error } = useToysQuery();
  const createToyMutation = useCreateToyMutation();

  const handleAddExample = () => {
    const exampleToy = {
      name: "Building Block Set",
      brand: "LEGO",
      category: "building_sets" as const,
      ageRange: "6-12",
      price: 49.99,
      description: "A creative building set with 500+ pieces. Perfect for imaginative play and developing fine motor skills.",
      imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop",
      inStock: true,
      stockCount: 12,
      specifications: {
        material: "Plastic",
        dimensions: "15 x 10 x 3 inches",
        weight: "2 lbs",
        batteryRequired: false,
        numberOfPieces: 500,
      },
    };

    createToyMutation.mutate(exampleToy);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Loading toys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load toys</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
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
          <h1 className="text-3xl font-bold mb-2">Toys</h1>
          <p className="text-gray-600">Discover our amazing collection of toys</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddExample}
            disabled={createToyMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createToyMutation.isPending ? "Adding..." : "Add Example"}
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {!toys || toys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No toys available at the moment</p>
          <p className="text-sm text-gray-500">Check back later for new arrivals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toys.map((toy) => (
            <ToyTile key={toy._id} toy={toy} />
          ))}
        </div>
      )}
    </div>
  );
}
