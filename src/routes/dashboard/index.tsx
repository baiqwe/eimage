import {
  IconBolt,
  IconClock,
  IconPhoto,
  IconSparkles,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { Routes } from '@/lib/routes';
import { messages } from '@/messages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});

const DASHBOARD_COPY = {
  zh: {
    title: '商品图控制台',
    description: '查看订阅、点数、近期生成历史，并继续创建新的视觉资产。',
    openGenerator: '打开生成器',
    cards: [
      { label: '剩余点数', value: '45', hint: '本月可用' },
      { label: '生成任务', value: '18', hint: '最近 30 天' },
      { label: '已保存资产', value: '42', hint: '主图与详情图' },
      { label: '订阅状态', value: 'Pro', hint: '自动续订中' },
    ],
    historyTitle: '生成历史',
    empty:
      '真实生图 API 接入后，这里会展示每次生成的原图、Prompt、结果图和扣点记录。',
    rows: [
      ['陶瓷咖啡杯主图', '主图', 'Pure Studio Key Light', '已完成'],
      ['清晨窗台详情图', '详情图', 'Morning Window Lifestyle', '已完成'],
      ['暗调质感详情图', '详情图', 'Premium Dark Editorial', '排队中'],
    ],
  },
  en: {
    title: 'Product Image Dashboard',
    description:
      'Track subscription, credits, generation history, and continue creating new visual assets.',
    openGenerator: 'Open generator',
    cards: [
      { label: 'Credits left', value: '45', hint: 'Available this month' },
      { label: 'Generation jobs', value: '18', hint: 'Last 30 days' },
      { label: 'Saved assets', value: '42', hint: 'Main and detail images' },
      { label: 'Subscription', value: 'Pro', hint: 'Renews automatically' },
    ],
    historyTitle: 'Generation History',
    empty:
      'After the real image-generation API is connected, each row will keep the source image, prompt, result, and credit ledger.',
    rows: [
      ['Ceramic cup hero', 'Main', 'Pure Studio Key Light', 'Done'],
      [
        'Morning windowsill detail',
        'Detail',
        'Morning Window Lifestyle',
        'Done',
      ],
      ['Premium dark detail', 'Detail', 'Premium Dark Editorial', 'Queued'],
    ],
  },
} as const;

function DashboardPage() {
  const { locale, setLocale } = useProductLocale();
  const t = DASHBOARD_COPY[locale];
  const breadcrumbs = [
    {
      label: messages.dashboard.title,
      isCurrentPage: true,
    },
  ];

  return (
    <DashboardLayout
      breadcrumbs={breadcrumbs}
      title={t.title}
      description={t.description}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
        <Button render={<Link to={Routes.Generator} />}>
          <IconSparkles className="size-4" />
          {t.openGenerator}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {t.cards.map((card, index) => {
          const Icon = [IconBolt, IconClock, IconPhoto, IconSparkles][index];
          return (
            <div key={card.label} className="rounded-lg border bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-muted-foreground text-sm">{card.label}</p>
                <Icon className="size-5 text-primary" />
              </div>
              <p className="font-bold text-3xl">{card.value}</p>
              <p className="mt-1 text-muted-foreground text-sm">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold text-lg">{t.historyTitle}</h2>
          <p className="mt-1 text-muted-foreground text-sm">{t.empty}</p>
        </div>
        <div className="divide-y">
          {t.rows.map((row) => (
            <div
              key={row.join('-')}
              className="grid gap-2 p-4 text-sm md:grid-cols-[1.4fr_0.6fr_1fr_0.6fr]"
            >
              {row.map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
