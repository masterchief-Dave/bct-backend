import { env } from "@/common/utils/envConfig";
import { cookieExpiry } from "@/common/utils/lib.utils";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { ExtendedUser } from "../user/user.model";

class AuthController {
  public login: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response = await authService.login(email, password);

    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }

    return res
      .status(StatusCodes.OK)
      .cookie("auth_token", response.responseObject!.token as string, {
        expires: cookieExpiry,
        httpOnly: true,
        secure: env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/",
      })
      .json(response);
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    const payload = req.body;
    const response = await authService.register(payload);
    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created", data: { ...response.responseObject } });
  };

  public authenticate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let token: string | null;
    if (String(req.headers.authorization).startsWith("Bearer ")) {
      token = req.headers.authorization?.split(" ")[1] || null;
    } else {
      token = req.headers.cookie || null;
    }

    if (!token)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Login to access resource",
        statusCode: StatusCodes.UNAUTHORIZED,
      });

    const response = await authService.authenticate(token);
    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }

    req.user = response.responseObject as ExtendedUser;
    next();
  };

  public restrictTo = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.user && !roles.includes(req.user._doc.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "You do not have permission to perform this action",
        });
      }
      next();
    };
  };
}

export const authController = new AuthController();

/**
 *   static logout = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
      res
        .clearCookie(
          process.env.NODE_ENV === "development"
            ? "sage_warehouse_token"
            : "__Host-sage_warehouse_token"
        )
        .header("Authorization", "")
        .status(200)
        .json({
          success: true,
          message: "User logged out",
        })
    }
  )

 */
