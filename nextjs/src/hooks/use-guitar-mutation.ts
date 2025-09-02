'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateGuitar, UpdateGuitar, Guitar } from '@/lib/schemas/guitar.schema';

async function createGuitar(data: CreateGuitar): Promise<Guitar> {
  const response = await fetch('/api/guitar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create guitar');
  }
  
  return response.json();
}

async function updateGuitar(id: string, data: UpdateGuitar): Promise<Guitar> {
  const response = await fetch(`/api/guitar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update guitar');
  }
  
  return response.json();
}

async function deleteGuitar(id: string): Promise<void> {
  const response = await fetch(`/api/guitar/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete guitar');
  }
}

export function useCreateGuitarMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createGuitar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guitars'] });
    },
  });
}

export function useUpdateGuitarMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGuitar }) =>
      updateGuitar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guitars'] });
      queryClient.invalidateQueries({ queryKey: ['guitar', variables.id] });
    },
  });
}

export function useDeleteGuitarMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteGuitar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guitars'] });
    },
  });
}