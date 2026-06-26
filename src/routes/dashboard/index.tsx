import { useEffect } from 'react';
import {
  IconBolt,
  IconClock,
  IconPhoto,
  IconSparkles,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  getLocalizedPublicPath,
  ProductLanguageSelect,
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import { useCurrentPlan } from '@/hooks/use-payment';
import {
  useGenerationBatches,
  useGenerationCredits,
  useGenerationStats,
} from '@/hooks/use-generation-history';
import { Routes } from '@/lib/routes';
import {
  createFileRoute,
  Link,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});

const DASHBOARD_COPY: Record<
  ProductLocale,
  {
    title: string;
    description: string;
    openGenerator: string;
    cards: Array<{ label: string; hint: string }>;
    historyTitle: string;
    empty: string;
    taskUnit: string;
    creditUnit: string;
    freePlan: string;
    statuses: Record<string, string>;
  }
> = {
  zh: {
    title: '商品图控制台',
    description: '查看订阅、点数、近期生成历史，并继续创建新的视觉资产。',
    openGenerator: '打开生成器',
    cards: [
      { label: '剩余点数', hint: '当前账号' },
      { label: '生成任务', hint: '最近 30 天' },
      { label: '已保存资产', hint: '当前账号' },
      { label: '订阅状态', hint: '当前方案' },
    ],
    historyTitle: '生成历史',
    empty: '还没有生成记录。',
    taskUnit: '个任务',
    creditUnit: '点',
    freePlan: '免费版',
    statuses: {
      pending: '待处理',
      queued: '排队中',
      processing: '处理中',
      completed: '已完成',
      failed: '失败',
      partial: '部分完成',
    },
  },
  en: {
    title: 'Product Image Dashboard',
    description:
      'Track subscription, credits, generation history, and continue creating new visual assets.',
    openGenerator: 'Open generator',
    cards: [
      { label: 'Credits left', hint: 'Current account' },
      { label: 'Generation jobs', hint: 'Last 30 days' },
      { label: 'Saved assets', hint: 'Current account' },
      { label: 'Subscription', hint: 'Current plan' },
    ],
    historyTitle: 'Generation History',
    empty: 'No generation records yet.',
    taskUnit: 'tasks',
    creditUnit: 'credits',
    freePlan: 'Free',
    statuses: {
      pending: 'Pending',
      queued: 'Queued',
      processing: 'Processing',
      completed: 'Completed',
      failed: 'Failed',
      partial: 'Partially completed',
    },
  },
  ja: {
    title: '商品画像ダッシュボード',
    description:
      'サブスク、クレジット、最近の生成履歴を確認し、新しい素材を作成します。',
    openGenerator: '生成ツールを開く',
    cards: [
      { label: '残クレジット', hint: '現在のアカウント' },
      { label: '生成タスク', hint: '過去 30 日' },
      { label: '保存済み素材', hint: '現在のアカウント' },
      { label: '契約状態', hint: '現在のプラン' },
    ],
    historyTitle: '生成履歴',
    empty: 'まだ生成記録がありません。',
    taskUnit: '件',
    creditUnit: 'クレジット',
    freePlan: '無料プラン',
    statuses: {
      pending: '保留中',
      queued: '待機中',
      processing: '処理中',
      completed: '完了',
      failed: '失敗',
      partial: '一部完了',
    },
  },
  ko: {
    title: '상품 이미지 대시보드',
    description:
      '구독, 크레딧, 최근 생성 기록을 확인하고 새 비주얼 에셋을 만듭니다.',
    openGenerator: '생성기 열기',
    cards: [
      { label: '남은 크레딧', hint: '현재 계정' },
      { label: '생성 작업', hint: '최근 30일' },
      { label: '저장된 에셋', hint: '현재 계정' },
      { label: '구독 상태', hint: '현재 플랜' },
    ],
    historyTitle: '생성 기록',
    empty: '아직 생성 기록이 없습니다.',
    taskUnit: '개 작업',
    creditUnit: '크레딧',
    freePlan: '무료 플랜',
    statuses: {
      pending: '대기',
      queued: '대기열',
      processing: '처리 중',
      completed: '완료',
      failed: '실패',
      partial: '일부 완료',
    },
  },
  es: {
    title: 'Panel de imágenes de producto',
    description:
      'Consulta suscripción, créditos, historial reciente y continúa creando assets visuales.',
    openGenerator: 'Abrir generador',
    cards: [
      { label: 'Créditos restantes', hint: 'Cuenta actual' },
      { label: 'Tareas generadas', hint: 'Últimos 30 días' },
      { label: 'Assets guardados', hint: 'Cuenta actual' },
      { label: 'Suscripción', hint: 'Plan actual' },
    ],
    historyTitle: 'Historial de generación',
    empty: 'Todavía no hay registros de generación.',
    taskUnit: 'tareas',
    creditUnit: 'créditos',
    freePlan: 'Plan gratuito',
    statuses: {
      pending: 'Pendiente',
      queued: 'En cola',
      processing: 'Procesando',
      completed: 'Completado',
      failed: 'Fallido',
      partial: 'Parcialmente completado',
    },
  },
};

function DashboardPage() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { locale, setLocale } = useProductLocale();
  const t = DASHBOARD_COPY[locale];
  const { data: creditsData } = useGenerationCredits();
  const { data: statsData } = useGenerationStats();
  const { data: batchesData } = useGenerationBatches(0, 3);
  const { data: planData } = useCurrentPlan();
  const breadcrumbs = [
    {
      label: t.title,
      isCurrentPage: true,
    },
  ];

  function handleLocaleChange(next: ProductLocale) {
    setLocale(next);
    const nextPath = getLocalizedPublicPath(pathname, next);
    if (nextPath !== pathname) {
      navigate({ to: nextPath });
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${t.title} | ProdList AI`;
    }
  }, [t.title]);

  return (
    <DashboardLayout
      breadcrumbs={breadcrumbs}
      title={t.title}
      description={t.description}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductLanguageSelect
          locale={locale}
          onLocaleChange={handleLocaleChange}
        />
        <Button render={<Link to={Routes.Generator} />}>
          <IconSparkles className="size-4" />
          {t.openGenerator}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {t.cards.map((card, index) => {
          const Icon = [IconBolt, IconClock, IconPhoto, IconSparkles][index];
          const values = [
            creditsData?.balance?.toString() ?? '0',
            statsData?.recentBatches?.toString() ?? '0',
            statsData?.totalOutputs?.toString() ?? '0',
            planData?.currentPlan?.name ?? t.freePlan,
          ];
          return (
            <div key={card.label} className="rounded-lg border bg-card p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-muted-foreground text-sm">{card.label}</p>
                <Icon className="size-5 text-primary" />
              </div>
              <p className="font-bold text-3xl">{values[index]}</p>
              <p className="mt-1 text-muted-foreground text-sm">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold text-lg">{t.historyTitle}</h2>
        </div>
        <div className="divide-y">
          {!batchesData?.items?.length ? (
            <div className="p-4 text-muted-foreground text-sm">{t.empty}</div>
          ) : (
            batchesData.items.map((batch) => (
              <div
                key={batch.id}
                className="grid gap-2 p-4 text-sm md:grid-cols-[1.4fr_0.6fr_1fr_0.6fr]"
              >
                <span className="truncate">{batch.id}</span>
                <span>
                  {batch.taskCount} {t.taskUnit}
                </span>
                <span>{t.statuses[batch.status] ?? batch.status}</span>
                <span>
                  {batch.spentCredits} {t.creditUnit}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
