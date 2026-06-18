import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { Roadmap } from '@/components/roadmap/roadmap';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { websiteConfig } from '@/config/website';
import { PUBLIC_LABELS, PUBLIC_PAGE_COPY } from '@/lib/product-i18n';
import { breadcrumbJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(pages)/roadmap')({
  head: () => {
    const copy = PUBLIC_PAGE_COPY.en.roadmap;
    const metadata = seo('/roadmap', {
      title: `${copy.title} | ${websiteConfig.metadata?.name}`,
      description: copy.description,
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: copy.title, path: '/roadmap' },
            ])
          ),
        },
      ],
    };
  },
  component: RoadmapPage,
});

/**
 * Roadmap page with kanban board. Inspired by https://nsui.irung.me/roadmap
 */
function RoadmapPage() {
  const { locale, setLocale } = useProductLocale();
  const labels = PUBLIC_LABELS[locale];
  const m = PUBLIC_PAGE_COPY[locale].roadmap;

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto space-y-8">
        <PublicBreadcrumb
          items={[{ label: labels.home, href: '/' }, { label: labels.roadmap }]}
        />
        <div className="space-y-4">
          <div className="flex justify-center">
            <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
          </div>
          <h1 className="text-center text-3xl font-bold tracking-tight">
            {m.title}
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            {m.subtitle}
          </p>
        </div>

        <Roadmap locale={locale} />
      </div>
    </Container>
  );
}
