"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateLaptop,
  UpdateLaptop,
  Laptop,
} from "@/lib/schemas/laptop.schema";

async function createLaptop(data: CreateLaptop): Promise<Laptop> {
  const response = await fetch("/api/laptop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create laptop");
  }

  return response.json();
}

async function updateLaptop(id: string, data: UpdateLaptop): Promise<Laptop> {
  const response = await fetch(`/api/laptop/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update laptop");
  }

  return response.json();
}

async function deleteLaptop(id: string): Promise<void> {
  const response = await fetch(`/api/laptop/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete laptop");
  }
}

export function useCreateLaptopMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLaptop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laptops"] });
    },
  });
}

export function useUpdateLaptopMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLaptop }) =>
      updateLaptop(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laptops"] });
      queryClient.invalidateQueries({ queryKey: ["laptop", variables.id] });
    },
  });
}

export function useDeleteLaptopMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLaptop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laptops"] });
    },
  });
}
