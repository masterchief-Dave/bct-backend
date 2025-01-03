import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGODB_URI: str({ devDefault: testOnly("mongodb://localhost:27017") }),
  JWT_SECRET: str({ devDefault: testOnly("secret") }),
  JWT_EXPIRES: str({ devDefault: testOnly("1h") }),
  JWT_COOKIE_EXPIRES_IN: num({ devDefault: testOnly(50) }),
  ADMIN_EMAIL: str({ devDefault: testOnly("admin@example.com") }),
  ADMIN_PASSWORD: str({ devDefault: testOnly("pass123") }),
});
