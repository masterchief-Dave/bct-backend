import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";

export class AuthService {
  async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return ServiceResponse.failure("No user found", null, StatusCodes.NOT_FOUND);
      }
      // compare the user password if it matches with the one in the database
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return ServiceResponse.failure("Invalid credentials wrong password or email!", null, StatusCodes.FORBIDDEN);
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
        StatusCodes.ACCEPTED,
      );
    } catch (error) {
      const errorMessage = `Error authenticating user: $${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while authenticating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const authService = new AuthService();
