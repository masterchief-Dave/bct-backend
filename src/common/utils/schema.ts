import { UserRole } from "@/api/user/user.model";
import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum([UserRole.EMPLOYEE]),
    department: z.string(),
    salary: z.number().positive(),
    joinedAt: z.preprocess((arg) => {
      if (typeof arg === "string") {
        return new Date(arg);
      }
      return arg;
    }, z.date()),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;

/**
 * export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    role: z.enum([UserRole.EMPLOYEE]),
    department: z.string(),
    salary: z.number().positive(),
    joinedAt: z.date(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
 */
