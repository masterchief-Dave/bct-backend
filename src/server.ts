import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/user.router";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { authRouter } from "./api/auth/auth.router";

import mongoose from "mongoose";

const logger = pino({ name: "server start" });
const app: Express = express();

// Connect to Database
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
connectToDB().catch(console.dir);
// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
