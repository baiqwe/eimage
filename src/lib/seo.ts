import { websiteConfig } from '@/config/website';
import { getCanonicalUrl, getOgImage, twitterHandleFromUrl } from '@/lib/urls';

export const SEO_LOCALES = ['en', 'zh', 'ja', 'ko', 'es'] as const;
export type SeoLocale = (typeof SEO_LOCALES)[number];

/**
 * Build metadata + canonical link for a page
 * @param path - The path of the page
 * @param options - The options for the page
 * @returns The metadata and canonical link
 */
export function seo(
  path: string,
  options: {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article';
    locale?: SeoLocale;
    alternates?: Partial<Record<SeoLocale | 'x-default', string>>;
    robots?: string;
  }
) {
  const url = getCanonicalUrl(path);
  const image = options.image ?? getOgImage();
  return {
    meta: metadata({
      ...options,
      url,
      image,
      type: options.type ?? 'website',
      robots: options.robots ?? 'index,follow',
    }),
    links: [
      { rel: 'canonical', href: url },
      ...alternateLinks(options.alternates),
    ],
  };
}

export function localizedAlternates(
  pathByLocale: Partial<Record<SeoLocale, string>> & { en: string }
) {
  return {
    ...pathByLocale,
    'x-default': pathByLocale.en,
  };
}

export function softwareApplicationJsonLd({
  name,
  description,
  path,
  locale = 'en',
}: {
  name: string;
  description: string;
  path: string;
  locale?: SeoLocale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: getCanonicalUrl(path),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage:
      locale === 'zh'
        ? 'zh-CN'
        : locale === 'ja'
          ? 'ja-JP'
          : locale === 'ko'
            ? 'ko-KR'
            : locale === 'es'
              ? 'es-ES'
              : 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: locale === 'zh' ? 'CNY' : locale === 'ja' ? 'JPY' : 'USD',
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

export function organizationJsonLd({
  name,
  description,
  path = '/',
}: {
  name: string;
  description: string;
  path?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url: getCanonicalUrl(path),
    logo: getCanonicalUrl('/logo.png'),
  };
}

function alternateLinks(
  alternates?: Partial<Record<SeoLocale | 'x-default', string>>
) {
  if (!alternates) return [];
  return Object.entries(alternates).map(([hrefLang, path]) => ({
    rel: 'alternate',
    hrefLang,
    href: getCanonicalUrl(path),
  }));
}

export const metadata = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  robots = 'index,follow',
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: 'website' | 'article';
  robots?: string;
}) => {
  const twitterSite = websiteConfig.social?.twitter
    ? twitterHandleFromUrl(websiteConfig.social.twitter)
    : null;
  const metadata: Array<{
    title?: string;
    name?: string;
    property?: string;
    content?: string;
  }> = [
    { title },
    { name: 'robots', content: robots },
    ...(description ? [{ name: 'description', content: description }] : []),
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
    // OG metadata
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: websiteConfig.metadata?.name ?? '' },
    { property: 'og:title', content: title },
    ...(description
      ? [{ property: 'og:description', content: description }]
      : []),
    ...(url ? [{ property: 'og:url', content: url }] : []),
    ...(image ? [{ property: 'og:image', content: image }] : []),
    // Twitter metadata (twitter:site = site's @username, not domain)
    { name: 'twitter:title', content: title },
    ...(twitterSite ? [{ name: 'twitter:site', content: twitterSite }] : []),
    ...(description
      ? [{ name: 'twitter:description', content: description }]
      : []),
    ...(url ? [{ name: 'twitter:url', content: url }] : []),
    ...(image
      ? [
          { name: 'twitter:card', content: 'summary_large_image' as const },
          { name: 'twitter:image', content: image },
        ]
      : []),
  ];
  return metadata;
};
