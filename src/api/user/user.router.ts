import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import {
  GetUserSchema,
  UserRoleEnum,
  UserUpdateValidationSchema,
  UserValidationSchema,
} from "@/common/utils/schema";
import { authController } from "../auth/auth.controller";
import { userController } from "./user.controller";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserValidationSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserValidationSchema), "Success"),
});

userRouter.get("/", userController.getUsersByRole);

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserValidationSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

userRegistry.registerPath({
  method: "patch",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    body: {
      content: { "application/json": { schema: UserUpdateValidationSchema } },
    },
  },
  responses: createApiResponse(UserValidationSchema, "Success"),
});
userRouter.patch(
  "/:id",
  validateRequest(UserUpdateValidationSchema),
  authController.restrictTo(UserRoleEnum.ADMIN),
  userController.updateEmployeeRecord
);

userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  responses: createApiResponse(UserValidationSchema, "Success"),
});

userRouter.delete(
  "/:id",
  validateRequest(GetUserSchema),
  authController.restrictTo(UserRoleEnum.ADMIN),
  userController.deleteUser
);
