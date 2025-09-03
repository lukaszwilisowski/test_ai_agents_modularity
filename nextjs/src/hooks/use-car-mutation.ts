import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Car, CarUpdate } from "@/lib/schemas/car.schema";

const createCar = async (data: Car): Promise<Car> => {
  const response = await fetch("/api/car", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create car");
  }
  return response.json();
};

const updateCar = async ({ id, data }: { id: string; data: CarUpdate }): Promise<Car> => {
  const response = await fetch(`/api/car/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update car");
  }
  return response.json();
};

const deleteCar = async (id: string): Promise<void> => {
  const response = await fetch(`/api/car/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete car");
  }
};

export const useCreateCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};

export const useUpdateCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCar,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["car", variables.id] });
    },
  });
};

export const useDeleteCarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.removeQueries({ queryKey: ["car", id] });
    },
  });
};