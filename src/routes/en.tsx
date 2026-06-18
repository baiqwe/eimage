import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/en')({
  head: () => {
    const title =
      'AI Ecommerce Product Photo Generator | Create Product Photo Sets';
    const description =
      'Upload one product photo and generate a complete ecommerce photo set with AI, including hero images, white-background photos, lifestyle scenes, and ad creatives.';
    const metadata = seo('/en', {
      title,
      description,
      locale: 'en',
      keywords:
        'AI ecommerce product photo generator, ecommerce product photo generator, product photo set generator, batch product photo generator',
      alternates: localizedAlternates({
        en: '/en',
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
          children: JSON.stringify(
            softwareApplicationJsonLd({
              name: websiteConfig.metadata?.name ?? 'ProdList AI',
              description,
              path: '/en',
              locale: 'en',
            })
          ),
        },
      ],
    };
  },
  component: () => <ProductHome locale="en" />,
});
