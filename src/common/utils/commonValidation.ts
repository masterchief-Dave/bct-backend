import type { NextFunction, Request, Response } from "express";
import { type AnyZodObject, ZodError, z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations
};

export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      // If validation fails, return formatted error response
      if (error instanceof ZodError) {
        return res.status(422).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      // Handle unexpected errors
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
};
