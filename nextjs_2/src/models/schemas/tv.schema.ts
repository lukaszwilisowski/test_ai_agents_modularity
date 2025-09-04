import { z } from "zod";

export const TVSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "TV name is required"),
  brand: z.string().min(1, "Brand is required"),
  type: z.enum(["led", "oled", "qled", "plasma"]),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  specifications: z.object({
    screenSize: z.number().positive().optional(), // in inches
    resolution: z.string().optional(), // "4K", "1080p", "8K", etc.
    refreshRate: z.number().positive().optional(), // in Hz
    smartTV: z.boolean().optional(),
    hdr: z.boolean().optional(),
    ports: z.string().optional(), // HDMI, USB counts
  }),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

export const CreateTVSchema = TVSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTVSchema = CreateTVSchema.partial();

export type TV = z.infer<typeof TVSchema>;
export type CreateTV = z.infer<typeof CreateTVSchema>;
export type UpdateTV = z.infer<typeof UpdateTVSchema>;
