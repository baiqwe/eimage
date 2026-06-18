import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { MarkdownPage } from '@/components/page/markdown-page';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { getPageBySlug } from '@/lib/pages';
import { websiteConfig } from '@/config/website';
import { breadcrumbJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(legals)/terms')({
  loader: () => {
    const page = getPageBySlug('terms');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
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
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();
  return (
    <Container className="py-16 px-4">
      <PublicBreadcrumb
        items={[{ label: 'Home', href: '/' }, { label: page.title }]}
      />
      <MarkdownPage page={page} />
    </Container>
  );
}
