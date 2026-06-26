import { Link, createFileRoute } from '@tanstack/react-router';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';
import Container from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { PRODUCT_TOOLS, PRODUCT_TOOL_NAV_GROUPS } from '@/lib/product-tools';
import {
  breadcrumbJsonLd,
  localizedAlternates,
  seo,
  softwareApplicationJsonLd,
} from '@/lib/seo';
import { Routes } from '@/lib/routes';

export const Route = createFileRoute('/tools/')({
  head: () => {
    const metadata = seo('/tools', {
      title: 'AI Product Photo Tools | ProdList AI',
      description:
        'Explore AI ecommerce product photo tools for batch generation, product photo sets, backgrounds, platform listings, and category-specific product photography.',
      keywords:
        'AI product photo tools, batch product photo generator, product photo set generator, ecommerce product photography',
      alternates: localizedAlternates({
        en: '/tools',
        zh: '/zh/tools',
      }),
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            softwareApplicationJsonLd({
              name: 'AI Product Photo Tools',
              description:
                'AI ecommerce product photo tools for batch generation, backgrounds, platform listings, and category-specific product photography.',
              path: '/tools',
              locale: 'en',
            }),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Tools', path: '/tools' },
            ]),
          ]),
        },
      ],
    };
  },
  component: ToolsIndexPage,
});

function ToolsIndexPage() {
  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <PublicBreadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Tools' }]}
        />
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <p className="font-medium text-primary text-sm">
              AI Product Photo Tools
            </p>
            <h1 className="mt-4 max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
              One product photo, every ecommerce image workflow
            </h1>
          </div>
          <div>
            <p className="text-muted-foreground text-lg leading-8">
              Choose the right tool page for your search intent: batch
              generation, product photo sets, clean backgrounds, platform-ready
              listing images, or category-specific product photography.
            </p>
            <div className="mt-6">
              <Button render={<Link to={Routes.Generator} />}>
                <IconSparkles className="size-4" />
                Open generator
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8">
          {PRODUCT_TOOL_NAV_GROUPS.map((group) => {
            const tools = PRODUCT_TOOLS.filter(
              (tool) => tool.navGroup === group.id
            );
            return (
              <section key={group.id}>
                <h2 className="font-semibold text-2xl">{group.title}</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <Link
                      className="group rounded-lg border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                      key={tool.slug}
                      to="/tools/$slug"
                      params={{ slug: tool.slug }}
                    >
                      <p className="font-semibold text-lg">{tool.title}</p>
                      <p className="mt-3 text-muted-foreground text-sm leading-6">
                        {tool.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1 font-medium text-primary text-sm">
                        View tool
                        <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
