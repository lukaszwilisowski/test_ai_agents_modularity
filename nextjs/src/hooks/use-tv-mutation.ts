"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTv, UpdateTv, Tv } from "@/lib/schemas/tv.schema";

async function createTv(data: CreateTv): Promise<Tv> {
  const response = await fetch("/api/tv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create TV");
  }

  return response.json();
}

async function updateTv(id: string, data: UpdateTv): Promise<Tv> {
  const response = await fetch(`/api/tv/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update TV");
  }

  return response.json();
}

async function deleteTv(id: string): Promise<void> {
  const response = await fetch(`/api/tv/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete TV");
  }
}

export function useCreateTvMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tvs"] });
    },
  });
}

export function useUpdateTvMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTv }) =>
      updateTv(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tvs"] });
      queryClient.invalidateQueries({ queryKey: ["tv", variables.id] });
    },
  });
}

export function useDeleteTvMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tvs"] });
    },
  });
}
