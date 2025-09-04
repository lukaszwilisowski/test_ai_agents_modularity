import { api } from "@/lib/api";
import { TVSchema } from "@/models/schemas";
import { useQuery } from "@tanstack/react-query";

export const useTVsQuery = () => {
  return useQuery({
    queryKey: ["tvs"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(
        "/tvs"
      );
      if (!response.success) {
        throw new Error("Failed to fetch TVs");
      }
      return TVSchema.array().parse(response.data);
    },
  });
};

export const useTVQuery = (id: string) => {
  return useQuery({
    queryKey: ["tvs", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(
        `/tvs/${id}`
      );
      if (!response.success) {
        throw new Error("Failed to fetch TV");
      }
      return TVSchema.parse(response.data);
    },
    enabled: !!id,
  });
};
