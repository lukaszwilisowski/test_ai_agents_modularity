"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateDrums,
  UpdateDrums,
  Drums,
} from "@/lib/schemas/drums.schema";

async function createDrums(data: CreateDrums): Promise<Drums> {
  const response = await fetch("/api/drums", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create drums");
  }

  return response.json();
}

async function updateDrums(id: string, data: UpdateDrums): Promise<Drums> {
  const response = await fetch(`/api/drums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update drums");
  }

  return response.json();
}

async function deleteDrums(id: string): Promise<void> {
  const response = await fetch(`/api/drums/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete drums");
  }
}

export function useCreateDrumsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDrums,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drums"] });
    },
  });
}

export function useUpdateDrumsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDrums }) =>
      updateDrums(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drums"] });
      queryClient.invalidateQueries({ queryKey: ["drums", variables.id] });
    },
  });
}

export function useDeleteDrumsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDrums,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drums"] });
    },
  });
}
