'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useGuitarsQuery } from '@/hooks/use-guitar-query';

export function GuitarList() {
  const { data: guitars, isLoading, error } = useGuitarsQuery();

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
        <p className="text-red-600">Error loading guitars: {error.message}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure MongoDB is connected and try creating sample data
        </p>
      </div>
    );
  }

  if (!guitars || guitars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No guitars found</p>
        <p className="text-sm text-gray-500">
          Try running: <code>POST /api/sample-data</code> to create sample guitars
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guitars.map((guitar) => (
        <Card key={guitar._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            {guitar.image && (
              <img
                src={guitar.image}
                alt={guitar.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <CardTitle className="text-lg">{guitar.name}</CardTitle>
            <p className="text-sm text-gray-600">{guitar.brand} {guitar.model}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-amber-600">
                ${guitar.price.toLocaleString()}
              </p>
              {guitar.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {guitar.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {guitar.strings} strings
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {guitar.bodyType}
                </span>
                {guitar.inStock ? (
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