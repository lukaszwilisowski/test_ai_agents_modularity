import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Must be a valid URL").optional(),
  category: z.string().optional(),
  inStock: z.boolean().default(true),
});

export type Product = z.infer<typeof productSchema>;