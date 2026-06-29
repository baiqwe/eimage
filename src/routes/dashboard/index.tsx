import { useEffect, useState } from 'react';
import {
  IconBolt,
  IconChevronDown,
  IconChevronRight,
  IconClock,
  IconDownload,
  IconEye,
  IconPhoto,
  IconSparkles,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  getLocalizedPublicPath,
  getProductBatchGeneratorPath,
  ProductLanguageSelect,
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import { useCurrentPlan } from '@/hooks/use-payment';
import {
  useGenerationBatches,
  useGenerationBatchDetail,
  useGenerationCredits,
  useGenerationStats,
} from '@/hooks/use-generation-history';
import { downloadFile } from '@/lib/download';
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
    columns: {
      prompt: string;
      created: string;
      status: string;
      model: string;
      aspectResolution: string;
      credits: string;
      refunded: string;
      actions: string;
    };
    preview: string;
    download: string;
    batch: string;
    refundedYes: string;
    refundedNo: string;
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
    columns: {
      prompt: 'Prompt',
      created: '创建时间',
      status: '状态',
      model: '模型',
      aspectResolution: '比例 / 分辨率',
      credits: '点数',
      refunded: '退回',
      actions: '操作',
    },
    preview: '预览',
    download: '下载',
    batch: '批次',
    refundedYes: '已退回',
    refundedNo: '0',
    statuses: {
      pending: '待处理',
      queued: '排队中',
      running: '处理中',
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
    columns: {
      prompt: 'Prompt',
      created: 'Created',
      status: 'Status',
      model: 'Model',
      aspectResolution: 'Aspect / Resolution',
      credits: 'Credits',
      refunded: 'Refunded',
      actions: 'Actions',
    },
    preview: 'Preview',
    download: 'Download',
    batch: 'Batch',
    refundedYes: 'Refunded',
    refundedNo: '0',
    statuses: {
      pending: 'Pending',
      queued: 'Queued',
      running: 'Processing',
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
    columns: {
      prompt: 'Prompt',
      created: '作成日時',
      status: '状態',
      model: 'モデル',
      aspectResolution: '比率 / 解像度',
      credits: 'クレジット',
      refunded: '返却',
      actions: '操作',
    },
    preview: 'プレビュー',
    download: '保存',
    batch: 'バッチ',
    refundedYes: '返却済み',
    refundedNo: '0',
    statuses: {
      pending: '保留中',
      queued: '待機中',
      running: '処理中',
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
    columns: {
      prompt: 'Prompt',
      created: '생성 시간',
      status: '상태',
      model: '모델',
      aspectResolution: '비율 / 해상도',
      credits: '크레딧',
      refunded: '환불',
      actions: '작업',
    },
    preview: '미리보기',
    download: '다운로드',
    batch: '배치',
    refundedYes: '환불됨',
    refundedNo: '0',
    statuses: {
      pending: '대기',
      queued: '대기열',
      running: '처리 중',
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
    columns: {
      prompt: 'Prompt',
      created: 'Creado',
      status: 'Estado',
      model: 'Modelo',
      aspectResolution: 'Proporcion / Resolucion',
      credits: 'Creditos',
      refunded: 'Reembolso',
      actions: 'Acciones',
    },
    preview: 'Vista previa',
    download: 'Descargar',
    batch: 'Lote',
    refundedYes: 'Reembolsado',
    refundedNo: '0',
    statuses: {
      pending: 'Pendiente',
      queued: 'En cola',
      running: 'Procesando',
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
  const { data: batchesData } = useGenerationBatches(0, 10);
  const { data: planData } = useCurrentPlan();
  const [expandedBatchId, setExpandedBatchId] = useState('');
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
        <Button render={<Link to={getProductBatchGeneratorPath(locale)} />}>
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

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold text-lg">{t.historyTitle}</h2>
        </div>
        <div>
          {!batchesData?.items?.length ? (
            <div className="p-4 text-muted-foreground text-sm">{t.empty}</div>
          ) : (
            batchesData.items.map((batch) => (
              <GenerationBatchHistoryRow
                key={batch.id}
                batch={batch}
                expanded={expandedBatchId === batch.id}
                onToggle={() =>
                  setExpandedBatchId((current) =>
                    current === batch.id ? '' : batch.id
                  )
                }
                t={t}
                locale={locale}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

type DashboardCopy = (typeof DASHBOARD_COPY)[ProductLocale];
type GenerationBatchListItem = {
  id: string;
  projectId: string;
  status: string;
  taskCount: number;
  completedTaskCount: number;
  failedTaskCount: number;
  reservedCredits: number;
  spentCredits: number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
};

function GenerationBatchHistoryRow({
  batch,
  expanded,
  onToggle,
  t,
  locale,
}: {
  batch: GenerationBatchListItem;
  expanded: boolean;
  onToggle: () => void;
  t: DashboardCopy;
  locale: ProductLocale;
}) {
  const detailQuery = useGenerationBatchDetail(expanded ? batch.id : undefined);
  const dateLocale = {
    zh: 'zh-CN',
    en: 'en',
    ja: 'ja-JP',
    ko: 'ko-KR',
    es: 'es-ES',
  }[locale];

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        className="grid w-full items-center gap-3 p-4 text-left text-sm transition hover:bg-muted/40 md:grid-cols-[2fr_1fr_1fr_1fr]"
        onClick={onToggle}
      >
        <span className="flex min-w-0 items-center gap-2">
          {expanded ? (
            <IconChevronDown className="size-4 shrink-0" />
          ) : (
            <IconChevronRight className="size-4 shrink-0" />
          )}
          <span className="min-w-0">
            <span className="block truncate font-medium">
              {t.batch} {shortId(batch.id)}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDashboardDate(batch.createdAt, dateLocale)}
            </span>
          </span>
        </span>
        <span>
          {batch.taskCount} {t.taskUnit}
        </span>
        <span>
          <Badge variant="outline">
            {t.statuses[batch.status] ?? batch.status}
          </Badge>
        </span>
        <span>
          {batch.spentCredits} {t.creditUnit}
        </span>
      </button>

      {expanded ? (
        <div className="overflow-x-auto border-t bg-muted/15">
          <div className="min-w-[1120px]">
            <div className="grid grid-cols-[2.2fr_1.2fr_0.9fr_1fr_1.1fr_0.7fr_0.8fr_1.1fr] gap-4 border-b px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-[0.18em]">
              <span>{t.columns.prompt}</span>
              <span>{t.columns.created}</span>
              <span>{t.columns.status}</span>
              <span>{t.columns.model}</span>
              <span>{t.columns.aspectResolution}</span>
              <span>{t.columns.credits}</span>
              <span>{t.columns.refunded}</span>
              <span>{t.columns.actions}</span>
            </div>
            {detailQuery.isLoading ? (
              <div className="px-4 py-5 text-muted-foreground text-sm">...</div>
            ) : (
              detailQuery.data?.tasks.map((task) => {
                const output = detailQuery.data?.outputs.find(
                  (item) => item.taskId === task.id
                );
                const publicUrl = output?.publicUrl ?? '';
                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-[2.2fr_1.2fr_0.9fr_1fr_1.1fr_0.7fr_0.8fr_1.1fr] items-center gap-4 border-b px-4 py-4 text-sm last:border-b-0"
                  >
                    <span className="line-clamp-2">{task.prompt}</span>
                    <span className="text-muted-foreground">
                      {formatDashboardDate(task.createdAt, dateLocale)}
                    </span>
                    <span>{t.statuses[task.status] ?? task.status}</span>
                    <span>{task.style}</span>
                    <span>
                      {task.aspectRatio} / {task.resolution}
                    </span>
                    <span>{task.creditCost}</span>
                    <span>
                      {task.status === 'failed'
                        ? `${task.creditCost} ${t.creditUnit}`
                        : t.refundedNo}
                    </span>
                    <span className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!publicUrl}
                        onClick={() =>
                          publicUrl &&
                          window.open(
                            publicUrl,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        <IconEye className="size-4" />
                        {t.preview}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!publicUrl}
                        onClick={() =>
                          publicUrl &&
                          void downloadFile(
                            publicUrl,
                            `prodlist-${task.id}.png`
                          )
                        }
                      >
                        <IconDownload className="size-4" />
                        {t.download}
                      </Button>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function shortId(id: string) {
  return id.replace(/^batch_/, '').slice(0, 8);
}

function formatDashboardDate(value: Date | string | number, locale: string) {
  return new Date(value).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
