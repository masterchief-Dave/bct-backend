import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { AnalyticsResponseSchema } from "@/common/utils/schema";
import { analyticsController } from "./analytics.controller";

export const analyticsRegistry = new OpenAPIRegistry();
export const analyticsRouter: Router = express.Router();

analyticsRegistry.registerPath({
  method: "get",
  path: "/analytics/employees",
  tags: ["Analytics"],
  responses: createApiResponse(AnalyticsResponseSchema, "Success"),
});

analyticsRouter.get("/employees", analyticsController.getEmployeeAnalytics);
