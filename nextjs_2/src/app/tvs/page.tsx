"use client";

import { TVTile } from "@/components/custom/tv-tile";
import { useCreateTVMutation } from "@/hooks/mutations";
import { useTVsQuery } from "@/hooks/queries";
import Link from "next/link";

export default function TVsPage() {
  const { data: tvs, isLoading, error } = useTVsQuery();
  const createTVMutation = useCreateTVMutation();

  const handleAddExample = () => {
    const exampleTV = {
      name: "4K OLED Smart TV",
      brand: "Samsung",
      type: "oled" as const,
      price: 1999.99,
      description:
        "Premium OLED TV with stunning 4K resolution, vibrant colors, and smart features. Perfect for movies and gaming.",
      imageUrl:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      inStock: true,
      stockCount: 3,
      specifications: {
        screenSize: 55,
        resolution: "4K",
        refreshRate: 120,
        smartTV: true,
        hdr: true,
        ports: "4x HDMI, 2x USB",
      },
    };

    createTVMutation.mutate(exampleTV);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading TVs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load TVs</p>
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
          <h1 className="text-3xl font-bold mb-2">TVs</h1>
          <p className="text-gray-600">
            Discover our amazing collection of televisions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddExample}
            disabled={createTVMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTVMutation.isPending ? "Adding..." : "Add Example"}
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {!tvs || tvs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No TVs available at the moment</p>
          <p className="text-sm text-gray-500">
            Check back later for new arrivals
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tvs.map((tv) => (
            <TVTile key={tv._id} tv={tv} />
          ))}
        </div>
      )}
    </div>
  );
}
