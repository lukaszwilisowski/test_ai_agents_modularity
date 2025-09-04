"use client";

import { useTVQuery } from "@/hooks/queries";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TVDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: tv, isLoading, error } = useTVQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading TV details...</p>
        </div>
      </div>
    );
  }

  if (error || !tv) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">TV not found or failed to load</p>
          <Link
            href="/tvs"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to TVs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/tvs"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to TVs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TV Image */}
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={tv.imageUrl}
            alt={tv.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TV Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tv.name}</h1>
            <p className="text-xl text-gray-600">{tv.brand}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-600">
              ${tv.price}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                tv.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {tv.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="capitalize">{tv.type}</span>
              </div>
              {tv.specifications?.screenSize && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Screen Size:</span>
                  <span>{tv.specifications.screenSize}"</span>
                </div>
              )}
              {tv.specifications?.resolution && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution:</span>
                  <span>{tv.specifications.resolution}</span>
                </div>
              )}
              {tv.specifications?.refreshRate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Refresh Rate:</span>
                  <span>{tv.specifications.refreshRate}Hz</span>
                </div>
              )}
              {tv.specifications?.smartTV !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Smart TV:</span>
                  <span>{tv.specifications.smartTV ? "Yes" : "No"}</span>
                </div>
              )}
              {tv.specifications?.hdr !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">HDR:</span>
                  <span>{tv.specifications.hdr ? "Yes" : "No"}</span>
                </div>
              )}
              {tv.specifications?.ports && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ports:</span>
                  <span>{tv.specifications.ports}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span>{tv.stockCount} available</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{tv.description}</p>
          </div>

          <button
            disabled={!tv.inStock}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              tv.inStock
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {tv.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
