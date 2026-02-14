import { Routes } from '@/routes'
import type { MenuItemConfig } from './types'
import { websiteConfig } from './website'

/**
 * Navbar links (English only, no i18n). Icon keys for UI to map to components.
 */
export function getNavbarLinks(): MenuItemConfig[] {
  const links: MenuItemConfig[] = [
    { title: 'Features', href: Routes.Features, external: false },
    { title: 'Pricing', href: Routes.Pricing, external: false },
  ]
  if (websiteConfig.blog?.enable) {
    links.push({ title: 'Blog', href: Routes.Blog, external: false })
  }
  if (websiteConfig.docs?.enable) {
    links.push({ title: 'Docs', href: Routes.Docs, external: false })
  }
  links.push({
    title: 'Pages',
    items: [
      {
        title: 'About',
        description: 'Learn more about us',
        href: Routes.About,
        icon: 'Building',
        external: false,
      },
      {
        title: 'Contact',
        description: 'Get in touch',
        href: Routes.Contact,
        icon: 'Mail',
        external: false,
      },
      {
        title: 'Waitlist',
        description: 'Join the waitlist',
        href: Routes.Waitlist,
        icon: 'Mailbox',
        external: false,
      },
      {
        title: 'Roadmap',
        description: 'Product roadmap',
        href: Routes.Roadmap,
        icon: 'SquareKanban',
        external: false,
      },
      {
        title: 'Changelog',
        description: 'Release notes',
        href: Routes.Changelog,
        icon: 'ListChecks',
        external: false,
      },
      {
        title: 'Cookie Policy',
        description: 'Cookie policy',
        href: Routes.CookiePolicy,
        icon: 'Cookie',
        external: false,
      },
      {
        title: 'Privacy Policy',
        description: 'Privacy policy',
        href: Routes.PrivacyPolicy,
        icon: 'ShieldCheck',
        external: false,
      },
      {
        title: 'Terms of Service',
        description: 'Terms of service',
        href: Routes.TermsOfService,
        icon: 'FileText',
        external: false,
      },
    ],
  })
  return links
}
