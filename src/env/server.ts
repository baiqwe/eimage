import { createEnv } from '@t3-oss/env-core';
import * as z from 'zod';

/**
 * Server-side env (runtime process.env; Worker vars/secrets populate it)
 */
export const serverEnv = createEnv({
  server: {
    // Defaults so CLI (e.g. auth:schema:generate via pnpm dlx) can run without loading .env.local
    VITE_BASE_URL: z.url().default('http://localhost:3000'),

    // Auth (Better Auth)
    BETTER_AUTH_SECRET: z.string().default('better-auth-secret'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // Mail and Newsletter (Resend / Beehiiv)
    RESEND_API_KEY: z.string().optional(),
    BEEHIIV_API_KEY: z.string().optional(),
    BEEHIIV_PUBLICATION_ID: z.string().optional(),

    // Payment (Stripe)
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },
  runtimeEnv: process.env,
});
