import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/zh')({
  head: () => {
    const title = 'SuiteWorkbench - 商品图智能生成工作台';
    const description =
      '为电商卖家批量生成保留商品形貌的主图与详情页场景套图。';
    const metadata = seo('/zh', {
      title,
      description,
      locale: 'zh',
      alternates: localizedAlternates({ en: '/en', zh: '/zh' }),
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            softwareApplicationJsonLd({
              name: websiteConfig.metadata?.name ?? 'SuiteWorkbench',
              description,
              path: '/zh',
              locale: 'zh',
            })
          ),
        },
      ],
    };
  },
  component: () => <ProductHome locale="zh" />,
});
