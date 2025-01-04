import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import {
  EmployeeUpdateValidationSchema,
  UserRoleEnum,
  UserValidationSchema,
} from "@/common/utils/schema";
import { authController } from "../auth/auth.controller";
import { employeeController } from "./employee.controller";

export const employeeRegistry = new OpenAPIRegistry();
export const employeeRouter: Router = express.Router();

employeeRegistry.registerPath({
  method: "patch",
  path: "/employees/{id}",
  tags: ["Employee"],
  request: {
    body: {
      content: {
        "application/json": { schema: EmployeeUpdateValidationSchema },
      },
    },
  },
  responses: createApiResponse(UserValidationSchema, "Success"),
});

employeeRouter.patch(
  "/:id",
  validateRequest(EmployeeUpdateValidationSchema),
  authController.restrictTo(UserRoleEnum.EMPLOYEE),
  employeeController.updateEmployeeRecord
);
