import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/user.service";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { User } from "./user.model";

class UserController {
  public getUsersByRole: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { role } = req.query;
    let response;
    if (!role) {
      response = await userService.findAll();
    } else {
      response = await userService.findAllByRole(String(role));
    }

    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }

    return handleServiceResponse(response, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const response = await userService.findById(id);
    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }
    return handleServiceResponse(response, res);
  };

  public updateEmployeeRecord: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = req.params.id as string;
    const payload = req.body as User;
    const response = await userService.updateEmployeeRecord(id, payload);
    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }
    return handleServiceResponse(response, res);
  };

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const response = await userService.deleteUser(id);
    return handleServiceResponse(response, res);
  };

  // public getUsers: RequestHandler = async (req: Request, res: Response) => {
  //   const { role } = req.query;
  //   let response;
  //   response = await userService.findAllByRole(String(role));

  //   return handleServiceResponse(response, res);
  // };
}

export const userController = new UserController();
