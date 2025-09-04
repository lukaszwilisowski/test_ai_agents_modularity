import { z } from "zod";

export const CarSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Car name is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["sedan", "suv", "hatchback", "coupe", "convertible", "truck"]),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  specifications: z.object({
    engine: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: z.string().optional(),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .optional(),
    mileage: z.number().min(0).optional(),
  }),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

export const CreateCarSchema = CarSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCarSchema = CreateCarSchema.partial();

export type Car = z.infer<typeof CarSchema>;
export type CreateCar = z.infer<typeof CreateCarSchema>;
export type UpdateCar = z.infer<typeof UpdateCarSchema>;
