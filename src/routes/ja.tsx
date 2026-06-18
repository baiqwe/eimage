import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ja')({
  head: () => {
    const title = 'EC 向け AI 商品フォト生成ツール | 商品画像セットを作成';
    const description =
      '1 枚の商品写真から、EC の主画像、白背景画像、ライフスタイル詳細シーン、広告素材を AI でまとめて生成します。';
    const metadata = seo('/ja', {
      title,
      description,
      locale: 'ja',
      keywords:
        'AI EC 商品フォト生成, 商品画像セット生成, EC 商品画像生成, AI 商品撮影',
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
              name: websiteConfig.metadata?.name ?? 'ProdList AI',
              description,
              path: '/ja',
              locale: 'ja',
            })
          ),
        },
      ],
    };
  },
  component: () => <ProductHome locale="ja" />,
});
