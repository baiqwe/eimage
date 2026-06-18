import FaqSection from '@/components/blocks/faqs';
import Container from '@/components/layout/container';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { Routes } from '@/lib/routes';
import { seo } from '@/lib/seo';
import { messages } from '@/messages';
import { Link, createFileRoute } from '@tanstack/react-router';

const m = messages.pricing;

const PRICING_COPY = {
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
} as const;

export const Route = createFileRoute('/(pages)/pricing')({
  head: () =>
    seo('/pricing', {
      title: `${m.title} | ${websiteConfig.metadata?.name}`,
      description: m.description,
    }),
  component: PricingPage,
});

function PricingPage() {
  const { locale, setLocale } = useProductLocale();
  const copy = PRICING_COPY[locale];

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
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
        <FaqSection />
      </div>
    </Container>
  );
}
