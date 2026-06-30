import {
  IconBell,
  IconCreditCard,
  IconFileUpload,
  IconKey,
  IconLayoutDashboard,
  IconLock,
  IconSettings2,
  IconShieldCheck,
  IconSparkles,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react';
import { Routes } from '@/lib/routes';
import {
  getProductBatchGeneratorPath,
  getProductGeneratorPath,
  getWhiteBackgroundGeneratorPath,
  type ProductLocale,
} from '@/components/product/product-locale';
import type { MenuItemConfig } from '../types';
import { messages } from '@/messages';
import { websiteConfig } from './website';

const m = messages.dashboard.sidebar;
const am = messages.admin;

const generatorLabels: Record<
  ProductLocale,
  { group: string; photoSet: string; batch: string; white: string }
> = {
  zh: {
    group: '生成器',
    photoSet: '套图生成器',
    batch: '批量生图',
    white: '白底图',
  },
  en: {
    group: 'Generators',
    photoSet: 'Photo set',
    batch: 'Batch editor',
    white: 'White background',
  },
  ja: {
    group: '生成ツール',
    photoSet: 'セット生成',
    batch: '一括編集',
    white: '白背景',
  },
  ko: {
    group: '생성기',
    photoSet: '세트 생성',
    batch: '배치 편집',
    white: '흰 배경',
  },
  es: {
    group: 'Generadores',
    photoSet: 'Set de fotos',
    batch: 'Editor por lotes',
    white: 'Fondo blanco',
  },
};

/**
 * Sidebar links
 */
export function getSidebarLinks(
  locale: ProductLocale = 'en'
): MenuItemConfig[] {
  const generator = generatorLabels[locale];
  return [
    {
      title: m.dashboard,
      icon: IconLayoutDashboard,
      href: Routes.Dashboard,
      external: false,
    },
    {
      title: generator.group,
      icon: IconSparkles,
      items: [
        {
          title: generator.photoSet,
          icon: IconSparkles,
          href: getProductGeneratorPath(locale),
          external: false,
        },
        {
          title: generator.batch,
          icon: IconSparkles,
          href: getProductBatchGeneratorPath(locale),
          external: false,
        },
        {
          title: generator.white,
          icon: IconSparkles,
          href: getWhiteBackgroundGeneratorPath(locale),
          external: false,
        },
      ],
      external: false,
    },
    {
      title: am.title,
      icon: IconShieldCheck,
      authorizeOnly: ['admin'],
      items: [
        {
          title: am.users.title,
          icon: IconUsers,
          href: Routes.AdminUsers,
          external: false,
        },
      ],
    },
    {
      title: m.settings,
      icon: IconSettings2,
      items: [
        {
          title: m.profile,
          icon: IconUserCircle,
          href: Routes.SettingsProfile,
          external: false,
        },
        ...(websiteConfig.payment?.enable
          ? [
              {
                title: m.billing,
                icon: IconCreditCard,
                href: Routes.SettingsBilling,
                external: false,
              },
            ]
          : []),
        {
          title: m.security,
          icon: IconLock,
          href: Routes.SettingsSecurity,
          external: false,
        },
        {
          title: m.files,
          icon: IconFileUpload,
          href: Routes.SettingsFiles,
          external: false,
        },
        {
          title: m.apiKeys,
          icon: IconKey,
          href: Routes.SettingsApiKeys,
          external: false,
        },
        ...(websiteConfig.newsletter?.enable
          ? [
              {
                title: m.notifications,
                icon: IconBell,
                href: Routes.SettingsNotifications,
                external: false,
              },
            ]
          : []),
      ],
    },
  ];
}
