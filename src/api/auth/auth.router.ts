import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { loginSchema, registerSchema } from "@/common/utils/schema";
import { AuthValidationSchema } from "../user/user.model";
import { authController } from "./auth.controller";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  responses: createApiResponse(z.array(AuthValidationSchema), "success"),
});

authRouter.post("/auth/login", validateRequest(loginSchema), authController.login);

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  responses: createApiResponse(z.array(AuthValidationSchema), "success"),
});

authRouter.post("/auth/register", validateRequest(registerSchema), authController.register);
