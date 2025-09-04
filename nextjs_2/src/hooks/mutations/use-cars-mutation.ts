import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateCarSchema, UpdateCarSchema, CarSchema } from "@/models/schemas";
import type { CreateCar, UpdateCar } from "@/models/types";

export const useCreateCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carData: CreateCar) => {
      const validatedData = CreateCarSchema.parse(carData);
      const response = await api.post<{ success: boolean; data: unknown }>(
        "/cars",
        validatedData
      );
      if (!response.success) {
        throw new Error("Failed to create car");
      }
      return CarSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};

export const useUpdateCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, carData }: { id: string; carData: UpdateCar }) => {
      const validatedData = UpdateCarSchema.parse(carData);
      const response = await api.put<{ success: boolean; data: unknown }>(
        `/cars/${id}`,
        validatedData
      );
      if (!response.success) {
        throw new Error("Failed to update car");
      }
      return CarSchema.parse(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars", variables.id] });
    },
  });
};

export const useDeleteCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ success: boolean }>(`/cars/${id}`);
      if (!response.success) {
        throw new Error("Failed to delete car");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.removeQueries({ queryKey: ["cars", id] });
    },
  });
};
