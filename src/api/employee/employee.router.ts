import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  EmployeeUpdateValidationSchema,
  UserValidationSchema,
} from "@/common/utils/schema";
import { validateRequest } from "@/common/utils/httpHandlers";
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
  employeeController.updateEmployeeRecord
);
