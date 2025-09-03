import { z } from "zod";

export const drumsSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Must be a valid URL").optional(),
  brand: z.string().min(1, "Brand is required"),
  drumModel: z.string().min(1, "Drum model is required"),
  pieces: z.number().int().min(3).max(20).default(5),
  drumType: z.enum(["acoustic", "electronic", "hybrid"]).default("acoustic"),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createDrumsSchema = drumsSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDrumsSchema = createDrumsSchema.partial();

export type Drums = z.infer<typeof drumsSchema>;
export type CreateDrums = z.infer<typeof createDrumsSchema>;
export type UpdateDrums = z.infer<typeof updateDrumsSchema>;
