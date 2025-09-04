import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateUserSchema, UpdateUserSchema, UserSchema } from "@/models/schemas";
import type { CreateUser, UpdateUser } from "@/models/types";

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUser) => {
      const validatedData = CreateUserSchema.parse(userData);
      const response = await api.post<unknown>("/users", validatedData);
      return UserSchema.parse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UpdateUser }) => {
      const validatedData = UpdateUserSchema.parse(userData);
      const response = await api.put<unknown>(`/users/${id}`, validatedData);
      return UserSchema.parse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["users", id] });
    },
  });
};