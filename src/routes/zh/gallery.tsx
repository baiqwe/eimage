import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { ProductGallerySection } from '@/components/product/product-gallery';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import {
  breadcrumbJsonLd,
  localizedAlternates,
  seo,
  softwareApplicationJsonLd,
} from '@/lib/seo';

export const Route = createFileRoute('/zh/gallery')({
  head: () => {
    const title = '商品图生成画廊 | ProdList AI';
    const description =
      '查看 AI 生成的电商商品图样例，包括平台主图、详情页场景图和广告素材方向。';
    const metadata = seo('/zh/gallery', {
      title,
      description,
      locale: 'zh',
      alternates: localizedAlternates({ en: '/gallery', zh: '/zh/gallery' }),
    });
    const breadcrumb = breadcrumbJsonLd([
      { name: '首页', path: '/zh' },
      { name: '画廊', path: '/zh/gallery' },
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
              path: '/zh/gallery',
              locale: 'zh',
            }),
            breadcrumb,
          ]),
        },
      ],
    };
  },
  component: ZhGalleryPage,
});

function ZhGalleryPage() {
  return (
    <div className="bg-[#f7f8f4] text-[#20231e]">
      <Container className="px-4 pt-16">
        <div className="mx-auto max-w-6xl">
          <PublicBreadcrumb
            items={[{ label: '首页', href: '/zh' }, { label: '画廊' }]}
          />
          <h1 className="max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
            商品图生成画廊
          </h1>
          <p className="mt-5 max-w-3xl text-[#5f6759] text-lg leading-8">
            查看主图、详情页场景图和广告素材的生成方向，后续可直接连接真实生图
            API 扩展为用户作品集。
          </p>
        </div>
      </Container>
      <ProductGallerySection locale="zh" showActions={false} />
    </div>
  );
}
