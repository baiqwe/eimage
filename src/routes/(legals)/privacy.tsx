import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { LegalPage } from '@/components/page/legal-page';
import { websiteConfig } from '@/config/website';
import { LEGAL_PAGE_COPY } from '@/lib/product-i18n';
import { breadcrumbJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(legals)/privacy')({
  head: () => {
    const p = LEGAL_PAGE_COPY.en.privacy;
    const metadata = seo('/privacy', {
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
              { name: p.title, path: '/privacy' },
            ])
          ),
        },
      ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Container className="py-16 px-4">
      <LegalPage page="privacy" />
    </Container>
  );
}
