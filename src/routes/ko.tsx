import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ko')({
  head: () => {
    const title = '이커머스용 AI 상품 사진 생성기 | 상품 사진 세트 생성';
    const description =
      '상품 사진 한 장으로 메인 이미지, 흰 배경 상품 사진, 라이프스타일 상세 장면, 광고 소재를 AI로 생성합니다.';
    const metadata = seo('/ko', {
      title,
      description,
      locale: 'ko',
      keywords:
        'AI 이커머스 상품 사진 생성기, 상품 사진 세트 생성기, 이커머스 상품 이미지 생성, AI 상품 촬영',
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
              path: '/ko',
              locale: 'ko',
            })
          ),
        },
      ],
    };
  },
  component: () => <ProductHome locale="ko" />,
});
