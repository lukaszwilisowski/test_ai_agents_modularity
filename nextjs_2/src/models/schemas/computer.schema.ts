import { z } from "zod";

export const ComputerSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Computer name is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["desktop", "laptop", "workstation", "gaming"]),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  specifications: z.object({
    processor: z.string().optional(),
    memory: z.string().optional(), // RAM (e.g., "16GB DDR4")
    storage: z.string().optional(), // Storage (e.g., "512GB SSD")
    graphics: z.string().optional(), // GPU (e.g., "NVIDIA RTX 4070")
    operatingSystem: z.string().optional(),
  }),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

export const CreateComputerSchema = ComputerSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateComputerSchema = CreateComputerSchema.partial();

export type Computer = z.infer<typeof ComputerSchema>;
export type CreateComputer = z.infer<typeof CreateComputerSchema>;
export type UpdateComputer = z.infer<typeof UpdateComputerSchema>;
