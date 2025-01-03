import { env } from "@/common/utils/envConfig";
import { cookieExpiry } from "@/common/utils/lib.utils";
import type { Register } from "@/common/utils/schema";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
  public login: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response = await authService.login(email, password);

    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }

    res
      .status(200)
      .json(response)
      .cookie("auth.token", response.responseObject!.token as string, {
        expires: cookieExpiry,
        httpOnly: true,
        secure: env.NODE_ENV !== "development",
        sameSite: "strict" as const,
        path: "/",
      });
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    const payload: Register = req.body;
    const response = await authService.register(payload);
  };

  public authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | null;
    if (String(req.headers.Authorization).startsWith("Bearer ")) {
      token = req.headers.authorization || null;
    } else {
      token = req.headers.cookie || null;
    }

    if (!token) return res.status(401).json({ message: "Login to access resource", statusCode: 401 });

    const response = await authService.authenticate(token);
    if (!response.success) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = response;
    next();
  };

  public restrictTo = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.user && !roles.includes(req.user.role)) {
        return res.status(403).json({
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

  static restrictTo = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (req.user && !roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        )
      }

      next()
    }
  }

 */
