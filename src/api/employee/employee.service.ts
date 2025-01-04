import { ExtendedUser, User } from "../user/user.model";

class EmployeeService {
  async updateEmployeeRecord(id: string, payload: ExtendedUser) {}
}

export const employeeService = new EmployeeService();
