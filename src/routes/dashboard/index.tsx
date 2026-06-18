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
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import { Routes } from '@/lib/routes';
import { messages } from '@/messages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});

const DASHBOARD_COPY: Record<
  ProductLocale,
  {
    title: string;
    description: string;
    openGenerator: string;
    cards: Array<{ label: string; value: string; hint: string }>;
    historyTitle: string;
    empty: string;
    rows: string[][];
  }
> = {
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
  ja: {
    title: '商品画像ダッシュボード',
    description:
      'サブスク、クレジット、最近の生成履歴を確認し、新しい素材を作成します。',
    openGenerator: '生成ツールを開く',
    cards: [
      { label: '残クレジット', value: '45', hint: '今月利用可能' },
      { label: '生成タスク', value: '18', hint: '過去 30 日' },
      { label: '保存済み素材', value: '42', hint: '主画像と詳細画像' },
      { label: '契約状態', value: 'Pro', hint: '自動更新中' },
    ],
    historyTitle: '生成履歴',
    empty:
      '実際の画像生成 API 接続後、元画像、Prompt、結果、クレジット記録が表示されます。',
    rows: [
      ['陶器カップ主画像', '主画像', 'Pure Studio Key Light', '完了'],
      ['朝の窓辺詳細画像', '詳細', 'Morning Window Lifestyle', '完了'],
      ['暗調プレミアム詳細画像', '詳細', 'Premium Dark Editorial', '待機中'],
    ],
  },
  ko: {
    title: '상품 이미지 대시보드',
    description:
      '구독, 크레딧, 최근 생성 기록을 확인하고 새 비주얼 에셋을 만듭니다.',
    openGenerator: '생성기 열기',
    cards: [
      { label: '남은 크레딧', value: '45', hint: '이번 달 사용 가능' },
      { label: '생성 작업', value: '18', hint: '최근 30일' },
      { label: '저장된 에셋', value: '42', hint: '메인 및 상세 이미지' },
      { label: '구독 상태', value: 'Pro', hint: '자동 갱신 중' },
    ],
    historyTitle: '생성 기록',
    empty:
      '실제 이미지 생성 API 연결 후 원본 이미지, Prompt, 결과, 크레딧 기록이 표시됩니다.',
    rows: [
      ['세라믹 컵 메인', '메인', 'Pure Studio Key Light', '완료'],
      ['아침 창가 상세', '상세', 'Morning Window Lifestyle', '완료'],
      ['프리미엄 다크 상세', '상세', 'Premium Dark Editorial', '대기 중'],
    ],
  },
  es: {
    title: 'Panel de imágenes de producto',
    description:
      'Consulta suscripción, créditos, historial reciente y continúa creando assets visuales.',
    openGenerator: 'Abrir generador',
    cards: [
      {
        label: 'Créditos restantes',
        value: '45',
        hint: 'Disponibles este mes',
      },
      { label: 'Tareas generadas', value: '18', hint: 'Últimos 30 días' },
      {
        label: 'Assets guardados',
        value: '42',
        hint: 'Principales y detalles',
      },
      { label: 'Suscripción', value: 'Pro', hint: 'Renovación automática' },
    ],
    historyTitle: 'Historial de generación',
    empty:
      'Cuando se conecte la API real, aquí aparecerán imagen fuente, Prompt, resultado y créditos.',
    rows: [
      [
        'Hero de taza cerámica',
        'Principal',
        'Pure Studio Key Light',
        'Completado',
      ],
      [
        'Detalle de ventana matutina',
        'Detalle',
        'Morning Window Lifestyle',
        'Completado',
      ],
      [
        'Detalle oscuro premium',
        'Detalle',
        'Premium Dark Editorial',
        'En cola',
      ],
    ],
  },
};

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
