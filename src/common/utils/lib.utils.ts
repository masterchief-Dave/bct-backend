import { z } from "zod";
import { env } from "./envConfig";

const cookieExpiry = new Date(
  Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
);

// Helper function to create a case-insensitive enum schema
const createCaseInsensitiveEnum = <T extends { [k: string]: string }>(
  enumObj: T,
  errorMessage?: string
) => {
  const values = Object.values(enumObj);
  return z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(values as [string, ...string[]]).catch(values[0]))
    .superRefine((val, ctx) => {
      if (!values.includes(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          options: values,
          received: val,
          message:
            errorMessage ??
            `Invalid value. Expected one of: ${values.join(", ")}`,
        });
        return z.NEVER;
      }
    });
};

export { cookieExpiry, createCaseInsensitiveEnum };
