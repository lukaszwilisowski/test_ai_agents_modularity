import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number(),
  totalPages: z.number(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
export type ApiError = z.infer<typeof ApiErrorSchema>;