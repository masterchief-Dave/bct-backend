import type { User } from "@/api/user/user.model";

export class UserRepository {
  async findAllAsync(): Promise<User[]> {
    return [];
  }

  async findByIdAsync(id: number): Promise<User | null> {
    return null;
  }
}
