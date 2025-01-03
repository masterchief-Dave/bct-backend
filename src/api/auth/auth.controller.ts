import { env } from "@/common/utils/envConfig";
import { cookieExpiry } from "@/common/utils/lib.utils";
import type { Request, RequestHandler, Response } from "express";
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

  public register: RequestHandler = async (_req: Request, res: Response) => {
    //
  };
}

export const authController = new AuthController();
