import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import {
  IconArrowRight,
  IconPhotoScan,
  IconSparkles,
} from '@tabler/icons-react';
import Container from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { getProductTool } from '@/lib/product-tools';
import { ProductToolVisual } from '@/components/product/product-tool-visual';
import {
  breadcrumbJsonLd,
  localizedAlternates,
  seo,
  softwareApplicationJsonLd,
} from '@/lib/seo';
import { Routes } from '@/lib/routes';

export const Route = createFileRoute('/zh/tools/$slug')({
  loader: ({ params }) => {
    const tool = getProductTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.tool) {
      return {};
    }
    const { tool } = loaderData;
    const metadata = seo(`/zh/tools/${tool.slug}`, {
      title: `${tool.titleZh} | ProdList AI`,
      description: tool.descriptionZh,
      keywords: `${tool.titleZh}, 电商商品图, AI 商品图生成器`,
      locale: 'zh',
      alternates: localizedAlternates({
        en: `/tools/${tool.slug}`,
        zh: `/zh/tools/${tool.slug}`,
      }),
    });
    const breadcrumb = breadcrumbJsonLd([
      { name: '首页', path: '/zh' },
      { name: '工具', path: '/zh/tools' },
      { name: tool.titleZh, path: `/zh/tools/${tool.slug}` },
    ]);
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqsZh.map(
        (item: { question: string; answer: string }) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })
      ),
    };
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            softwareApplicationJsonLd({
              name: tool.titleZh,
              description: tool.descriptionZh,
              path: `/zh/tools/${tool.slug}`,
              locale: 'zh',
            }),
            breadcrumb,
            faq,
          ]),
        },
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const loaderData = Route.useLoaderData();
  if (!loaderData?.tool) {
    throw notFound();
  }
  const { tool } = loaderData;

  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <PublicBreadcrumb
          items={[
            { label: '首页', href: '/zh' },
            { label: '工具', href: '/zh/tools' },
            { label: tool.titleZh },
          ]}
        />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <Badge variant="outline" className="mb-5">
            {tool.titleZh}
          </Badge>
          <h1 className="max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
            {tool.h1Zh}
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg leading-8">
            {tool.descriptionZh}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button render={<Link to={Routes.Generator} />}>
              <IconSparkles className="size-4" />
              进入生成器
            </Button>
            <Button variant="outline" render={<Link to={Routes.Pricing} />}>
              查看定价
              <IconArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <ProductToolVisual visual={tool.visual} label={tool.imageAltZh} />
          <p className="mt-3 text-muted-foreground text-sm">
            {tool.imageAltZh}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
        <section className="rounded-lg border bg-card p-5">
          <IconPhotoScan className="mb-4 size-6 text-primary" />
          <h2 className="font-semibold text-xl">适合场景</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
            {tool.useCasesZh.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border bg-card p-5">
          <IconSparkles className="mb-4 size-6 text-primary" />
          <h2 className="font-semibold text-xl">为什么适合这个场景</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
            {tool.painPointsZh.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border bg-card p-5">
          <IconSparkles className="mb-4 size-6 text-primary" />
          <h2 className="font-semibold text-xl">推荐风格</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.styles.map((style) => (
              <Badge key={style} variant="secondary">
                {style}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <section className="mx-auto mt-14 max-w-6xl rounded-lg border bg-card p-6">
        <h2 className="font-semibold text-2xl">常见问题</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tool.faqsZh.map((item) => (
            <article key={item.question} className="rounded-lg bg-muted/40 p-4">
              <h3 className="font-semibold text-base">{item.question}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-6">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
