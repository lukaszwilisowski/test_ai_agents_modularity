import { CreatePiano, Piano, UpdatePiano } from "@/lib/schemas/piano.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createPiano = async (piano: CreatePiano): Promise<Piano> => {
  const response = await fetch("/api/piano", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(piano),
  });

  if (!response.ok) {
    throw new Error("Failed to create piano");
  }

  return response.json();
};

const updatePiano = async ({
  id,
  ...piano
}: UpdatePiano & { id: string }): Promise<Piano> => {
  const response = await fetch(`/api/piano/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(piano),
  });

  if (!response.ok) {
    throw new Error("Failed to update piano");
  }

  return response.json();
};

const deletePiano = async (id: string): Promise<void> => {
  const response = await fetch(`/api/piano/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete piano");
  }
};

export const useCreatePianoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPiano,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pianos"] });
    },
  });
};

export const useUpdatePianoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePiano,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pianos"] });
      queryClient.invalidateQueries({ queryKey: ["piano", data._id] });
    },
  });
};

export const useDeletePianoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePiano,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pianos"] });
    },
  });
};
