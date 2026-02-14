import { Routes } from '@/routes'
import type { MenuItemConfig } from './types'

/**
 * Avatar dropdown links (English). Shown when user clicks avatar in header.
 */
export function getAvatarLinks(): MenuItemConfig[] {
  return [
    {
      title: 'Dashboard',
      href: Routes.Dashboard,
      icon: 'LayoutDashboard',
    },
    {
      title: 'Billing',
      href: Routes.SettingsBilling,
      icon: 'CreditCard',
    },
    {
      title: 'Settings',
      href: Routes.SettingsProfile,
      icon: 'Settings2',
    },
  ]
}
