import FaqSection from '@/components/blocks/faqs';
import Container from '@/components/layout/container';
import {
  ProductLanguageSelect,
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { PUBLIC_LABELS } from '@/lib/product-i18n';
import { Routes } from '@/lib/routes';
import { breadcrumbJsonLd, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { Link, createFileRoute } from '@tanstack/react-router';

const PRICING_COPY: Record<
  ProductLocale,
  {
    title: string;
    subtitle: string;
    notes: string[];
    plans: Array<{
      name: string;
      price: string;
      description: string;
      cta: string;
      featured?: boolean;
      features: string[];
    }>;
  }
> = {
  zh: {
    title: '按生成规模选择订阅',
    subtitle:
      '用订阅获得每月生图点数，主图、详情图、高清生成会按任务扣点。失败任务后续可自动返还点数。',
    notes: [
      '免费试用点数',
      '订阅点数池',
      '生成历史与高清下载',
      '后续支持点数包加购',
    ],
    plans: [
      {
        name: '免费版',
        price: '¥0',
        description: '适合体验 Prompt 工作台和少量试生成',
        cta: '免费开始',
        features: [
          '10 个试用点数',
          '主图/详情图预设',
          '7 天生成历史',
          '基础下载',
        ],
      },
      {
        name: '专业版',
        price: '¥69/月',
        description: '适合持续上新的独立站与电商卖家',
        cta: '选择专业版',
        featured: true,
        features: [
          '每月 500 点数',
          '高清主图与详情图导出',
          '批量任务队列',
          'Prompt 与资产历史复用',
        ],
      },
      {
        name: '工作室版',
        price: '¥199/月',
        description: '适合多店铺、团队和高频上新',
        cta: '联系升级',
        features: [
          '每月 2,000 点数',
          '更高优先级队列',
          '长周期资产历史',
          '后续 API 与团队席位优先支持',
        ],
      },
    ],
  },
  en: {
    title: 'Choose a plan for your generation volume',
    subtitle:
      'Subscriptions grant monthly credits. Main images, detail scenes, and high-resolution renders consume credits per task, with refunds for failed jobs.',
    notes: [
      'Free trial credits',
      'Monthly credit pool',
      'Generation history and HD downloads',
      'Credit top-ups later',
    ],
    plans: [
      {
        name: 'Free',
        price: '$0',
        description: 'Try the prompt workbench and a few test renders',
        cta: 'Start free',
        features: [
          '10 trial credits',
          'Main/detail presets',
          '7-day history',
          'Basic downloads',
        ],
      },
      {
        name: 'Pro',
        price: '$9.9/mo',
        description: 'For DTC and ecommerce sellers launching continuously',
        cta: 'Choose Pro',
        featured: true,
        features: [
          '500 monthly credits',
          'HD main and detail exports',
          'Batch task queue',
          'Prompt and asset reuse',
        ],
      },
      {
        name: 'Studio',
        price: '$29/mo',
        description: 'For multi-store teams and high-volume launches',
        cta: 'Upgrade studio',
        features: [
          '2,000 monthly credits',
          'Higher-priority queue',
          'Longer asset history',
          'Early API and team-seat support',
        ],
      },
    ],
  },
  ja: {
    title: '生成規模に合わせてプランを選択',
    subtitle:
      'サブスクリプションで毎月のクレジットを付与。主画像、詳細シーン、高解像度生成はタスクごとに消費されます。',
    notes: [
      '無料トライアルクレジット',
      '毎月のクレジット枠',
      '生成履歴と HD ダウンロード',
      '追加クレジット対応予定',
    ],
    plans: [
      {
        name: '無料',
        price: '¥0',
        description: 'Prompt ワークベンチと少量の試生成に最適',
        cta: '無料で開始',
        features: [
          '10 トライアルクレジット',
          '主画像/詳細プリセット',
          '7 日間の履歴',
          '基本ダウンロード',
        ],
      },
      {
        name: 'Pro',
        price: '$9.9/月',
        description: '継続的に商品を追加する EC/DTC チーム向け',
        cta: 'Pro を選択',
        featured: true,
        features: [
          '毎月 500 クレジット',
          'HD 書き出し',
          'バッチタスクキュー',
          'Prompt と素材履歴の再利用',
        ],
      },
      {
        name: 'Studio',
        price: '$29/月',
        description: '複数店舗や高頻度の商品投入に最適',
        cta: 'Studio にアップグレード',
        features: [
          '毎月 2,000 クレジット',
          '高優先度キュー',
          '長期素材履歴',
          'API とチーム機能を優先提供',
        ],
      },
    ],
  },
  ko: {
    title: '생성 규모에 맞는 플랜 선택',
    subtitle:
      '구독으로 월간 크레딧을 받고, 메인 이미지와 상세 장면, 고해상도 생성은 작업별로 크레딧을 사용합니다.',
    notes: [
      '무료 체험 크레딧',
      '월간 크레딧 풀',
      '생성 기록 및 HD 다운로드',
      '추가 크레딧 구매 예정',
    ],
    plans: [
      {
        name: '무료',
        price: '₩0',
        description: 'Prompt 워크벤치와 소량 테스트 생성에 적합',
        cta: '무료 시작',
        features: [
          '체험 크레딧 10개',
          '메인/상세 프리셋',
          '7일 생성 기록',
          '기본 다운로드',
        ],
      },
      {
        name: 'Pro',
        price: '$9.9/월',
        description: '지속적으로 상품을 출시하는 이커머스 팀용',
        cta: 'Pro 선택',
        featured: true,
        features: [
          '월 500 크레딧',
          'HD 메인/상세 내보내기',
          '배치 작업 큐',
          'Prompt 및 에셋 기록 재사용',
        ],
      },
      {
        name: 'Studio',
        price: '$29/월',
        description: '다중 스토어와 고빈도 출시 팀용',
        cta: 'Studio 업그레이드',
        features: [
          '월 2,000 크레딧',
          '우선순위 큐',
          '장기 에셋 기록',
          'API 및 팀 기능 우선 지원',
        ],
      },
    ],
  },
  es: {
    title: 'Elige un plan según tu volumen de generación',
    subtitle:
      'Las suscripciones incluyen créditos mensuales. Las imágenes principales, escenas de detalle y renders HD consumen créditos por tarea.',
    notes: [
      'Créditos de prueba gratis',
      'Bolsa mensual de créditos',
      'Historial y descargas HD',
      'Recargas de créditos próximamente',
    ],
    plans: [
      {
        name: 'Gratis',
        price: '$0',
        description: 'Para probar el workbench de Prompt y algunos renders',
        cta: 'Empezar gratis',
        features: [
          '10 créditos de prueba',
          'Presets principal/detalle',
          'Historial de 7 días',
          'Descargas básicas',
        ],
      },
      {
        name: 'Pro',
        price: '$9.9/mes',
        description: 'Para sellers ecommerce y DTC con lanzamientos continuos',
        cta: 'Elegir Pro',
        featured: true,
        features: [
          '500 créditos al mes',
          'Exportación HD',
          'Cola de tareas por lote',
          'Reutilización de Prompt y assets',
        ],
      },
      {
        name: 'Studio',
        price: '$29/mes',
        description: 'Para equipos, varias tiendas y alto volumen',
        cta: 'Subir a Studio',
        features: [
          '2,000 créditos al mes',
          'Cola prioritaria',
          'Historial extendido',
          'API y asientos de equipo primero',
        ],
      },
    ],
  },
};

export const Route = createFileRoute('/(pages)/pricing')({
  head: () => {
    const title = `Pricing | ${websiteConfig.metadata?.name}`;
    const description =
      'Choose a credit-based plan for AI ecommerce product image generation, including main images, detail scenes, generation history, and HD downloads.';
    const metadata = seo('/pricing', { title, description });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            softwareApplicationJsonLd({
              name: websiteConfig.metadata?.name ?? 'ProdList AI',
              description,
              path: '/pricing',
              locale: 'en',
            }),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Pricing', path: '/pricing' },
            ]),
          ]),
        },
      ],
    };
  },
  component: PricingPage,
});

function PricingPage() {
  const { locale, setLocale } = useProductLocale();
  const copy = PRICING_COPY[locale];
  const labels = PUBLIC_LABELS[locale];

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
        <PublicBreadcrumb
          items={[{ label: labels.home, href: '/' }, { label: copy.title }]}
        />
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            {copy.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {copy.notes.map((note) => (
              <span
                key={note}
                className="rounded-lg border bg-muted/40 px-3 py-1 text-sm"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {copy.plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border bg-card p-5 shadow-sm ${
                plan.featured ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              <div className="mb-6">
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-4 font-bold text-4xl">{plan.price}</p>
                <p className="mt-3 text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>
              <Button
                render={<Link to={Routes.Register} />}
                className="w-full"
                variant={plan.featured ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <FaqSection locale={locale} />
      </div>
    </Container>
  );
}
