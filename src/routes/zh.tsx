import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/zh')({
  head: () => {
    const title = 'AI 电商商品图生成器 | 一张图生成商品套图';
    const description =
      '上传一张商品图，用 AI 批量生成电商主图、白底图、详情页场景图和广告素材，尽量保留商品原始形貌。';
    const metadata = seo('/zh', {
      title,
      description,
      locale: 'zh',
      keywords:
        'AI 电商商品图生成器, 商品套图生成器, 电商主图生成器, 批量商品图生成',
      alternates: localizedAlternates({
        en: '/',
        zh: '/zh',
        ja: '/ja',
        ko: '/ko',
        es: '/es',
      }),
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
