import { z } from 'zod';

export const guitarSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  image: z.string().url('Must be a valid URL').optional(),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  strings: z.number().int().min(4).max(12).default(6),
  bodyType: z.enum(['solid', 'hollow', 'semi-hollow']).default('solid'),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createGuitarSchema = guitarSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateGuitarSchema = createGuitarSchema.partial();

export type Guitar = z.infer<typeof guitarSchema>;
export type CreateGuitar = z.infer<typeof createGuitarSchema>;
export type UpdateGuitar = z.infer<typeof updateGuitarSchema>;