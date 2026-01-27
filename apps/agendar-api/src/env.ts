import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PORTAL_CONFIG_ID: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FIREBASE_SERVICE_ACCOUNT_KEY_ENCODED_JSON: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_EMAIL: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
})

export const env = envSchema.parse(process.env)
