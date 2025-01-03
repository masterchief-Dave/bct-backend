import { env } from "@/common/utils/envConfig";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { type Document, Schema, model } from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  EMPLOYEE = "employee",
}

export type User = z.infer<typeof UserValidationSchema>;
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

export const AuthValidationSchema = z.object({
  data: UserValidationSchema,
  token: z.string(),
  createdAt: z.date(),
});

interface IUser extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: UserRole;
  department: string;
  salary: number;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  getJwtToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
  changedPasswordAfter: (JwtTimestamp: number) => boolean;
  generatePasswordResetToken: () => string;
}

// Input Validation for 'GET users/:id' endpoint
// export const GetUserSchema = z.object({
//   params: z.object({ id: commonValidations.id }),
// });
export const GetUserSchema = z.object({
  params: z.object({ id: z.string() }),
});
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    joinedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const validateUserData = async (userData: unknown) => {
  try {
    const validateData = UserValidationSchema.parse(userData);
    return { success: true, data: validateData };
  } catch (error) {
    return { success: false, error };
  }
};

userSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) {
    throw new Error("Password field not selected");
  }
  return await argon2.verify(this.password, password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES,
  });
};

userSchema.methods.changedPasswordAfter = function (JwtTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return JwtTimestamp < changedTimestamp;
  }
  return false;
};

export const User = model<IUser>("User", userSchema);
