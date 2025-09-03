import { z } from "zod";

export const laptopSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Must be a valid URL").optional(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  processor: z.string().min(1, "Processor is required"),
  ram: z.number().int().positive("RAM must be positive"),
  storage: z.number().int().positive("Storage must be positive"),
  screenSize: z.number().positive("Screen size must be positive"),
  operatingSystem: z
    .enum(["Windows", "macOS", "Linux", "Chrome OS"])
    .default("Windows"),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createLaptopSchema = laptopSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLaptopSchema = createLaptopSchema.partial();

export type Laptop = z.infer<typeof laptopSchema>;
export type CreateLaptop = z.infer<typeof createLaptopSchema>;
export type UpdateLaptop = z.infer<typeof updateLaptopSchema>;
