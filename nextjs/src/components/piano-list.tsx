"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { usePianosQuery } from "@/hooks/use-piano-query";

export function PianoList() {
  const { data: pianos, isLoading, error } = usePianosQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-48 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading pianos: {error.message}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure MongoDB is connected and try creating sample data
        </p>
      </div>
    );
  }

  if (!pianos || pianos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No pianos found</p>
        <p className="text-sm text-gray-500">
          Try running: <code>POST /api/sample-data</code> to create sample
          pianos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pianos.map((piano) => (
        <Card key={piano._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {piano.image && (
              <img
                src={piano.image}
                alt={piano.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <CardTitle className="text-lg">{piano.name}</CardTitle>
            <p className="text-sm text-gray-600">
              {piano.brand} {piano.model}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-purple-600">
                ${piano.price.toLocaleString()}
              </p>
              {piano.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {piano.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {piano.keys} keys
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  {piano.type}
                </span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                  {piano.size}
                </span>
                {piano.inStock ? (
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
