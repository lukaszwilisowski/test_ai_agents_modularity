import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plane, PlaneUpdate } from "@/lib/schemas/plane.schema";

const createPlane = async (data: Plane): Promise<Plane> => {
  const response = await fetch("/api/plane", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create plane");
  }
  return response.json();
};

const updatePlane = async ({ id, data }: { id: string; data: PlaneUpdate }): Promise<Plane> => {
  const response = await fetch(`/api/plane/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update plane");
  }
  return response.json();
};

const deletePlane = async (id: string): Promise<void> => {
  const response = await fetch(`/api/plane/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete plane");
  }
};

export const useCreatePlaneMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPlane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
    },
  });
};

export const useUpdatePlaneMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatePlane,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      queryClient.invalidateQueries({ queryKey: ["plane", variables.id] });
    },
  });
};

export const useDeletePlaneMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePlane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
    },
  });
};
