import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ComputerSchema } from "@/models/schemas";

export const useComputersQuery = () => {
  return useQuery({
    queryKey: ["computers"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(
        "/computers"
      );
      if (!response.success) {
        throw new Error("Failed to fetch computers");
      }
      return ComputerSchema.array().parse(response.data);
    },
  });
};

export const useComputerQuery = (id: string) => {
  return useQuery({
    queryKey: ["computers", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(
        `/computers/${id}`
      );
      if (!response.success) {
        throw new Error("Failed to fetch computer");
      }
      return ComputerSchema.parse(response.data);
    },
    enabled: !!id,
  });
};
