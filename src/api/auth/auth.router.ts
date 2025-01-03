import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { loginSchema, registerSchema } from "@/common/utils/schema";
import { AuthValidationSchema, UserRole } from "../user/user.model";
import { authController } from "./auth.controller";
import { logger } from "@/server";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", AuthValidationSchema);
authRegistry.register("Login", loginSchema);
authRegistry.register("Register", registerSchema);

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: loginSchema } } },
  },
  responses: createApiResponse(AuthValidationSchema, "success"),
});

authRouter.post("/login", validateRequest(loginSchema), authController.login);

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: registerSchema } } },
  },
  responses: createApiResponse(AuthValidationSchema, "success"),
});

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  authController.authenticate,
  authController.restrictTo(UserRole.ADMIN),
  authController.register
);
