import { Request, RequestHandler, Response } from "express";
import { employeeService } from "./employee.service";
import { ExtendedUser } from "../user/user.model";

class EmployeeController {
  public updateEmployeeRecord: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const user = req.user as ExtendedUser;

    const response = await employeeService.updateEmployeeRecord(
      user._id,
      req.body
    );

    // if (!response.success) {
    //   return res.status(response.statusCode).json(response);
    // }

    // return handleServiceResponse(response, res);
  };
}

export const employeeController = new EmployeeController();
