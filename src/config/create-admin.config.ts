import { User, UserRole } from "@/api/user/user.model";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import argon2 from "argon2";
import mongoose from "mongoose";

interface AdminConfig {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  salary: number;
}

const defaultAdminConfig: AdminConfig = {
  firstName: "Admin",
  lastName: "User",
  email: env.ADMIN_EMAIL,
  password: env.ADMIN_PASSWORD,
  department: "Administration",
  salary: 1,
};

async function connectToDB(): Promise<void> {
  try {
    const uri = env.MONGODB_URI;
    if (!uri) throw new Error("MongoDB uri is not defined");
    await mongoose.connect(uri);
    console.log("📦 Connected to MongoDB");
  } catch (error) {
    logger.error("MongoDB connection error: ", error);
    process.exit(1);
  }
}

async function createAdminUser(config: AdminConfig = defaultAdminConfig): Promise<void> {
  try {
    const isAdminExisting = await User.findOne({ email: config.email });
    if (isAdminExisting) {
      logger.info("Admin user already exists");
      process.exit(1);
    }

    const hashedPassword = await argon2.hash(config.password);
    const admin = new User({
      ...config,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    await admin.save();
    logger.info("Admin user created successfully");
    logger.info("Email: ", config.email);
    logger.info("Password: ", config.password);
  } catch (error) {
    logger.error("Error creating admin user: ", error);
    process.exit(1);
  }
}

async function main() {
  try {
    await connectToDB();
    await createAdminUser();

    await mongoose.disconnect();
    logger.info("Disconnnected from mongoDB");
    process.exit(0);
  } catch (error) {
    logger.error("Script execution failed: ", error);
    process.exit(1);
  }
}

main();
