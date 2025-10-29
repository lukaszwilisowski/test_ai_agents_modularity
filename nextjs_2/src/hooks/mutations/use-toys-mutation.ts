import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateToySchema, UpdateToySchema, ToySchema } from "@/models/schemas";
import type { CreateToy, UpdateToy } from "@/models/types";

export const useCreateToyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toyData: CreateToy) => {
      const validatedData = CreateToySchema.parse(toyData);
      const response = await api.post<{ success: boolean; data: unknown }>("/toys", validatedData);
      if (!response.success) {
        throw new Error("Failed to create toy");
      }
      return ToySchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toys"] });
    },
  });
};

export const useUpdateToyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, toyData }: { id: string; toyData: UpdateToy }) => {
      const validatedData = UpdateToySchema.parse(toyData);
      const response = await api.put<{ success: boolean; data: unknown }>(`/toys/${id}`, validatedData);
      if (!response.success) {
        throw new Error("Failed to update toy");
      }
      return ToySchema.parse(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["toys"] });
      queryClient.invalidateQueries({ queryKey: ["toys", variables.id] });
    },
  });
};

export const useDeleteToyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ success: boolean }>(`/toys/${id}`);
      if (!response.success) {
        throw new Error("Failed to delete toy");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["toys"] });
      queryClient.removeQueries({ queryKey: ["toys", id] });
    },
  });
};
