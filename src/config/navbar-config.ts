import { Routes } from '@/lib/routes';
import type { ProductLocale } from '@/components/product/product-locale';
import {
  PRODUCT_TOOLS,
  PRODUCT_TOOL_NAV_GROUPS,
  getProductToolCopy,
} from '@/lib/product-tools';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

const NAV_COPY: Record<
  ProductLocale,
  {
    home: string;
    generator: string;
    gallery: string;
    tools: string;
    pricing: string;
    blog: string;
  }
> = {
  zh: {
    home: '首页',
    generator: '生成器',
    gallery: '画廊',
    tools: '工具',
    pricing: '定价',
    blog: '博客',
  },
  en: {
    home: 'Home',
    generator: 'Generator',
    gallery: 'Gallery',
    tools: 'Tools',
    pricing: 'Pricing',
    blog: 'Blog',
  },
  ja: {
    home: 'ホーム',
    generator: '生成ツール',
    gallery: 'ギャラリー',
    tools: 'ツール',
    pricing: '料金',
    blog: 'ブログ',
  },
  ko: {
    home: '홈',
    generator: '생성기',
    gallery: '갤러리',
    tools: '도구',
    pricing: '요금',
    blog: '블로그',
  },
  es: {
    home: 'Inicio',
    generator: 'Generador',
    gallery: 'Galería',
    tools: 'Herramientas',
    pricing: 'Precios',
    blog: 'Blog',
  },
};

/**
 * Navbar links
 */
export function getNavbarLinks(locale: ProductLocale = 'en'): MenuItemConfig[] {
  const copy = NAV_COPY[locale];
  const toolItems = PRODUCT_TOOL_NAV_GROUPS.flatMap((group) => {
    const groupTools = PRODUCT_TOOLS.filter(
      (tool) => tool.navGroup === group.id
    );
    const groupTitle = locale === 'zh' ? group.titleZh : group.title;
    return [
      {
        title: groupTitle,
        groupLabel: true,
        external: false,
      },
      ...groupTools.map((tool) => {
        const toolCopy = getProductToolCopy(tool, locale);
        return {
          title: locale === 'zh' ? tool.navTitleZh : toolCopy.title,
          description:
            locale === 'zh' ? tool.navDescriptionZh : tool.navDescription,
          href:
            locale === 'zh' ? `/zh/tools/${tool.slug}` : `/tools/${tool.slug}`,
          external: false,
        };
      }),
    ];
  });
  const links: MenuItemConfig[] = [
    { title: copy.home, href: Routes.Root, external: false },
    { title: copy.generator, href: Routes.Generator, external: false },
    {
      title: copy.gallery,
      href: locale === 'zh' ? '/zh/gallery' : Routes.Gallery,
      external: false,
    },
    {
      title: copy.tools,
      href: locale === 'zh' ? '/zh/tools' : Routes.Tools,
      external: false,
      items: toolItems,
    },
    { title: copy.pricing, href: Routes.Pricing, external: false },
  ];
  if (websiteConfig.blog?.enable) {
    links.push({ title: copy.blog, href: Routes.Blog, external: false });
  }
  return links;
}
