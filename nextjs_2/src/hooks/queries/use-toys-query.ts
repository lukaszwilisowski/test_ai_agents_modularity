import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ToySchema } from "@/models/schemas";

export const useToysQuery = () => {
  return useQuery({
    queryKey: ["toys"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>("/toys");
      if (!response.success) {
        throw new Error("Failed to fetch toys");
      }
      return ToySchema.array().parse(response.data);
    },
  });
};

export const useToyQuery = (id: string) => {
  return useQuery({
    queryKey: ["toys", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(`/toys/${id}`);
      if (!response.success) {
        throw new Error("Failed to fetch toy");
      }
      return ToySchema.parse(response.data);
    },
    enabled: !!id,
  });
};
