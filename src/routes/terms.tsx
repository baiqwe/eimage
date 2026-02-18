import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { PageMarkdown } from '@/components/page/page-markdown';
import { getPageBySlug } from '@/lib/pages';
import { websiteConfig } from '@/config/website';
import { getCanonicalUrl } from '@/lib/urls';

export const Route = createFileRoute('/terms')({
  loader: () => {
    const page = getPageBySlug('terms-of-service');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
    return {
      meta: [
        { title: `${p.title} | ${websiteConfig.metadata?.name}` },
        { name: 'description', content: p.description },
      ],
      links: [{ rel: 'canonical', href: getCanonicalUrl('/terms') }],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();
  return (
    <Container className="py-16 px-4">
      <PageMarkdown page={page} />
    </Container>
  );
}
