import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/en')({
  head: () => {
    const title = 'SuiteWorkbench - AI Product Image Generator';
    const description =
      'Generate marketplace main images and detail-page lifestyle scenes from one product photo while preserving the original product shape.';
    const metadata = seo('/en', {
      title,
      description,
      locale: 'en',
      alternates: localizedAlternates({ en: '/en', zh: '/zh' }),
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            softwareApplicationJsonLd({
              name: websiteConfig.metadata?.name ?? 'SuiteWorkbench',
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
