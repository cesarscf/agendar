import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  VITE_API_URL: z.string(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
});

export const env = envSchema.parse(import.meta.env);
