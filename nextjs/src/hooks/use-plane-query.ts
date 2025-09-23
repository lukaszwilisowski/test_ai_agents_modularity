import { useQuery } from "@tanstack/react-query";
import { Plane } from "@/lib/schemas/plane.schema";

const fetchPlanes = async (): Promise<Plane[]> => {
  const response = await fetch("/api/plane");
  if (!response.ok) {
    throw new Error("Failed to fetch planes");
  }
  return response.json();
};

const fetchPlane = async (id: string): Promise<Plane> => {
  const response = await fetch(`/api/plane/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch plane");
  }
  return response.json();
};

export const usePlaneQuery = () => {
  return useQuery({
    queryKey: ["planes"],
    queryFn: fetchPlanes,
  });
};

export const usePlaneByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["plane", id],
    queryFn: () => fetchPlane(id),
    enabled: !!id,
  });
};
