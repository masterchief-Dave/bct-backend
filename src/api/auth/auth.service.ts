import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import type { Register } from "@/common/utils/schema";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, UserRole } from "../user/user.model";
import argon2 from "argon2";

export class AuthService {
  async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return ServiceResponse.failure(
          "No user found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      // compare the user password if it matches with the one in the database
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return ServiceResponse.failure(
          "Invalid credentials wrong password or email!",
          null,
          StatusCodes.FORBIDDEN
        );
      }

      const token = user.getJwtToken();

      return ServiceResponse.success(
        "Success",
        {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          token,
        },
        StatusCodes.OK
      );
    } catch (error) {
      console.log({ error });
      const errorMessage = `Error authenticating user: $${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while authenticating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // protected route
  async register(payload: User) {
    try {
      // create the user
      const isUserExisting = await User.findOne({ email: payload.email });
      if (isUserExisting) {
        return ServiceResponse.failure(
          "User already exists",
          {},
          StatusCodes.CONFLICT
        );
      }
      const hashedPassword = await argon2.hash(payload.password);
      const user = await User.create({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: UserRole.EMPLOYEE,
        department: payload.department,
        salary: payload.salary,
        password: hashedPassword,
        joinedAt: payload.joinedAt,
      });
      if (!user) {
        return ServiceResponse.failure(
          "Error occurred while creating user",
          {},
          StatusCodes.BAD_REQUEST
        );
      }

      return ServiceResponse.success(
        "Success",
        { ...user.toObject(), password: "__" },
        StatusCodes.CREATED
      );
    } catch (error) {
      const errorMessage = `Bad request $${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        errorMessage,
        {},
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async authenticate(payload: string) {
    try {
      const decoded = jwt.verify(payload, env.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id);
      if (!user)
        return ServiceResponse.failure(
          "Invalid user",
          null,
          StatusCodes.BAD_REQUEST
        );
      if (user.changedPasswordAfter(decoded.iat!)) {
        return ServiceResponse.failure(
          "User recently changed password",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return ServiceResponse.success("Success", { ...user }, StatusCodes.OK);
    } catch (error) {
      console.log(error);
      const errorMessage = `Bad request $${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while verifying user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = new AuthService();
