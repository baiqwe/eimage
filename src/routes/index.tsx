import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => {
    const name = websiteConfig.metadata?.name ?? '';
    const title =
      'AI Ecommerce Product Photo Generator | Create Product Photo Sets';
    const description =
      'Upload one product photo and generate a complete ecommerce photo set with AI, including hero images, white-background photos, lifestyle scenes, and ad creatives.';
    const url = getCanonicalUrl('/');
    const webSiteJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      description,
      url,
    };
    const appJsonLd = softwareApplicationJsonLd({
      name,
      description,
      path: '/',
      locale: 'en',
    });
    const metadata = seo('/', {
      title,
      description,
      locale: 'en',
      keywords:
        'AI ecommerce product photo generator, ecommerce product photo generator, product photo set generator, batch product photo generator',
      alternates: localizedAlternates({
        en: '/',
        zh: '/zh',
        ja: '/ja',
        ko: '/ko',
        es: '/es',
      }),
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([webSiteJsonLd, appJsonLd]),
        },
      ],
    };
  },
  component: () => <ProductHome locale="en" />,
});
