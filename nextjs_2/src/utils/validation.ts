import { ZodError } from "zod";

export const formatValidationError = (error: ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join("."),
    message: err.message,
  }));
};

export const isValidationError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};