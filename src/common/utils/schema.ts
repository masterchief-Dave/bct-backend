import { z } from "zod";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
  EMPLOYEE = "employee",
}

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

export const UserValidationSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum([UserRole.USER, UserRole.EMPLOYEE, UserRole.ADMIN]),
  department: z.string().min(2).max(100),
  salary: z.number().positive(),
  password: z.string().min(6),
  joinedAt: z.date(),
});

export const UserUpdateValidationSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum([UserRole.USER, UserRole.EMPLOYEE, UserRole.ADMIN]).optional(),
  department: z.string().min(2).max(100).optional(),
  salary: z.number().positive().optional(),
});

export const EmployeeUpdateValidationSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  department: z.string().min(2).max(100).optional(),
});

export const AuthValidationSchema = z.object({
  data: UserValidationSchema,
  token: z.string(),
  createdAt: z.date(),
});

export const GetUserSchema = z.object({
  params: z.object({ id: z.string() }),
});

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
