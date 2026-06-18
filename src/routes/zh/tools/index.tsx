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

export const Route = createFileRoute('/zh/tools/')({
  head: () => {
    const metadata = seo('/zh/tools', {
      title: 'AI 商品图工具索引 | ProdList AI',
      description:
        '浏览适合电商商品图的 AI 工具：批量生成、套图生成、背景生成、平台商品图和类目商品摄影。',
      keywords: 'AI 商品图工具, 批量商品图生成器, 商品套图生成器, 电商商品摄影',
      locale: 'zh',
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
              name: 'AI 商品图工具索引',
              description:
                '适合电商商品图的 AI 工具，覆盖批量生成、背景生成、平台上架图和类目商品摄影。',
              path: '/zh/tools',
              locale: 'zh',
            }),
            breadcrumbJsonLd([
              { name: '首页', path: '/zh' },
              { name: '工具', path: '/zh/tools' },
            ]),
          ]),
        },
      ],
    };
  },
  component: ZhToolsIndexPage,
});

function ZhToolsIndexPage() {
  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <PublicBreadcrumb
          items={[{ label: '首页', href: '/zh' }, { label: '工具' }]}
        />
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <p className="font-medium text-primary text-sm">AI 商品图工具</p>
            <h1 className="mt-4 max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
              一张商品图，覆盖完整电商生图工作流
            </h1>
          </div>
          <div>
            <p className="text-muted-foreground text-lg leading-8">
              根据搜索意图选择合适工具页：批量生成、商品套图、干净背景、平台上架图，或针对珠宝、美妆、鞋类的类目商品摄影。
            </p>
            <div className="mt-6">
              <Button render={<Link to={Routes.Generator} />}>
                <IconSparkles className="size-4" />
                进入生成器
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
                <h2 className="font-semibold text-2xl">{group.titleZh}</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <Link
                      className="group rounded-lg border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                      key={tool.slug}
                      to={`/zh/tools/${tool.slug}`}
                    >
                      <p className="font-semibold text-lg">{tool.titleZh}</p>
                      <p className="mt-3 text-muted-foreground text-sm leading-6">
                        {tool.descriptionZh}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1 font-medium text-primary text-sm">
                        查看工具
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
