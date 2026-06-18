import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import {
  IconArrowRight,
  IconPhotoScan,
  IconSparkles,
} from '@tabler/icons-react';
import Container from '@/components/layout/container';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { getProductTool, getProductToolCopy } from '@/lib/product-tools';
import {
  breadcrumbJsonLd,
  localizedAlternates,
  seo,
  softwareApplicationJsonLd,
} from '@/lib/seo';
import { Routes } from '@/lib/routes';

export const Route = createFileRoute('/tools/$slug')({
  loader: ({ params }) => {
    const tool = getProductTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    const { tool } = loaderData;
    const metadata = seo(`/tools/${tool.slug}`, {
      title: `${tool.title} | ProdList AI`,
      description: tool.description,
      keywords: `${tool.category}, ecommerce product photography, AI product image generator`,
      alternates: localizedAlternates({
        en: `/tools/${tool.slug}`,
        zh: `/zh/tools/${tool.slug}`,
      }),
    });
    const breadcrumb = breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools/product-background-generator' },
      { name: tool.title, path: `/tools/${tool.slug}` },
    ]);
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            softwareApplicationJsonLd({
              name: tool.title,
              description: tool.description,
              path: `/tools/${tool.slug}`,
              locale: 'en',
            }),
            breadcrumb,
          ]),
        },
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const { locale, setLocale } = useProductLocale();
  const copy = getProductToolCopy(tool, locale);

  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <PublicBreadcrumb
          items={[
            { label: copy.home, href: '/' },
            { label: copy.tools, href: Routes.Tools },
            { label: copy.title },
          ]}
        />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5">
            <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
          </div>
          <Badge variant="outline" className="mb-5">
            {copy.category}
          </Badge>
          <h1 className="max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
            {copy.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg leading-8">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button render={<Link to={Routes.Generator} />}>
              <IconSparkles className="size-4" />
              {copy.openGenerator}
            </Button>
            <Button variant="outline" render={<Link to={Routes.Pricing} />}>
              {copy.viewPricing}
              <IconArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div
            role="img"
            aria-label={copy.imageAlt}
            className="grid aspect-[4/3] gap-3 rounded-lg bg-[#20231e] p-4"
          >
            <div className="rounded-lg bg-[#eef1e8]" />
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#2f5f4f]" />
              <div className="rounded-lg bg-[#c9822f]" />
              <div className="rounded-lg bg-[#dfe3d8]" />
            </div>
          </div>
          <p className="mt-3 text-muted-foreground text-sm">{copy.imageAlt}</p>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2">
        <section className="rounded-lg border bg-card p-5">
          <IconPhotoScan className="mb-4 size-6 text-primary" />
          <h2 className="font-semibold text-xl">{copy.bestFor}</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
            {copy.useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border bg-card p-5">
          <IconSparkles className="mb-4 size-6 text-primary" />
          <h2 className="font-semibold text-xl">{copy.styles}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.styles.map((style) => (
              <Badge key={style} variant="secondary">
                {style}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
