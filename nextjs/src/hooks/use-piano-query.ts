import { Piano } from "@/lib/schemas/piano.schema";
import { useQuery } from "@tanstack/react-query";

const fetchPianos = async (): Promise<Piano[]> => {
  const response = await fetch("/api/piano");
  if (!response.ok) {
    throw new Error("Failed to fetch pianos");
  }
  return response.json();
};

const fetchPiano = async (id: string): Promise<Piano> => {
  const response = await fetch(`/api/piano/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch piano");
  }
  return response.json();
};

export const usePianosQuery = () => {
  return useQuery({
    queryKey: ["pianos"],
    queryFn: fetchPianos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePianoQuery = (id: string) => {
  return useQuery({
    queryKey: ["piano", id],
    queryFn: () => fetchPiano(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
