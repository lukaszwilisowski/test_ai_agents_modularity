import { z } from "zod";

export const GuitarSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Guitar name is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["acoustic", "electric", "bass"]),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  specifications: z.object({
    bodyType: z.string().optional(),
    neckType: z.string().optional(),
    frets: z.number().int().positive().optional(),
    pickups: z.string().optional(),
  }),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

export const CreateGuitarSchema = GuitarSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateGuitarSchema = CreateGuitarSchema.partial();

export type Guitar = z.infer<typeof GuitarSchema>;
export type CreateGuitar = z.infer<typeof CreateGuitarSchema>;
export type UpdateGuitar = z.infer<typeof UpdateGuitarSchema>;