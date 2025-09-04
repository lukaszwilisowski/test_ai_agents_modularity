import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  CreateComputerSchema,
  UpdateComputerSchema,
  ComputerSchema,
} from "@/models/schemas";
import type { CreateComputer, UpdateComputer } from "@/models/types";

export const useCreateComputerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (computerData: CreateComputer) => {
      const validatedData = CreateComputerSchema.parse(computerData);
      const response = await api.post<{ success: boolean; data: unknown }>(
        "/computers",
        validatedData
      );
      if (!response.success) {
        throw new Error("Failed to create computer");
      }
      return ComputerSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["computers"] });
    },
  });
};

export const useUpdateComputerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      computerData,
    }: {
      id: string;
      computerData: UpdateComputer;
    }) => {
      const validatedData = UpdateComputerSchema.parse(computerData);
      const response = await api.put<{ success: boolean; data: unknown }>(
        `/computers/${id}`,
        validatedData
      );
      if (!response.success) {
        throw new Error("Failed to update computer");
      }
      return ComputerSchema.parse(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["computers"] });
      queryClient.invalidateQueries({ queryKey: ["computers", variables.id] });
    },
  });
};

export const useDeleteComputerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ success: boolean }>(
        `/computers/${id}`
      );
      if (!response.success) {
        throw new Error("Failed to delete computer");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["computers"] });
      queryClient.removeQueries({ queryKey: ["computers", id] });
    },
  });
};
