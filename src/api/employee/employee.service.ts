import { ServiceResponse } from "@/common/models/serviceResponse";
import { ExtendedUser, User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";

class EmployeeService {
  async updateEmployeeRecord(id: string, payload: ExtendedUser) {
    try {
      const employee = await User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      }).select("-password");
      if (!employee) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("User updated", employee, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error updating user $${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        `An error occurred while updating user.`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const employeeService = new EmployeeService();
