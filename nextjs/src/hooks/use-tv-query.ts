"use client";

import { useQuery } from "@tanstack/react-query";
import type { Tv } from "@/lib/schemas/tv.schema";

async function fetchTvs(): Promise<Tv[]> {
  const response = await fetch("/api/tv");
  if (!response.ok) {
    throw new Error("Failed to fetch TVs");
  }
  return response.json();
}

async function fetchTv(id: string): Promise<Tv> {
  const response = await fetch(`/api/tv/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch TV");
  }
  return response.json();
}

export function useTvsQuery() {
  return useQuery({
    queryKey: ["tvs"],
    queryFn: fetchTvs,
  });
}

export function useTvQuery(id: string) {
  return useQuery({
    queryKey: ["tv", id],
    queryFn: () => fetchTv(id),
    enabled: !!id,
  });
}
