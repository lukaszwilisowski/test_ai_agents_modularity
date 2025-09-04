import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GuitarSchema } from "@/models/schemas";

export const useGuitarsQuery = () => {
  return useQuery({
    queryKey: ["guitars"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>("/guitars");
      if (!response.success) {
        throw new Error("Failed to fetch guitars");
      }
      return GuitarSchema.array().parse(response.data);
    },
  });
};

export const useGuitarQuery = (id: string) => {
  return useQuery({
    queryKey: ["guitars", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(`/guitars/${id}`);
      if (!response.success) {
        throw new Error("Failed to fetch guitar");
      }
      return GuitarSchema.parse(response.data);
    },
    enabled: !!id,
  });
};