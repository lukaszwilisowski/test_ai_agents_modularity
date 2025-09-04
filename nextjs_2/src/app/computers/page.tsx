"use client";

import { useComputersQuery } from "@/hooks/queries";
import { useCreateComputerMutation } from "@/hooks/mutations";
import { ComputerTile } from "@/components/custom/computer-tile";
import Link from "next/link";

export default function ComputersPage() {
  const { data: computers, isLoading, error } = useComputersQuery();
  const createComputerMutation = useCreateComputerMutation();

  const handleAddExample = () => {
    const exampleComputer = {
      name: "Gaming Beast Pro",
      brand: "ASUS",
      type: "gaming" as const,
      price: 2499.99,
      description:
        "High-performance gaming computer with cutting-edge components. Perfect for 4K gaming and content creation.",
      imageUrl:
        "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop",
      inStock: true,
      stockCount: 3,
      specifications: {
        processor: "Intel Core i7-13700K",
        memory: "32GB DDR5",
        storage: "1TB NVMe SSD",
        graphics: "NVIDIA RTX 4070",
        operatingSystem: "Windows 11 Pro",
      },
    };

    createComputerMutation.mutate(exampleComputer);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading computers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load computers</p>
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
          <h1 className="text-3xl font-bold mb-2">Computers</h1>
          <p className="text-gray-600">
            Discover our powerful collection of computers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddExample}
            disabled={createComputerMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createComputerMutation.isPending ? "Adding..." : "Add Example"}
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {!computers || computers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            No computers available at the moment
          </p>
          <p className="text-sm text-gray-500">
            Check back later for new arrivals
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {computers.map((computer) => (
            <ComputerTile key={computer._id} computer={computer} />
          ))}
        </div>
      )}
    </div>
  );
}
