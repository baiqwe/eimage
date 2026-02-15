import { env } from 'cloudflare:workers';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { getDb } from '@/db';
import { sendEmail } from '@/mail';
import { getBaseUrl } from '../lib/urls';
import { messages } from '@/config/messages';
import { websiteConfig } from '@/config/website';

/**
 * Better Auth Drizzle Adapter
 * https://www.better-auth.com/docs/adapters/drizzle
 * https://www.better-auth.com/docs/reference/options
 */
export const auth = betterAuth({
  baseURL: getBaseUrl(),
  appName: messages.site.name,
  database: drizzleAdapter(getDb(env.DB), {
    provider: 'sqlite',
  }),
  session: {
    // https://www.better-auth.com/docs/concepts/session-management#cookie-cache
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // Cache duration in seconds
    },
    // https://www.better-auth.com/docs/concepts/session-management#session-expiration
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    // https://www.better-auth.com/docs/concepts/session-management#session-freshness
    // https://www.better-auth.com/docs/concepts/users-accounts#authentication-requirements
    // disable freshness check for user deletion
    freshAge: 0 /* 60 * 60 * 24 */,
  },
  emailAndPassword: {
    // https://discord.com/channels/1300839113142046730/1300839113594769431/1454280549060444393
    enabled: websiteConfig.auth?.enableCredentialLogin ?? false,
    // https://www.better-auth.com/docs/concepts/email#2-require-email-verification
    requireEmailVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#forget-password
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        template: 'forgotPassword',
        context: { url, name: user.name ?? '' },
      });
    },
  },
  emailVerification: {
    // https://www.better-auth.com/docs/concepts/email#auto-signin-after-verification
    autoSignInAfterVerification: true,
    // https://www.better-auth.com/docs/authentication/email-password#require-email-verification
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        template: 'verifyEmail',
        context: { url, name: user.name ?? '' },
      });
    },
  },
  user: {
    // https://www.better-auth.com/docs/concepts/users-accounts#delete-user
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [tanstackStartCookies()],
  onAPIError: {
    // https://www.better-auth.com/docs/reference/options#onapierror
    errorURL: '/auth/error',
    onError: (error, ctx) => {
      console.error('auth error:', error);
    },
  },
});
