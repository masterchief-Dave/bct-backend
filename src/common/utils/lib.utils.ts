import { env } from "./envConfig";

const cookieExpiry = new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);

export { cookieExpiry };
