import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CarSchema } from "@/models/schemas";

export const useCarsQuery = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(
        "/cars"
      );
      if (!response.success) {
        throw new Error("Failed to fetch cars");
      }
      return CarSchema.array().parse(response.data);
    },
  });
};

export const useCarQuery = (id: string) => {
  return useQuery({
    queryKey: ["cars", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(
        `/cars/${id}`
      );
      if (!response.success) {
        throw new Error("Failed to fetch car");
      }
      return CarSchema.parse(response.data);
    },
    enabled: !!id,
  });
};
