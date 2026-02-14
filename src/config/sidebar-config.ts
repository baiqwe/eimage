import { Routes } from '@/routes'
import type { MenuItemConfig } from './types'
import { websiteConfig } from './website'

/**
 * Dashboard sidebar links (English only). Icon keys for UI to map.
 */
export function getSidebarLinks(): MenuItemConfig[] {
  const creditsEnabled = websiteConfig.credits?.enableCredits ?? false

  return [
    {
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      href: Routes.Dashboard,
      external: false,
    },
    {
      title: 'Admin',
      icon: 'Settings',
      authorizeOnly: ['admin'],
      items: [
        {
          title: 'Users',
          icon: 'UsersRound',
          href: Routes.AdminUsers,
          external: false,
        },
      ],
    },
    {
      title: 'Settings',
      icon: 'Settings2',
      items: [
        {
          title: 'Profile',
          icon: 'CircleUserRound',
          href: Routes.SettingsProfile,
          external: false,
        },
        {
          title: 'Billing',
          icon: 'CreditCard',
          href: Routes.SettingsBilling,
          external: false,
        },
        ...(creditsEnabled
          ? [
              {
                title: 'Credits',
                icon: 'Coins',
                href: Routes.SettingsCredits,
                external: false,
              } as MenuItemConfig,
            ]
          : []),
        {
          title: 'Security',
          icon: 'LockKeyhole',
          href: Routes.SettingsSecurity,
          external: false,
        },
        {
          title: 'Notifications',
          icon: 'Bell',
          href: Routes.SettingsNotifications,
          external: false,
        },
      ],
    },
  ]
}
