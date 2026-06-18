import { Routes } from '@/lib/routes';
import type { ProductLocale } from '@/components/product/product-locale';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

const FOOTER_COPY: Record<
  ProductLocale,
  {
    product: string;
    resources: string;
    company: string;
    legal: string;
    home: string;
    generator: string;
    gallery: string;
    tools: string;
    pricing: string;
    faq: string;
    blog: string;
    changelog: string;
    roadmap: string;
    about: string;
    contact: string;
    waitlist: string;
    cookie: string;
    privacy: string;
    terms: string;
  }
> = {
  zh: {
    product: '产品',
    resources: '资源',
    company: '公司',
    legal: '法律',
    home: '首页',
    generator: '生成器',
    gallery: '画廊',
    tools: '工具',
    pricing: '定价',
    faq: '常见问题',
    blog: '博客',
    changelog: '更新日志',
    roadmap: '路线图',
    about: '关于我们',
    contact: '联系我们',
    waitlist: '候补名单',
    cookie: 'Cookie 政策',
    privacy: '隐私政策',
    terms: '服务条款',
  },
  en: {
    product: 'Product',
    resources: 'Resources',
    company: 'Company',
    legal: 'Legal',
    home: 'Home',
    generator: 'Generator',
    gallery: 'Gallery',
    tools: 'Tools',
    pricing: 'Pricing',
    faq: 'FAQ',
    blog: 'Blog',
    changelog: 'Changelog',
    roadmap: 'Roadmap',
    about: 'About',
    contact: 'Contact',
    waitlist: 'Waitlist',
    cookie: 'Cookie Policy',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  ja: {
    product: '製品',
    resources: 'リソース',
    company: '会社',
    legal: '法務',
    home: 'ホーム',
    generator: '生成ツール',
    gallery: 'ギャラリー',
    tools: 'ツール',
    pricing: '料金',
    faq: 'FAQ',
    blog: 'ブログ',
    changelog: '更新履歴',
    roadmap: 'ロードマップ',
    about: '会社情報',
    contact: 'お問い合わせ',
    waitlist: 'ウェイトリスト',
    cookie: 'Cookie ポリシー',
    privacy: 'プライバシー',
    terms: '利用規約',
  },
  ko: {
    product: '제품',
    resources: '리소스',
    company: '회사',
    legal: '법적 고지',
    home: '홈',
    generator: '생성기',
    gallery: '갤러리',
    tools: '도구',
    pricing: '요금',
    faq: 'FAQ',
    blog: '블로그',
    changelog: '변경 내역',
    roadmap: '로드맵',
    about: '회사 소개',
    contact: '문의',
    waitlist: '대기 명단',
    cookie: '쿠키 정책',
    privacy: '개인정보 처리방침',
    terms: '서비스 약관',
  },
  es: {
    product: 'Producto',
    resources: 'Recursos',
    company: 'Empresa',
    legal: 'Legal',
    home: 'Inicio',
    generator: 'Generador',
    gallery: 'Galería',
    tools: 'Herramientas',
    pricing: 'Precios',
    faq: 'Preguntas frecuentes',
    blog: 'Blog',
    changelog: 'Novedades',
    roadmap: 'Hoja de ruta',
    about: 'Acerca de',
    contact: 'Contacto',
    waitlist: 'Lista de espera',
    cookie: 'Política de cookies',
    privacy: 'Privacidad',
    terms: 'Términos',
  },
};

/**
 * Footer links, grouped by section
 */
export function getFooterLinks(locale: ProductLocale = 'en'): MenuItemConfig[] {
  const copy = FOOTER_COPY[locale];
  const productItems: MenuItemConfig[] = [
    { title: copy.home, href: Routes.Root, external: false },
    { title: copy.generator, href: Routes.Generator, external: false },
    { title: copy.gallery, href: Routes.Gallery, external: false },
    { title: copy.tools, href: Routes.Tools, external: false },
  ];
  if (websiteConfig.payment?.enable) {
    productItems.push({
      title: copy.pricing,
      href: Routes.Pricing,
      external: false,
    });
  }
  productItems.push({
    title: copy.faq,
    href: Routes.Faqs,
    external: false,
  });

  const resourcesItems: MenuItemConfig[] = [];
  if (websiteConfig.blog?.enable) {
    resourcesItems.push({
      title: copy.blog,
      href: Routes.Blog,
      external: false,
    });
  }
  resourcesItems.push({
    title: copy.changelog,
    href: Routes.Changelog,
    external: false,
  });
  resourcesItems.push({
    title: copy.roadmap,
    href: Routes.Roadmap,
    external: false,
  });

  const companyItems: MenuItemConfig[] = [
    { title: copy.about, href: Routes.About, external: false },
    { title: copy.contact, href: Routes.Contact, external: false },
    { title: copy.waitlist, href: Routes.Waitlist, external: false },
  ];

  const legalItems: MenuItemConfig[] = [
    { title: copy.cookie, href: Routes.CookiePolicy, external: false },
    { title: copy.privacy, href: Routes.PrivacyPolicy, external: false },
    { title: copy.terms, href: Routes.TermsOfService, external: false },
  ];

  return [
    { title: copy.product, items: productItems },
    { title: copy.resources, items: resourcesItems },
    { title: copy.company, items: companyItems },
    { title: copy.legal, items: legalItems },
  ];
}

export function getFooterTagline(locale: ProductLocale) {
  return {
    zh: '为电商卖家生成保留商品形貌的主图、详情页场景图和广告素材。',
    en: 'Generate ecommerce hero images, detail scenes, and ad creatives while preserving product shape.',
    ja: '商品の形状を保ちながら、EC 向けの主画像、詳細シーン、広告素材を生成します。',
    ko: '상품 형태를 유지하면서 이커머스 메인 이미지, 상세 장면, 광고 소재를 생성합니다.',
    es: 'Genera imágenes principales, escenas de detalle y creatividades publicitarias sin alterar el producto.',
  }[locale];
}

export function getFooterRights(locale: ProductLocale) {
  return {
    zh: '保留所有权利。',
    en: 'All rights reserved.',
    ja: '全著作権所有。',
    ko: '모든 권리 보유.',
    es: 'Todos los derechos reservados.',
  }[locale];
}
