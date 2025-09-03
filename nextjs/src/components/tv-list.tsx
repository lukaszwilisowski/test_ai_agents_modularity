"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useTvsQuery } from "@/hooks/use-tv-query";

export function TvList() {
  const { data: tvs, isLoading, error } = useTvsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={`loading-tv-${i}`} className="animate-pulse">
            <CardHeader>
              <div className="h-48 bg-gray-300 rounded mb-4" />
              <div className="h-6 bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading TVs: {error.message}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure MongoDB is connected and try creating sample data
        </p>
      </div>
    );
  }

  if (!tvs || tvs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No TVs found</p>
        <p className="text-sm text-gray-500">
          Try using the test button above to create sample TVs
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tvs.map((tv) => (
        <Card key={tv._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {tv.image && (
              <img
                src={tv.image}
                alt={tv.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <CardTitle className="text-lg">{tv.name}</CardTitle>
            <p className="text-sm text-gray-600">
              {tv.brand} {tv.model}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">
                ${tv.price.toLocaleString()}
              </p>
              {tv.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tv.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tv.screenSize}"
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  {tv.resolution}
                </span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                  {tv.displayType}
                </span>
                {tv.smartTV && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Smart TV
                  </span>
                )}
                {tv.inStock ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
