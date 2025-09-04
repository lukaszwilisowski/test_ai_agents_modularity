import { api } from "@/lib/api";
import { CreateTVSchema, TVSchema, UpdateTVSchema } from "@/models/schemas";
import type { CreateTV, UpdateTV } from "@/models/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTVMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tvData: CreateTV) => {
      const validatedData = CreateTVSchema.parse(tvData);
      const response = await api.post<{ success: boolean; data: unknown }>(
        "/tvs",
        validatedData
      );
      if (!response.success) {
        throw new Error("Failed to create TV");
      }
      return TVSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tvs"] });
    },
  });
};

export const useUpdateTVMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTV }) => {
      const validatedData = UpdateTVSchema.parse(data);
      const response = await api.put<{ success: boolean; data: unknown }>(
        `/tvs/${id}`,
        validatedData
      );
      if (!response.success) {
        throw new Error("Failed to update TV");
      }
      return TVSchema.parse(response.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tvs"] });
      queryClient.invalidateQueries({ queryKey: ["tvs", data._id] });
    },
  });
};

export const useDeleteTVMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{
        success: boolean;
        data: { id: string };
      }>(`/tvs/${id}`);
      if (!response.success) {
        throw new Error("Failed to delete TV");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tvs"] });
      queryClient.removeQueries({ queryKey: ["tvs", data.id] });
    },
  });
};
