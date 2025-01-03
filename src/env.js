import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    OSS_REGION: z.string(),
    OSS_ACCESS_KEY_ID: z.string(),
    OSS_ACCESS_KEY_SECRET: z.string(),
    OSS_BUCKET: z.string(),

    EASEMOB_WS_URL: z.string(),
    EASEMOB_API_URL: z.string(),

    PAYPAL_CLIENT_ID: z.string(),
    PAYPAL_CLIENT_SECRET: z.string(),
    PAYPAL_API_URL: z.string(),

    EASEMOB_APP_KEY: z.string(),
    EASEMOB_CLIENT_ID: z.string(),
    EASEMOB_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string(),


  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    OSS_REGION: process.env.OSS_REGION,
    OSS_ACCESS_KEY_ID: process.env.OSS_ACCESS_KEY_ID,
    OSS_ACCESS_KEY_SECRET: process.env.OSS_ACCESS_KEY_SECRET,
    OSS_BUCKET: process.env.OSS_BUCKET,

    EASEMOB_WS_URL: process.env.EASEMOB_WS_URL,
    EASEMOB_API_URL: process.env.EASEMOB_API_URL,

    EASEMOB_APP_KEY: process.env.EASEMOB_APP_KEY,
    EASEMOB_CLIENT_ID: process.env.EASEMOB_CLIENT_ID,
    EASEMOB_CLIENT_SECRET:
      process.env.EASEMOB_CLIENT_SECRET,

    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_API_URL: process.env.PAYPAL_API_URL,

    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
