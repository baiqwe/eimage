import { Button } from '@/components/ui/button';
import { Routes } from '@/lib/routes';
import {
  IconArrowLeft,
  IconCloudUpload,
  IconLanguage,
  IconPhotoScan,
  IconSparkles,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

type BatchGeneratorLocale = 'zh' | 'en' | 'ja' | 'ko' | 'es';

const COPY: Record<
  BatchGeneratorLocale,
  {
    back: string;
    eyebrow: string;
    title: string;
    description: string;
    uploadTitle: string;
    uploadDescription: string;
    configTitle: string;
    configDescription: string;
    gridTitle: string;
    gridDescription: string;
    status: string;
  }
> = {
  zh: {
    back: '返回首页',
    eyebrow: '批量改图工作台',
    title: '多张商品图，一套指令，独立生成结果',
    description:
      '这里会承载批量图片翻译、改比例和背景扩图流程。每张上传图片都会拆成独立任务，方便分别追踪、重试和下载。',
    uploadTitle: '批量上传',
    uploadDescription: '支持 1-30 张商品图，按单图单任务处理。',
    configTitle: '共享配置',
    configDescription: '统一 Prompt、目标语言、比例、分辨率和输出模式。',
    gridTitle: '结果网格',
    gridDescription: '每张图独立显示上传、排队、处理中、完成或失败状态。',
    status: '阶段 1 已接入路由与 SEO 入口，下一阶段会补齐真实上传和任务执行。',
  },
  en: {
    back: 'Back home',
    eyebrow: 'Batch image workbench',
    title: 'Many product images, one instruction set, independent outputs',
    description:
      'This workbench will power batch image translation, ratio conversion, and background extension. Every uploaded image becomes its own task for tracking, retry, and download.',
    uploadTitle: 'Batch upload',
    uploadDescription:
      'Upload 1-30 product images and process one task per image.',
    configTitle: 'Shared config',
    configDescription:
      'Use one prompt, target language, ratio, resolution, and output mode.',
    gridTitle: 'Result grid',
    gridDescription:
      'Each image shows uploaded, queued, processing, completed, or failed state.',
    status:
      'Phase 1 wires routing and SEO entry points. Real upload and task execution comes next.',
  },
  ja: {
    back: 'ホームへ戻る',
    eyebrow: '一括画像ワークベンチ',
    title: '複数の商品画像を 1 つの指示で個別に処理',
    description:
      '一括翻訳、比率変更、背景拡張に対応するワークベンチです。各画像は独立タスクとして追跡、再試行、ダウンロードできます。',
    uploadTitle: '一括アップロード',
    uploadDescription: '1-30 枚の商品画像を画像ごとに処理します。',
    configTitle: '共有設定',
    configDescription:
      'Prompt、対象言語、比率、解像度、出力モードを共有します。',
    gridTitle: '結果グリッド',
    gridDescription:
      '各画像のアップロード、待機、処理中、完了、失敗を表示します。',
    status:
      'フェーズ 1 ではルートと SEO 入口を接続しました。実処理は次フェーズで追加します。',
  },
  ko: {
    back: '홈으로',
    eyebrow: '배치 이미지 워크벤치',
    title: '여러 상품 이미지를 하나의 지시로 각각 처리',
    description:
      '배치 번역, 비율 변환, 배경 확장을 위한 워크벤치입니다. 각 이미지는 독립 작업으로 추적, 재시도, 다운로드됩니다.',
    uploadTitle: '일괄 업로드',
    uploadDescription: '1-30장의 상품 이미지를 이미지별 작업으로 처리합니다.',
    configTitle: '공유 설정',
    configDescription:
      '프롬프트, 대상 언어, 비율, 해상도, 출력 모드를 공유합니다.',
    gridTitle: '결과 그리드',
    gridDescription:
      '각 이미지의 업로드, 대기, 처리 중, 완료, 실패 상태를 표시합니다.',
    status:
      '1단계에서는 라우팅과 SEO 진입점을 연결했습니다. 실제 업로드와 실행은 다음 단계에서 추가합니다.',
  },
  es: {
    back: 'Volver al inicio',
    eyebrow: 'Workbench por lotes',
    title:
      'Muchas imagenes de producto, una instruccion, resultados independientes',
    description:
      'Este workbench cubrira traduccion por lotes, cambio de proporcion y extension de fondo. Cada imagen subida sera una tarea independiente.',
    uploadTitle: 'Carga por lotes',
    uploadDescription:
      'Sube de 1 a 30 imagenes y procesa una tarea por imagen.',
    configTitle: 'Configuracion compartida',
    configDescription:
      'Un prompt, idioma objetivo, proporcion, resolucion y modo de salida.',
    gridTitle: 'Grid de resultados',
    gridDescription:
      'Cada imagen muestra estados de subida, cola, proceso, completada o fallida.',
    status:
      'La fase 1 conecta rutas y SEO. La carga real y ejecucion llegan en la siguiente fase.',
  },
};

export function BatchGeneratorWorkbench({
  locale = 'en',
}: {
  locale?: BatchGeneratorLocale;
}) {
  const copy = COPY[locale];

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231e]">
      <header className="border-[#dfe3d8] border-b bg-[#fbfcf7]/95">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Button
            type="button"
            variant="ghost"
            render={<Link to={Routes.Root} />}
          >
            <IconArrowLeft className="size-4" />
            {copy.back}
          </Button>
          <div className="rounded-full border border-[#dfe3d8] px-3 py-1 text-[#74796d] text-sm">
            {copy.eyebrow}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="font-semibold text-[#2f5f4f] text-sm">{copy.eyebrow}</p>
          <h1 className="mt-4 text-balance font-bold text-4xl tracking-tight md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[#5f665b] text-lg leading-8">
            {copy.description}
          </p>
          <div className="mt-6 rounded-lg border border-[#dfe3d8] bg-white p-4 text-[#5f665b] text-sm">
            {copy.status}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: IconCloudUpload,
              title: copy.uploadTitle,
              description: copy.uploadDescription,
            },
            {
              icon: IconLanguage,
              title: copy.configTitle,
              description: copy.configDescription,
            },
            {
              icon: IconPhotoScan,
              title: copy.gridTitle,
              description: copy.gridDescription,
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-[#dfe3d8] bg-white p-5 shadow-sm"
            >
              <item.icon className="size-6 text-[#d83b01]" />
              <h2 className="mt-5 font-semibold text-lg">{item.title}</h2>
              <p className="mt-3 text-[#74796d] text-sm leading-6">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="grid gap-3 rounded-lg border border-[#dfe3d8] bg-white p-4 md:grid-cols-4">
          {PLACEHOLDER_TILES.map((tile) => (
            <div
              key={tile}
              className="aspect-[4/3] rounded-md border border-dashed border-[#cbd2c3] bg-[#f7f8f4]"
            >
              <div className="flex h-full items-center justify-center text-[#9aa191]">
                <IconSparkles className="size-5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const PLACEHOLDER_TILES = [
  'source-1',
  'source-2',
  'source-3',
  'source-4',
  'output-1',
  'output-2',
  'output-3',
  'output-4',
] as const;
