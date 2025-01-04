import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import {
  AuthValidationSchema,
  loginSchema,
  registerSchema,
  UserRoleEnum,
} from "@/common/utils/schema";
import { authController } from "./auth.controller";

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
  authController.restrictTo(UserRoleEnum.ADMIN),
  authController.register
);

authRouter.get(
  "/session",
  authController.authenticate,
  authController.getSession
);
