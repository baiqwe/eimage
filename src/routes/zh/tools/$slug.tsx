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
      { name: '工具', path: '/zh/tools/product-background-generator' },
      { name: tool.titleZh, path: `/zh/tools/${tool.slug}` },
    ]);
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
          ]),
        },
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();

  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <PublicBreadcrumb
          items={[
            { label: '首页', href: '/zh' },
            { label: '工具', href: '/zh/tools/product-background-generator' },
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
          <div
            role="img"
            aria-label={tool.imageAltZh}
            className="grid aspect-[4/3] gap-3 rounded-lg bg-[#20231e] p-4"
          >
            <div className="rounded-lg bg-[#eef1e8]" />
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#2f5f4f]" />
              <div className="rounded-lg bg-[#c9822f]" />
              <div className="rounded-lg bg-[#dfe3d8]" />
            </div>
          </div>
          <p className="mt-3 text-muted-foreground text-sm">
            {tool.imageAltZh}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2">
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
    </Container>
  );
}
