import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { ProductGallerySection } from '@/components/product/product-gallery';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import {
  breadcrumbJsonLd,
  localizedAlternates,
  seo,
  softwareApplicationJsonLd,
} from '@/lib/seo';
import type { ProductLocale } from '@/components/product/product-locale';

export const Route = createFileRoute('/gallery')({
  head: () => {
    const title = 'SuiteWorkbench Gallery - AI Ecommerce Product Images';
    const description =
      'Browse AI generated ecommerce product image examples for marketplace main images, detail-page scenes, and ad creatives.';
    const metadata = seo('/gallery', {
      title,
      description,
      alternates: localizedAlternates({ en: '/gallery', zh: '/gallery' }),
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
    ]);
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            softwareApplicationJsonLd({
              name: title,
              description,
              path: '/gallery',
              locale: 'en',
            }),
            breadcrumb,
          ]),
        },
      ],
    };
  },
  component: GalleryPage,
});

function GalleryPage() {
  const { locale, setLocale } = useProductLocale();
  const copy = GALLERY_PAGE_COPY[locale];

  return (
    <div className="bg-[#f7f8f4] text-[#20231e]">
      <Container className="px-4 pt-16">
        <div className="mx-auto max-w-6xl">
          <PublicBreadcrumb
            items={[{ label: 'Home', href: '/' }, { label: copy.title }]}
          />
          <div className="mb-5">
            <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
          </div>
          <h1 className="max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-[#5f6759] text-lg leading-8">
            {copy.description}
          </p>
        </div>
      </Container>
      <ProductGallerySection locale={locale} showActions={false} />
    </div>
  );
}

const GALLERY_PAGE_COPY: Record<
  ProductLocale,
  { title: string; description: string }
> = {
  zh: {
    title: '商品图生成画廊',
    description:
      '查看主图、详情页场景图和广告素材的生成方向，后续可直接连接真实生图 API 扩展为用户作品集。',
  },
  en: {
    title: 'Product Image Gallery',
    description:
      'Explore hero images, lifestyle detail scenes, and ad creative directions for the generation workbench.',
  },
  ja: {
    title: '商品画像ギャラリー',
    description:
      '主画像、ライフスタイル詳細シーン、広告素材の生成方向を確認できます。',
  },
  ko: {
    title: '상품 이미지 갤러리',
    description:
      '메인 이미지, 라이프스타일 상세 장면, 광고 소재의 생성 방향을 확인하세요.',
  },
  es: {
    title: 'Galería de imágenes de producto',
    description:
      'Explora imágenes principales, escenas lifestyle de detalle y creatividades publicitarias para el generador.',
  },
};
