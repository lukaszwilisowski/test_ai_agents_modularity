import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateGuitarSchema, UpdateGuitarSchema, GuitarSchema } from "@/models/schemas";
import type { CreateGuitar, UpdateGuitar } from "@/models/types";

export const useCreateGuitarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guitarData: CreateGuitar) => {
      const validatedData = CreateGuitarSchema.parse(guitarData);
      const response = await api.post<{ success: boolean; data: unknown }>("/guitars", validatedData);
      if (!response.success) {
        throw new Error("Failed to create guitar");
      }
      return GuitarSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guitars"] });
    },
  });
};

export const useUpdateGuitarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, guitarData }: { id: string; guitarData: UpdateGuitar }) => {
      const validatedData = UpdateGuitarSchema.parse(guitarData);
      const response = await api.put<{ success: boolean; data: unknown }>(`/guitars/${id}`, validatedData);
      if (!response.success) {
        throw new Error("Failed to update guitar");
      }
      return GuitarSchema.parse(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guitars"] });
      queryClient.invalidateQueries({ queryKey: ["guitars", variables.id] });
    },
  });
};

export const useDeleteGuitarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ success: boolean }>(`/guitars/${id}`);
      if (!response.success) {
        throw new Error("Failed to delete guitar");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["guitars"] });
      queryClient.removeQueries({ queryKey: ["guitars", id] });
    },
  });
};