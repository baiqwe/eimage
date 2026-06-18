import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { LegalPage } from '@/components/page/legal-page';
import { websiteConfig } from '@/config/website';
import { LEGAL_PAGE_COPY } from '@/lib/product-i18n';
import { breadcrumbJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(legals)/terms')({
  head: () => {
    const p = LEGAL_PAGE_COPY.en.terms;
    const metadata = seo('/terms', {
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
              { name: p.title, path: '/terms' },
            ])
          ),
        },
      ],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  return (
    <Container className="py-16 px-4">
      <LegalPage page="terms" />
    </Container>
  );
}
