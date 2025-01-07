import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { analyticsService } from "./analytics.service";

class AnalyticsController {
  async getEmployeeAnalytics(req: Request, res: Response) {
    try {
      const analytics = await analyticsService.getEmployeeAnalytics();
      res.status(StatusCodes.OK).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to fetch analytics",
      });
    }
  }
}

export const analyticsController = new AnalyticsController();
