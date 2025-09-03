import { useQuery } from "@tanstack/react-query";
import { Car } from "@/lib/schemas/car.schema";

const fetchCars = async (): Promise<Car[]> => {
  const response = await fetch("/api/car");
  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }
  return response.json();
};

const fetchCar = async (id: string): Promise<Car> => {
  const response = await fetch(`/api/car/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch car");
  }
  return response.json();
};

export const useCarQuery = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });
};

export const useCarByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCar(id),
    enabled: !!id,
  });
};