import { Button } from '@/components/ui/button';
import {
  getProductBatchGeneratorPath,
  getProductGeneratorPath,
  getProductHomePath,
  getWhiteBackgroundGeneratorPath,
  ProductLanguageSelect,
  type ProductLocale,
} from '@/components/product/product-locale';
import { Routes } from '@/lib/routes';
import {
  IconArrowLeft,
  IconBolt,
  IconLayoutDashboard,
  IconLoader2,
  IconRefresh,
  IconSparkles,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

type GeneratorMode = 'photo-set' | 'batch' | 'white-background';

const HEADER_COPY: Record<
  ProductLocale,
  {
    back: string;
    appSubtitle: string;
    photoSet: string;
    batch: string;
    whiteBackground: string;
    dashboard: string;
    credits: string;
    refresh: string;
  }
> = {
  zh: {
    back: '返回首页',
    appSubtitle: '商品图智能生成工作台',
    photoSet: '套图生成器',
    batch: '批量生图',
    whiteBackground: '白底图',
    dashboard: '工作台',
    credits: '剩余点数',
    refresh: '刷新点数',
  },
  en: {
    back: 'Back home',
    appSubtitle: 'Product image generation workbench',
    photoSet: 'Photo set',
    batch: 'Batch editor',
    whiteBackground: 'White background',
    dashboard: 'Workbench',
    credits: 'Credits',
    refresh: 'Refresh credits',
  },
  ja: {
    back: 'ホームへ戻る',
    appSubtitle: '商品画像生成ワークベンチ',
    photoSet: 'セット生成',
    batch: '一括編集',
    whiteBackground: '白背景',
    dashboard: 'ワークベンチ',
    credits: 'クレジット',
    refresh: '更新',
  },
  ko: {
    back: '홈으로',
    appSubtitle: '상품 이미지 생성 워크벤치',
    photoSet: '세트 생성',
    batch: '배치 편집',
    whiteBackground: '흰 배경',
    dashboard: '워크벤치',
    credits: '크레딧',
    refresh: '새로고침',
  },
  es: {
    back: 'Volver al inicio',
    appSubtitle: 'Workbench de imagen de producto',
    photoSet: 'Set de fotos',
    batch: 'Editor por lotes',
    whiteBackground: 'Fondo blanco',
    dashboard: 'Panel',
    credits: 'Créditos',
    refresh: 'Actualizar',
  },
};

export function GeneratorWorkbenchHeader({
  locale,
  active,
  credits,
  refreshDisabled,
  refreshing,
  onRefresh,
  onLocaleChange,
}: {
  locale: ProductLocale;
  active: GeneratorMode;
  credits: number;
  refreshDisabled?: boolean;
  refreshing?: boolean;
  onRefresh: () => void;
  onLocaleChange: (locale: ProductLocale) => void;
}) {
  const copy = HEADER_COPY[locale];

  return (
    <header className="sticky top-0 z-30 border-[#dfe3d8] border-b bg-[#fbfcf7]/95 backdrop-blur">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-2 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="hidden shrink-0 md:inline-flex"
            render={<Link to={getProductHomePath(locale)} />}
          >
            <IconArrowLeft className="size-4" />
            {copy.back}
          </Button>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#22251f] text-[#f5f7ed]">
            <IconSparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-lg leading-none">
              ProdList AI
            </p>
            <p className="truncate text-[#74796d] text-xs">
              {copy.appSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="rounded-lg border border-[#dfe3d8] bg-white p-1 shadow-sm">
            <Button
              type="button"
              size="sm"
              variant={active === 'photo-set' ? 'default' : 'ghost'}
              className={active === 'photo-set' ? 'bg-[#20231e]' : undefined}
              render={<Link to={getProductGeneratorPath(locale)} />}
            >
              {copy.photoSet}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={active === 'batch' ? 'default' : 'ghost'}
              className={active === 'batch' ? 'bg-[#20231e]' : undefined}
              render={<Link to={getProductBatchGeneratorPath(locale)} />}
            >
              {copy.batch}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={active === 'white-background' ? 'default' : 'ghost'}
              className={
                active === 'white-background' ? 'bg-[#20231e]' : undefined
              }
              render={<Link to={getWhiteBackgroundGeneratorPath(locale)} />}
            >
              {copy.whiteBackground}
            </Button>
          </div>
          <ProductLanguageSelect
            locale={locale}
            onLocaleChange={onLocaleChange}
            compact
          />
          <Button
            type="button"
            variant="outline"
            className="bg-white"
            render={<Link to={Routes.Dashboard} />}
          >
            <IconLayoutDashboard className="size-4" />
            {copy.dashboard}
          </Button>
          <div className="flex items-center gap-2 rounded-lg border border-[#dfe3d8] bg-white px-3 py-2 text-sm shadow-sm">
            <IconBolt className="size-4 text-[#c9822f]" />
            <span className="hidden text-[#74796d] sm:inline">
              {copy.credits}
            </span>
            <strong>{credits}</strong>
          </div>
          <Button
            type="button"
            variant="outline"
            className="hidden bg-white md:inline-flex"
            disabled={refreshDisabled}
            onClick={onRefresh}
          >
            {refreshing ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconRefresh className="size-4" />
            )}
            {copy.refresh}
          </Button>
        </div>
      </div>
    </header>
  );
}
