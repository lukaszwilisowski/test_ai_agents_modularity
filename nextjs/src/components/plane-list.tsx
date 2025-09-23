"use client";

import { usePlaneQuery } from "@/hooks/use-plane-query";
import { PlaneDetailCard } from "./plane-detail-card";

export function PlaneList() {
  const { data: planes, isLoading, error } = usePlaneQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading planes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
        Error loading planes: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!planes || planes.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        No planes found. Add some planes to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {planes.map((plane: any) => (
        <PlaneDetailCard key={plane._id} plane={plane} />
      ))}
    </div>
  );
}
