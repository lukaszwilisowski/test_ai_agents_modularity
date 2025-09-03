"use client";

import { useQuery } from "@tanstack/react-query";
import type { Drums } from "@/lib/schemas/drums.schema";

async function fetchDrums(): Promise<Drums[]> {
  const response = await fetch("/api/drums");
  if (!response.ok) {
    throw new Error("Failed to fetch drums");
  }
  return response.json();
}

async function fetchDrumsById(id: string): Promise<Drums> {
  const response = await fetch(`/api/drums/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch drums");
  }
  return response.json();
}

export function useDrumsQuery() {
  return useQuery({
    queryKey: ["drums"],
    queryFn: fetchDrums,
  });
}

export function useDrumsQueryById(id: string) {
  return useQuery({
    queryKey: ["drums", id],
    queryFn: () => fetchDrumsById(id),
    enabled: !!id,
  });
}
