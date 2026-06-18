import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { LegalPage } from '@/components/page/legal-page';
import { websiteConfig } from '@/config/website';
import { LEGAL_PAGE_COPY } from '@/lib/product-i18n';
import { breadcrumbJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(legals)/cookie')({
  head: () => {
    const p = LEGAL_PAGE_COPY.en.cookie;
    const metadata = seo('/cookie', {
      title: `${p.title} | ${websiteConfig.metadata?.name}`,
      description: p.description,
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: p.title, path: '/cookie' },
            ])
          ),
        },
      ],
    };
  },
  component: CookiePage,
});

function CookiePage() {
  return (
    <Container className="py-16 px-4">
      <LegalPage page="cookie" />
    </Container>
  );
}
