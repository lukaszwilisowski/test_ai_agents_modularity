'use client';

import { useQuery } from '@tanstack/react-query';
import { Guitar } from '@/lib/schemas/guitar.schema';

async function fetchGuitars(): Promise<Guitar[]> {
  const response = await fetch('/api/guitar');
  if (!response.ok) {
    throw new Error('Failed to fetch guitars');
  }
  return response.json();
}

async function fetchGuitar(id: string): Promise<Guitar> {
  const response = await fetch(`/api/guitar/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch guitar');
  }
  return response.json();
}

export function useGuitarsQuery() {
  return useQuery({
    queryKey: ['guitars'],
    queryFn: fetchGuitars,
  });
}

export function useGuitarQuery(id: string) {
  return useQuery({
    queryKey: ['guitar', id],
    queryFn: () => fetchGuitar(id),
    enabled: !!id,
  });
}