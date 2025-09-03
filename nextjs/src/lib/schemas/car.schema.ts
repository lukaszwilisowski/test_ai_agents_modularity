import { z } from "zod";

export const carSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be positive"),
  year: z.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  color: z.string().min(1, "Color is required"),
  mileage: z.number().min(0, "Mileage cannot be negative"),
});

export const carUpdateSchema = carSchema.partial();

export type Car = z.infer<typeof carSchema>;
export type CarUpdate = z.infer<typeof carUpdateSchema>;