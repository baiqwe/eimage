import { websiteConfig } from './config/website';

export const Routes = {
  Root: '/',
  Login: '/auth/login',
  Register: '/auth/register',
  AuthError: '/auth/error',
  ForgotPassword: '/auth/forgot-password',
  ResetPassword: '/auth/reset-password',
  TermsOfService: '/terms',
  PrivacyPolicy: '/privacy',
  Dashboard: '/dashboard',
  // Marketing & app routes (for config links)
  Features: '/features',
  Pricing: '/pricing',
  Blog: '/blog',
  Docs: '/docs',
  About: '/about',
  Contact: '/contact',
  Waitlist: '/waitlist',
  Roadmap: '/roadmap',
  Changelog: '/changelog',
  FAQ: '/faq',
  CookiePolicy: '/cookie-policy',
  // Settings
  SettingsProfile: '/dashboard/settings/profile',
  SettingsBilling: '/dashboard/settings/billing',
  SettingsCredits: '/dashboard/settings/credits',
  SettingsSecurity: '/dashboard/settings/security',
  SettingsNotifications: '/dashboard/settings/notifications',
  AdminUsers: '/dashboard/admin/users',
} as const;

export const DEFAULT_LOGIN_REDIRECT =
  websiteConfig.routes.defaultLoginRedirect ?? Routes.Dashboard;
