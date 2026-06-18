import { ReleaseCard } from '@/components/changelog/release-card';
import Container from '@/components/layout/container';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { websiteConfig } from '@/config/website';
import { getChangelogReleases } from '@/lib/changelog';
import { PUBLIC_LABELS, PUBLIC_PAGE_COPY } from '@/lib/product-i18n';
import { breadcrumbJsonLd, seo } from '@/lib/seo';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/(pages)/changelog')({
  loader: () => {
    const releases = getChangelogReleases();
    if (!releases?.length) throw notFound();
    return releases;
  },
  head: () => {
    const copy = PUBLIC_PAGE_COPY.en.changelog;
    const metadata = seo('/changelog', {
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
              { name: copy.title, path: '/changelog' },
            ])
          ),
        },
      ],
    };
  },
  component: ChangelogPage,
});

function ChangelogPage() {
  const releases = Route.useLoaderData();
  const { locale, setLocale } = useProductLocale();
  const labels = PUBLIC_LABELS[locale];
  const m = PUBLIC_PAGE_COPY[locale].changelog;

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <PublicBreadcrumb
          items={[
            { label: labels.home, href: '/' },
            { label: labels.changelog },
          ]}
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

        <div className="mt-8">
          {releases?.map((release) => (
            <ReleaseCard key={release.slug} release={release} locale={locale} />
          ))}
        </div>
      </div>
    </Container>
  );
}
