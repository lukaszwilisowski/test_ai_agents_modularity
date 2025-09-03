import { z } from "zod";

export const pianoSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Must be a valid URL").optional(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  keys: z.number().int().min(25).max(108).default(88),
  type: z
    .enum(["acoustic", "digital", "electric", "hybrid"])
    .default("acoustic"),
  size: z
    .enum(["upright", "grand", "baby-grand", "compact", "full-size"])
    .default("upright"),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createPianoSchema = pianoSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePianoSchema = createPianoSchema.partial();

export type Piano = z.infer<typeof pianoSchema>;
export type CreatePiano = z.infer<typeof createPianoSchema>;
export type UpdatePiano = z.infer<typeof updatePianoSchema>;
