"use client";

import { useQuery } from "@tanstack/react-query";
import type { Laptop } from "@/lib/schemas/laptop.schema";

async function fetchLaptops(): Promise<Laptop[]> {
  const response = await fetch("/api/laptop");
  if (!response.ok) {
    throw new Error("Failed to fetch laptops");
  }
  return response.json();
}

async function fetchLaptop(id: string): Promise<Laptop> {
  const response = await fetch(`/api/laptop/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch laptop");
  }
  return response.json();
}

export function useLaptopsQuery() {
  return useQuery({
    queryKey: ["laptops"],
    queryFn: fetchLaptops,
  });
}

export function useLaptopQuery(id: string) {
  return useQuery({
    queryKey: ["laptop", id],
    queryFn: () => fetchLaptop(id),
    enabled: !!id,
  });
}
