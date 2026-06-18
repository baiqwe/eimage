import { Link, createFileRoute } from '@tanstack/react-router';
import {
  IconPhotoScan,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react';
import Container from '@/components/layout/container';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { websiteConfig } from '@/config/website';
import { PUBLIC_LABELS } from '@/lib/product-i18n';
import { Routes } from '@/lib/routes';
import { breadcrumbJsonLd, organizationJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(pages)/about')({
  head: () => {
    const title = `About ${websiteConfig.metadata?.name}`;
    const description =
      'Learn how SuiteWorkbench helps ecommerce sellers create product image asset packs while preserving the original product shape.';
    const metadata = seo('/about', { title, description });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            organizationJsonLd({
              name: websiteConfig.metadata?.name ?? 'SuiteWorkbench',
              description,
              path: '/about',
            }),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
            ]),
          ]),
        },
      ],
    };
  },
  component: AboutPage,
});

const ABOUT_COPY = {
  zh: {
    badge: '关于 SuiteWorkbench',
    title: '我们帮助电商团队把一张商品图变成可复用的视觉资产包',
    description:
      'SuiteWorkbench 面向独立站、平台卖家和小型设计团队，核心目标是保留商品原始形貌，同时更快生成主图、详情页场景图和广告素材方向。',
    principles: [
      {
        title: '商品不乱变形',
        text: '我们的生成逻辑围绕原图主体、边缘、材质和标签做约束，而不是让 AI 凭空重画商品。',
      },
      {
        title: '任务可以追溯',
        text: '每张图都保留风格、比例、Prompt、设计意图和扣点记录，方便复盘和二次生成。',
      },
      {
        title: '面向真实商业成本',
        text: '后续接入真实生图 API 时，会采用单图任务、并发队列、点数扣减和失败返还机制。',
      },
    ],
    cta: '进入生成器',
    gallery: '查看样例画廊',
  },
  en: {
    badge: 'About SuiteWorkbench',
    title:
      'We help ecommerce teams turn one product photo into reusable visual asset packs',
    description:
      'SuiteWorkbench is built for Shopify, Amazon, marketplace, and DTC sellers who need main images, detail-page scenes, and ad creative directions without changing the original product shape.',
    principles: [
      {
        title: 'Preserve the product',
        text: 'The workflow is designed around source-image structure, edges, material, labels, and silhouette instead of redrawing the product from scratch.',
      },
      {
        title: 'Keep every task traceable',
        text: 'Each asset keeps style, ratio, prompt, design intent, and credit history for iteration and review.',
      },
      {
        title: 'Respect generation cost',
        text: 'The real API flow is planned around single-image tasks, parallel queues, credit debits, and failed-job refunds.',
      },
    ],
    cta: 'Open generator',
    gallery: 'View gallery',
  },
  ja: {
    badge: 'SuiteWorkbench について',
    title: '1 枚の商品写真を再利用できるビジュアル素材パックへ',
    description:
      'SuiteWorkbench は EC チーム向けに、商品の形状を保ちながら主画像、詳細シーン、広告素材の方向性を素早く作るためのワークベンチです。',
    principles: [
      {
        title: '商品形状を保つ',
        text: '元画像の構造、輪郭、素材、ラベルを基準にし、商品をゼロから描き直しません。',
      },
      {
        title: 'タスクを追跡可能に',
        text: '各素材のスタイル、比率、Prompt、設計意図、クレジット履歴を残します。',
      },
      {
        title: '生成コストを意識',
        text: '単画像タスク、並列キュー、クレジット消費、失敗時返還を前提に設計しています。',
      },
    ],
    cta: '生成ツールを開く',
    gallery: 'ギャラリーを見る',
  },
  ko: {
    badge: 'SuiteWorkbench 소개',
    title: '상품 사진 한 장을 재사용 가능한 비주얼 에셋 팩으로',
    description:
      'SuiteWorkbench는 상품 형태를 유지하면서 메인 이미지, 상세 장면, 광고 소재 방향을 빠르게 만드는 이커머스 워크벤치입니다.',
    principles: [
      {
        title: '상품 형태 유지',
        text: '원본 이미지의 구조, 윤곽, 소재, 라벨을 기준으로 삼고 상품을 처음부터 다시 그리지 않습니다.',
      },
      {
        title: '작업 추적 가능',
        text: '각 에셋의 스타일, 비율, Prompt, 디자인 의도, 크레딧 기록을 보존합니다.',
      },
      {
        title: '생성 비용 고려',
        text: '단일 이미지 작업, 병렬 큐, 크레딧 차감, 실패 환불을 기준으로 설계합니다.',
      },
    ],
    cta: '생성기 열기',
    gallery: '갤러리 보기',
  },
  es: {
    badge: 'Acerca de SuiteWorkbench',
    title:
      'Convertimos una foto de producto en paquetes visuales reutilizables',
    description:
      'SuiteWorkbench ayuda a sellers ecommerce a crear imágenes principales, escenas de detalle y direcciones publicitarias sin cambiar la forma original del producto.',
    principles: [
      {
        title: 'Preservar el producto',
        text: 'El flujo se basa en estructura, bordes, material, etiquetas y silueta de la imagen fuente.',
      },
      {
        title: 'Tareas trazables',
        text: 'Cada asset mantiene estilo, proporción, Prompt, intención de diseño e historial de créditos.',
      },
      {
        title: 'Coste de generación real',
        text: 'El flujo real usará tareas individuales, colas paralelas, créditos y reembolsos por fallos.',
      },
    ],
    cta: 'Abrir generador',
    gallery: 'Ver galería',
  },
} as const;

function AboutPage() {
  const { locale, setLocale } = useProductLocale();
  const copy = ABOUT_COPY[locale];
  const labels = PUBLIC_LABELS[locale];
  const icons = [IconPhotoScan, IconSparkles, IconShieldCheck];

  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <PublicBreadcrumb
          items={[{ label: labels.home, href: '/' }, { label: copy.badge }]}
        />
        <div className="mb-5">
          <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
        </div>
        <Badge variant="outline">{copy.badge}</Badge>
        <h1 className="mt-5 max-w-4xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-muted-foreground text-lg leading-8">
          {copy.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link to={Routes.Generator} />}>{copy.cta}</Button>
          <Button variant="outline" render={<Link to={Routes.Gallery} />}>
            {copy.gallery}
          </Button>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {copy.principles.map((item, index) => {
            const Icon = icons[index];
            return (
              <section
                key={item.title}
                className="rounded-lg border bg-card p-5"
              >
                <Icon className="mb-5 size-6 text-primary" />
                <h2 className="font-semibold text-xl">{item.title}</h2>
                <p className="mt-3 text-muted-foreground text-sm leading-6">
                  {item.text}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
