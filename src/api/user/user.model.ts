import { env } from "@/common/utils/envConfig";
import {
  DepartmentEnum,
  UserRoleEnum,
  UserValidationSchema,
} from "@/common/utils/schema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { type Document, Schema, model } from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserValidationSchema>;
export type ExtendedUser = User & {
  _id: string;
};

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: UserRoleEnum;
  department: DepartmentEnum;
  salary: number;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  getJwtToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
  changedPasswordAfter: (JwtTimestamp: number) => boolean;
  generatePasswordResetToken: () => string;
}

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
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.EMPLOYEE,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      enum: Object.values(DepartmentEnum),
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
