import { z } from "zod";

export const planeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  airline: z.string().min(1, "Airline is required"),
  price: z.number().positive("Price must be positive"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  model: z.string().min(1, "Model is required"),
  range: z.number().positive("Range must be positive"),
});

export const planeUpdateSchema = planeSchema.partial();

export type Plane = z.infer<typeof planeSchema>;
export type PlaneUpdate = z.infer<typeof planeUpdateSchema>;
