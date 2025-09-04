import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UserSchema } from "@/models/schemas";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<unknown>("/users");
      return UserSchema.array().parse(response);
    },
  });
};

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get<unknown>(`/users/${id}`);
      return UserSchema.parse(response);
    },
    enabled: !!id,
  });
};