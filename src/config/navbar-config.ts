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
    singleGenerator: string;
    singleGeneratorDescription: string;
    batchGenerator: string;
    batchGeneratorDescription: string;
    gallery: string;
    tools: string;
    pricing: string;
    blog: string;
  }
> = {
  zh: {
    home: '首页',
    generator: '生成器',
    singleGenerator: '商品套图生成器',
    singleGeneratorDescription: '上传一张商品图，生成主图和详情场景图。',
    batchGenerator: '批量图片编辑',
    batchGeneratorDescription: '多张商品图共用一套指令，独立生成结果。',
    gallery: '画廊',
    tools: '工具',
    pricing: '定价',
    blog: '博客',
  },
  en: {
    home: 'Home',
    generator: 'Generator',
    singleGenerator: 'Product photo set',
    singleGeneratorDescription:
      'Upload one product image and create a full listing image set.',
    batchGenerator: 'Batch image editor',
    batchGeneratorDescription:
      'Apply one instruction to many product images as independent tasks.',
    gallery: 'Gallery',
    tools: 'Tools',
    pricing: 'Pricing',
    blog: 'Blog',
  },
  ja: {
    home: 'ホーム',
    generator: '生成ツール',
    singleGenerator: '商品セット生成',
    singleGeneratorDescription:
      '1 枚の商品画像からメイン画像とシーン画像を生成します。',
    batchGenerator: '一括画像編集',
    batchGeneratorDescription:
      '複数の商品画像に共通指示を適用し、個別に処理します。',
    gallery: 'ギャラリー',
    tools: 'ツール',
    pricing: '料金',
    blog: 'ブログ',
  },
  ko: {
    home: '홈',
    generator: '생성기',
    singleGenerator: '상품 이미지 세트',
    singleGeneratorDescription:
      '상품 이미지 한 장으로 대표 이미지와 상세 장면을 생성합니다.',
    batchGenerator: '배치 이미지 편집',
    batchGeneratorDescription:
      '여러 상품 이미지에 하나의 지시를 적용해 개별 처리합니다.',
    gallery: '갤러리',
    tools: '도구',
    pricing: '요금',
    blog: '블로그',
  },
  es: {
    home: 'Inicio',
    generator: 'Generador',
    singleGenerator: 'Set de fotos',
    singleGeneratorDescription:
      'Sube una foto y crea un set completo para ecommerce.',
    batchGenerator: 'Editor por lotes',
    batchGeneratorDescription:
      'Aplica una instruccion a muchas imagenes como tareas independientes.',
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
  const localizedPath = (path: string) => {
    if (locale === 'en') return path;
    if (path === Routes.Root) return `/${locale}`;
    if (path === Routes.Gallery && locale !== 'zh') return Routes.Gallery;
    if (path === Routes.Tools && locale !== 'zh') return Routes.Tools;
    if (path === Routes.BatchGenerator) return `/${locale}/batch-generator`;
    return path;
  };
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
  const generatorItems: MenuItemConfig[] = [
    {
      title: copy.singleGenerator,
      description: copy.singleGeneratorDescription,
      href: Routes.Generator,
      external: false,
    },
    {
      title: copy.batchGenerator,
      description: copy.batchGeneratorDescription,
      href: localizedPath(Routes.BatchGenerator),
      external: false,
    },
  ];
  const links: MenuItemConfig[] = [
    { title: copy.home, href: localizedPath(Routes.Root), external: false },
    {
      title: copy.generator,
      href: Routes.Generator,
      external: false,
      items: generatorItems,
    },
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
