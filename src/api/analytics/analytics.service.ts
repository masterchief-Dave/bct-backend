import { AnalyticsData, UserRoleEnum } from "@/common/utils/schema";
import { User } from "../user/user.model";

class AnalyticsService {
  async getEmployeeAnalytics(): Promise<AnalyticsData> {
    try {
      // Get total number of employees
      const totalEmployees = await User.countDocuments({
        role: UserRoleEnum.EMPLOYEE,
      });

      // Get count of employees by department
      const departments = [
        "Engineering",
        "HR",
        "Sales",
        "Marketing",
        "Operations",
      ];
      const departmentCounts = await Promise.all(
        departments.map(async (dept) => ({
          department: dept,
          count: await User.countDocuments({
            role: UserRoleEnum.EMPLOYEE,
            department: dept,
          }),
        }))
      );

      return {
        totalEmployees,
        departmentCounts,
      };
    } catch (error) {
      throw new Error(`Error fetching analytics: ${error}`);
    }
  }
}

export const analyticsService = new AnalyticsService();
