import { z } from "zod";

export const tvSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Must be a valid URL").optional(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  screenSize: z
    .number()
    .int()
    .min(10)
    .max(100, "Screen size must be between 10 and 100 inches"),
  resolution: z.enum(["720p", "1080p", "4K", "8K"]).default("1080p"),
  displayType: z.enum(["LED", "OLED", "QLED", "LCD"]).default("LED"),
  smartTV: z.boolean().default(true),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createTvSchema = tvSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTvSchema = createTvSchema.partial();

export type Tv = z.infer<typeof tvSchema>;
export type CreateTv = z.infer<typeof createTvSchema>;
export type UpdateTv = z.infer<typeof updateTvSchema>;
