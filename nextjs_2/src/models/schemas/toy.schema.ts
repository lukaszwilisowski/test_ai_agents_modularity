import { z } from "zod";

export const ToySchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Toy name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["action_figures", "dolls", "board_games", "puzzles", "educational", "outdoor", "building_sets", "electronic"]),
  ageRange: z.string().min(1, "Age range is required"), // e.g., "3-5", "6-8", "8+"
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  specifications: z.object({
    material: z.string().optional(), // e.g., "plastic", "wood", "fabric"
    dimensions: z.string().optional(), // e.g., "12 x 8 x 6 inches"
    weight: z.string().optional(), // e.g., "1.5 lbs"
    batteryRequired: z.boolean().optional(),
    numberOfPieces: z.number().int().positive().optional(),
  }),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

export const CreateToySchema = ToySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateToySchema = CreateToySchema.partial();

export type Toy = z.infer<typeof ToySchema>;
export type CreateToy = z.infer<typeof CreateToySchema>;
export type UpdateToy = z.infer<typeof UpdateToySchema>;
