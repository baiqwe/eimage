import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Routes } from '@/lib/routes';
import {
  IconArrowLeft,
  IconCheck,
  IconCloudUpload,
  IconDownload,
  IconHistory,
  IconLanguage,
  IconPhotoScan,
  IconPlayerPlay,
  IconRefresh,
  IconSparkles,
  IconTrash,
  IconWand,
  IconX,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

type BatchGeneratorLocale = 'zh' | 'en' | 'ja' | 'ko' | 'es';
type OutputMode = 'translate' | 'resize' | 'outpaint' | 'marketplace';
type AspectRatio = '1:1' | '3:4' | '4:5' | '16:9';
type Resolution = '1024' | '1536' | '2048';
type BatchTaskStatus =
  | 'uploaded'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed';

interface BatchImageTask {
  id: string;
  name: string;
  size: number;
  sourceDataUrl: string;
  resultDataUrl?: string;
  status: BatchTaskStatus;
  progress: number;
  error?: string;
}

interface BatchHistoryItem {
  id: string;
  name: string;
  total: number;
  completed: number;
  failed: number;
  mode: OutputMode;
}

const MAX_IMAGES = 30;
const MAX_SIZE_MB = 12;

const OUTPUT_MODES: OutputMode[] = [
  'marketplace',
  'translate',
  'resize',
  'outpaint',
];
const ASPECT_RATIOS: AspectRatio[] = ['1:1', '3:4', '4:5', '16:9'];
const RESOLUTIONS: Resolution[] = ['1024', '1536', '2048'];
const TARGET_LANGUAGES = [
  'English',
  'Chinese',
  'Japanese',
  'Korean',
  'Spanish',
];

const COPY: Record<
  BatchGeneratorLocale,
  {
    back: string;
    eyebrow: string;
    title: string;
    description: string;
    uploadTitle: string;
    uploadDescription: string;
    chooseFiles: string;
    dropHint: string;
    limitHint: string;
    configTitle: string;
    configDescription: string;
    mode: string;
    language: string;
    ratio: string;
    resolution: string;
    prompt: string;
    promptPlaceholder: string;
    start: string;
    clear: string;
    retry: string;
    gridTitle: string;
    gridDescription: string;
    inspectorTitle: string;
    historyTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    selected: string;
    credits: string;
    ready: string;
    queued: string;
    processing: string;
    completed: string;
    failed: string;
    download: string;
    remove: string;
    noSelection: string;
    localOnly: string;
    resultPlan: string;
    modes: Record<OutputMode, string>;
    modeHints: Record<OutputMode, string>;
  }
> = {
  zh: {
    back: '返回首页',
    eyebrow: '批量改图工作台',
    title: '多张商品图，一套指令，独立生成结果',
    description:
      '上传多张商品图后，系统会按单图拆分任务，并用同一套 Prompt、语言和尺寸配置并行执行。结果区按图片维度展示，方便逐张检查、重试和下载。',
    uploadTitle: '批量上传',
    uploadDescription: '支持 1-30 张商品图，单张不超过 12MB。',
    chooseFiles: '选择图片',
    dropHint: '拖拽图片到这里',
    limitHint: 'JPG、PNG、WebP；本阶段先在前端模拟任务流。',
    configTitle: '共享配置',
    configDescription: '所有图片共用一套生成意图，生成时每张图仍是独立任务。',
    mode: '输出模式',
    language: '目标语言',
    ratio: '尺寸比例',
    resolution: '分辨率',
    prompt: '统一指令',
    promptPlaceholder:
      '例如：把图片中的文字翻译成目标语言，保持产品形状不变，统一为干净的电商主图风格。',
    start: '开始批量任务',
    clear: '清空',
    retry: '重试失败',
    gridTitle: '批量结果',
    gridDescription: '每张图片独立排队、处理和产出结果。',
    inspectorTitle: '结果检查器',
    historyTitle: '本地批次',
    emptyTitle: '先上传商品图',
    emptyDescription: '建议先用同一批 SKU 或同一类目图片，结果更容易统一。',
    selected: '已选择',
    credits: '预计点数',
    ready: '已上传',
    queued: '排队中',
    processing: '处理中',
    completed: '已完成',
    failed: '失败',
    download: '下载结果',
    remove: '移除',
    noSelection: '选择一张图片查看详情',
    localOnly: '阶段二为前端本地任务流，阶段三会接入真实生图 API。',
    resultPlan:
      '多张结果建议用“批次总览 + 单图检查器”：中间保留密集网格，右侧展示当前图片的大图、状态、下载和错误信息；历史批次作为轻量抽屉或侧栏，不抢占主画布。',
    modes: {
      marketplace: '电商套图统一',
      translate: '图片文字翻译',
      resize: '改比例/改尺寸',
      outpaint: '背景扩图',
    },
    modeHints: {
      marketplace: '统一光影、背景和平台主图风格。',
      translate: '翻译包装或海报文字，尽量保持排版。',
      resize: '按目标比例重构画布，保护商品主体。',
      outpaint: '向外扩展背景，补齐商品周围空间。',
    },
  },
  en: {
    back: 'Back home',
    eyebrow: 'Batch image workbench',
    title: 'Many product images, one instruction set, independent outputs',
    description:
      'Upload a set of product images, apply one shared prompt and output config, then track each image as an independent task for review, retry, and download.',
    uploadTitle: 'Batch upload',
    uploadDescription: 'Upload 1-30 product images, up to 12MB each.',
    chooseFiles: 'Choose images',
    dropHint: 'Drop product images here',
    limitHint: 'JPG, PNG, or WebP. This phase simulates the task flow locally.',
    configTitle: 'Shared config',
    configDescription:
      'One intent for the whole batch; one independent task per image.',
    mode: 'Output mode',
    language: 'Target language',
    ratio: 'Aspect ratio',
    resolution: 'Resolution',
    prompt: 'Shared instruction',
    promptPlaceholder:
      'Example: translate visible text to the target language, preserve the product, and unify the image as a clean ecommerce hero shot.',
    start: 'Start batch',
    clear: 'Clear',
    retry: 'Retry failed',
    gridTitle: 'Batch results',
    gridDescription: 'Each image queues, processes, and completes separately.',
    inspectorTitle: 'Result inspector',
    historyTitle: 'Local batches',
    emptyTitle: 'Upload product images first',
    emptyDescription:
      'Use one SKU family or one product category for more consistent outputs.',
    selected: 'selected',
    credits: 'Estimated credits',
    ready: 'Uploaded',
    queued: 'Queued',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    download: 'Download result',
    remove: 'Remove',
    noSelection: 'Select an image to inspect it',
    localOnly:
      'Phase 2 runs a local task flow. Phase 3 connects the real image API.',
    resultPlan:
      'For many outputs, use a batch overview plus single-image inspector: keep a dense grid in the center, show the selected result, status, download, and errors on the right, and keep history as a lightweight side panel.',
    modes: {
      marketplace: 'Marketplace set',
      translate: 'Image text translation',
      resize: 'Resize / ratio change',
      outpaint: 'Background outpaint',
    },
    modeHints: {
      marketplace: 'Unify lighting, background, and marketplace hero style.',
      translate: 'Translate packaging or poster text while preserving layout.',
      resize: 'Rebuild the canvas around the protected product subject.',
      outpaint:
        'Extend the background and create more space around the product.',
    },
  },
  ja: {
    back: 'ホームへ戻る',
    eyebrow: '一括画像ワークベンチ',
    title: '複数の商品画像を 1 つの指示で個別に処理',
    description:
      '商品画像をまとめてアップロードし、共通 Prompt と出力設定を適用します。各画像は独立タスクとして追跡、確認、再試行、ダウンロードできます。',
    uploadTitle: '一括アップロード',
    uploadDescription: '1-30 枚の商品画像、1 枚 12MB まで対応。',
    chooseFiles: '画像を選択',
    dropHint: '商品画像をここにドロップ',
    limitHint: 'JPG、PNG、WebP。現段階ではローカルでタスク流を再現します。',
    configTitle: '共有設定',
    configDescription: 'バッチ全体で 1 つの意図を使い、画像ごとに処理します。',
    mode: '出力モード',
    language: '対象言語',
    ratio: '比率',
    resolution: '解像度',
    prompt: '共通指示',
    promptPlaceholder:
      '例：画像内の文字を対象言語に翻訳し、商品形状を保ち、清潔な EC メイン画像に統一する。',
    start: '一括開始',
    clear: 'クリア',
    retry: '失敗を再試行',
    gridTitle: '一括結果',
    gridDescription: '各画像は個別に待機、処理、完了します。',
    inspectorTitle: '結果インスペクター',
    historyTitle: 'ローカル履歴',
    emptyTitle: 'まず商品画像をアップロード',
    emptyDescription: '同じ SKU 系列や同じカテゴリを使うと結果が安定します。',
    selected: '選択中',
    credits: '推定クレジット',
    ready: 'アップロード済み',
    queued: '待機中',
    processing: '処理中',
    completed: '完了',
    failed: '失敗',
    download: '結果を保存',
    remove: '削除',
    noSelection: '画像を選択して詳細を確認',
    localOnly:
      'フェーズ 2 はローカル処理です。フェーズ 3 で実 API に接続します。',
    resultPlan:
      '多数の結果は「バッチ一覧 + 単画像インスペクター」が適しています。中央に密なグリッド、右側に選択画像、状態、保存、エラーを表示し、履歴は軽いサイドパネルにします。',
    modes: {
      marketplace: 'EC セット統一',
      translate: '画像文字翻訳',
      resize: '比率/サイズ変更',
      outpaint: '背景拡張',
    },
    modeHints: {
      marketplace: '光、背景、EC メイン画像の雰囲気を統一します。',
      translate: '包装やポスター文字を翻訳し、レイアウトを保ちます。',
      resize: '商品主体を保護してキャンバスを再構成します。',
      outpaint: '背景を広げ、商品の周囲に余白を作ります。',
    },
  },
  ko: {
    back: '홈으로',
    eyebrow: '배치 이미지 워크벤치',
    title: '여러 상품 이미지를 하나의 지시로 각각 처리',
    description:
      '여러 상품 이미지를 업로드하고 하나의 프롬프트와 출력 설정을 적용합니다. 각 이미지는 독립 작업으로 추적, 확인, 재시도, 다운로드됩니다.',
    uploadTitle: '일괄 업로드',
    uploadDescription: '1-30장, 이미지당 최대 12MB.',
    chooseFiles: '이미지 선택',
    dropHint: '상품 이미지를 여기에 놓기',
    limitHint: 'JPG, PNG, WebP. 이 단계는 로컬 작업 흐름을 시뮬레이션합니다.',
    configTitle: '공유 설정',
    configDescription:
      '배치 전체에 하나의 의도를 쓰고 이미지는 각각 처리합니다.',
    mode: '출력 모드',
    language: '대상 언어',
    ratio: '비율',
    resolution: '해상도',
    prompt: '공통 지시',
    promptPlaceholder:
      '예: 이미지 속 문구를 대상 언어로 번역하고 상품 형태를 유지하며 깔끔한 커머스 대표 이미지로 통일.',
    start: '배치 시작',
    clear: '비우기',
    retry: '실패 재시도',
    gridTitle: '배치 결과',
    gridDescription: '각 이미지는 개별로 대기, 처리, 완료됩니다.',
    inspectorTitle: '결과 검사기',
    historyTitle: '로컬 배치',
    emptyTitle: '먼저 상품 이미지를 업로드',
    emptyDescription:
      '같은 SKU 묶음이나 같은 카테고리를 쓰면 결과가 더 안정적입니다.',
    selected: '선택됨',
    credits: '예상 크레딧',
    ready: '업로드됨',
    queued: '대기 중',
    processing: '처리 중',
    completed: '완료',
    failed: '실패',
    download: '결과 다운로드',
    remove: '삭제',
    noSelection: '이미지를 선택해 상세 확인',
    localOnly: '2단계는 로컬 작업 흐름입니다. 3단계에서 실제 API를 연결합니다.',
    resultPlan:
      '여러 결과는 배치 개요와 단일 이미지 검사기 조합이 적합합니다. 중앙은 촘촘한 그리드, 오른쪽은 선택 이미지와 상태, 다운로드, 오류를 표시하고 히스토리는 가벼운 사이드 패널로 둡니다.',
    modes: {
      marketplace: '마켓플레이스 세트',
      translate: '이미지 텍스트 번역',
      resize: '비율/크기 변경',
      outpaint: '배경 확장',
    },
    modeHints: {
      marketplace: '조명, 배경, 대표 이미지 스타일을 통일합니다.',
      translate: '패키지나 포스터 문구를 번역하고 레이아웃을 유지합니다.',
      resize: '상품 주체를 보호하며 캔버스를 재구성합니다.',
      outpaint: '배경을 확장해 상품 주변 공간을 만듭니다.',
    },
  },
  es: {
    back: 'Volver al inicio',
    eyebrow: 'Workbench por lotes',
    title:
      'Muchas imagenes de producto, una instruccion, resultados independientes',
    description:
      'Sube varias imagenes de producto, aplica un prompt y una configuracion comun, y revisa cada imagen como una tarea independiente.',
    uploadTitle: 'Carga por lotes',
    uploadDescription: 'Sube de 1 a 30 imagenes, hasta 12MB cada una.',
    chooseFiles: 'Elegir imagenes',
    dropHint: 'Arrastra imagenes aqui',
    limitHint: 'JPG, PNG o WebP. Esta fase simula el flujo localmente.',
    configTitle: 'Configuracion compartida',
    configDescription:
      'Una intencion para todo el lote; una tarea independiente por imagen.',
    mode: 'Modo de salida',
    language: 'Idioma objetivo',
    ratio: 'Proporcion',
    resolution: 'Resolucion',
    prompt: 'Instruccion comun',
    promptPlaceholder:
      'Ejemplo: traducir el texto visible al idioma objetivo, conservar el producto y unificar la imagen como hero ecommerce limpio.',
    start: 'Iniciar lote',
    clear: 'Limpiar',
    retry: 'Reintentar fallidas',
    gridTitle: 'Resultados del lote',
    gridDescription: 'Cada imagen se encola, procesa y completa por separado.',
    inspectorTitle: 'Inspector de resultado',
    historyTitle: 'Lotes locales',
    emptyTitle: 'Primero sube imagenes',
    emptyDescription:
      'Usa una familia de SKU o una categoria para resultados mas consistentes.',
    selected: 'seleccionada',
    credits: 'Creditos estimados',
    ready: 'Subida',
    queued: 'En cola',
    processing: 'Procesando',
    completed: 'Completada',
    failed: 'Fallida',
    download: 'Descargar resultado',
    remove: 'Eliminar',
    noSelection: 'Selecciona una imagen para revisarla',
    localOnly: 'La fase 2 usa un flujo local. La fase 3 conectara la API real.',
    resultPlan:
      'Para muchos resultados conviene una vista de lote y un inspector: grid denso al centro, resultado seleccionado, estado, descarga y errores a la derecha, e historial como panel ligero.',
    modes: {
      marketplace: 'Set marketplace',
      translate: 'Traduccion de texto',
      resize: 'Cambiar proporcion',
      outpaint: 'Expandir fondo',
    },
    modeHints: {
      marketplace: 'Unifica luz, fondo y estilo hero de marketplace.',
      translate: 'Traduce textos de empaque o poster preservando composicion.',
      resize: 'Reconstruye el lienzo protegiendo el producto.',
      outpaint: 'Extiende el fondo y crea mas espacio alrededor del producto.',
    },
  },
};

export function BatchGeneratorWorkbench({
  locale = 'en',
}: {
  locale?: BatchGeneratorLocale;
}) {
  const copy = COPY[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number[]>([]);
  const [tasks, setTasks] = useState<BatchImageTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [mode, setMode] = useState<OutputMode>('marketplace');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [resolution, setResolution] = useState<Resolution>('1024');
  const [prompt, setPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<BatchHistoryItem[]>([]);

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const completedCount = tasks.filter(
    (task) => task.status === 'completed'
  ).length;
  const failedCount = tasks.filter((task) => task.status === 'failed').length;
  const runningCount = tasks.filter((task) =>
    ['queued', 'processing'].includes(task.status)
  ).length;
  const creditEstimate = useMemo(
    () =>
      tasks.length *
      (resolution === '2048' ? 3 : resolution === '1536' ? 2 : 1),
    [resolution, tasks.length]
  );
  const hasTasks = tasks.length > 0;
  const canStart = hasTasks && runningCount === 0;

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .filter((file) => file.size <= MAX_SIZE_MB * 1024 * 1024)
      .slice(0, Math.max(MAX_IMAGES - tasks.length, 0));

    if (files.length === 0) return;

    const nextTasks = await Promise.all(
      files.map(async (file) => ({
        id: makeTaskId(),
        name: file.name,
        size: file.size,
        sourceDataUrl: await readFileAsDataUrl(file),
        status: 'uploaded' as const,
        progress: 0,
      }))
    );

    setTasks((current) => {
      const merged = [...current, ...nextTasks].slice(0, MAX_IMAGES);
      if (!selectedTaskId) setSelectedTaskId(merged[0]?.id ?? '');
      return merged;
    });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      void addFiles(event.target.files);
    }
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  function removeTask(id: string) {
    setTasks((current) => {
      const next = current.filter((task) => task.id !== id);
      if (selectedTaskId === id) setSelectedTaskId(next[0]?.id ?? '');
      return next;
    });
  }

  function clearTasks() {
    stopTimers();
    setTasks([]);
    setSelectedTaskId('');
  }

  function startBatch() {
    if (!canStart) return;
    stopTimers();
    const batchId = makeTaskId();
    const batchName = `Batch ${new Date().toLocaleTimeString()}`;

    setTasks((current) =>
      current.map((task) => ({
        ...task,
        status: 'queued',
        progress: 8,
        error: undefined,
        resultDataUrl: undefined,
      }))
    );

    tasks.forEach((task, index) => {
      const processingTimer = window.setTimeout(
        () => {
          setTasks((current) =>
            current.map((item) =>
              item.id === task.id
                ? { ...item, status: 'processing', progress: 54 }
                : item
            )
          );
        },
        420 + index * 220
      );

      const completedTimer = window.setTimeout(
        () => {
          setTasks((current) =>
            current.map((item) =>
              item.id === task.id
                ? {
                    ...item,
                    status: 'completed',
                    progress: 100,
                    resultDataUrl: item.sourceDataUrl,
                  }
                : item
            )
          );
        },
        1300 + index * 360
      );

      timerRef.current.push(processingTimer, completedTimer);
    });

    const historyTimer = window.setTimeout(
      () => {
        setHistory((current) =>
          [
            {
              id: batchId,
              name: batchName,
              total: tasks.length,
              completed: tasks.length,
              failed: 0,
              mode,
            },
            ...current,
          ].slice(0, 5)
        );
      },
      1500 + tasks.length * 360
    );

    timerRef.current.push(historyTimer);
  }

  function retryFailed() {
    setTasks((current) =>
      current.map((task) =>
        task.status === 'failed'
          ? {
              ...task,
              status: 'uploaded',
              progress: 0,
              error: undefined,
              resultDataUrl: undefined,
            }
          : task
      )
    );
  }

  function downloadSelectedTask() {
    if (!(selectedTask?.resultDataUrl || selectedTask?.sourceDataUrl)) return;
    const anchor = document.createElement('a');
    anchor.href = selectedTask.resultDataUrl ?? selectedTask.sourceDataUrl;
    anchor.download = `prodlist-${selectedTask.name}`;
    anchor.click();
  }

  function stopTimers() {
    timerRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });
    timerRef.current = [];
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231e]">
      <header className="sticky top-0 z-20 border-[#dfe3d8] border-b bg-[#fbfcf7]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
          <Button
            type="button"
            variant="ghost"
            render={<Link to={Routes.Root} />}
          >
            <IconArrowLeft className="size-4" />
            {copy.back}
          </Button>
          <div className="hidden rounded-full border border-[#dfe3d8] px-3 py-1 text-[#74796d] text-sm md:block">
            {copy.localOnly}
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)_340px]">
        <aside className="border-[#dfe3d8] border-b bg-[#fbfcf7] p-4 lg:border-r lg:border-b-0">
          <div className="mb-5">
            <p className="font-semibold text-[#2f5f4f] text-sm">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 font-bold text-2xl tracking-tight">
              {copy.title}
            </h1>
            <p className="mt-3 text-[#5f665b] text-sm leading-6">
              {copy.description}
            </p>
          </div>

          <div className="space-y-4">
            <section className="rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{copy.uploadTitle}</h2>
                  <p className="mt-1 text-[#74796d] text-sm">
                    {copy.uploadDescription}
                  </p>
                </div>
                <IconCloudUpload className="size-5 text-[#d83b01]" />
              </div>

              <div
                className={`mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition ${
                  isDragging
                    ? 'border-[#d83b01] bg-[#fff4ec]'
                    : 'border-[#cbd2c3] bg-[#f7f8f4]'
                }`}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <IconPhotoScan className="size-8 text-[#6e7d67]" />
                <p className="mt-3 font-medium">{copy.dropHint}</p>
                <p className="mt-1 text-[#8a9282] text-xs">{copy.limitHint}</p>
                <Button type="button" className="mt-4 bg-[#20231e]">
                  {copy.chooseFiles}
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="sr-only"
                  onChange={handleInputChange}
                />
              </div>
            </section>

            <section className="rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{copy.configTitle}</h2>
                  <p className="mt-1 text-[#74796d] text-sm">
                    {copy.configDescription}
                  </p>
                </div>
                <IconWand className="size-5 text-[#d83b01]" />
              </div>

              <div className="mt-4 grid gap-3">
                <FieldSelect
                  label={copy.mode}
                  value={mode}
                  options={OUTPUT_MODES}
                  renderOption={(value) => copy.modes[value]}
                  onChange={(value) => setMode(value as OutputMode)}
                />
                <FieldSelect
                  label={copy.language}
                  value={targetLanguage}
                  options={TARGET_LANGUAGES}
                  renderOption={(value) => value}
                  onChange={setTargetLanguage}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FieldSelect
                    label={copy.ratio}
                    value={aspectRatio}
                    options={ASPECT_RATIOS}
                    renderOption={(value) => value}
                    onChange={(value) => setAspectRatio(value as AspectRatio)}
                  />
                  <FieldSelect
                    label={copy.resolution}
                    value={resolution}
                    options={RESOLUTIONS}
                    renderOption={(value) => `${value}px`}
                    onChange={(value) => setResolution(value as Resolution)}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="font-medium text-sm"
                    htmlFor="batch-shared-prompt"
                  >
                    {copy.prompt}
                  </label>
                  <Textarea
                    id="batch-shared-prompt"
                    value={prompt}
                    placeholder={copy.promptPlaceholder}
                    className="min-h-28 resize-none bg-[#fbfcf7]"
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                </div>
                <p className="rounded-md bg-[#f7f8f4] px-3 py-2 text-[#5f665b] text-xs leading-5">
                  {copy.modeHints[mode]}
                </p>
              </div>
            </section>
          </div>
        </aside>

        <section className="min-w-0 p-4 md:p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-3xl tracking-tight">
                  {copy.gridTitle}
                </h2>
                <Badge variant="outline">
                  {tasks.length}/{MAX_IMAGES} {copy.selected}
                </Badge>
              </div>
              <p className="mt-2 text-[#6d7468]">{copy.gridDescription}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-md border border-[#dfe3d8] bg-white px-3 py-2 text-sm">
                {copy.credits}: <strong>{creditEstimate}</strong>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={failedCount === 0 || runningCount > 0}
                onClick={retryFailed}
              >
                <IconRefresh className="size-4" />
                {copy.retry}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!hasTasks || runningCount > 0}
                onClick={clearTasks}
              >
                <IconTrash className="size-4" />
                {copy.clear}
              </Button>
              <Button
                type="button"
                className="bg-[#20231e]"
                disabled={!canStart}
                onClick={startBatch}
              >
                <IconPlayerPlay className="size-4" />
                {copy.start}
              </Button>
            </div>
          </div>

          {hasTasks ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {tasks.map((task) => (
                <button
                  type="button"
                  key={task.id}
                  className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedTask?.id === task.id
                      ? 'border-[#2f5f4f] ring-2 ring-[#2f5f4f]/15'
                      : 'border-[#dfe3d8]'
                  }`}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1e8]">
                    <img
                      src={task.resultDataUrl ?? task.sourceDataUrl}
                      alt={task.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-2 left-2">
                      <StatusBadge status={task.status} copy={copy} />
                    </div>
                    {task.status === 'processing' ? (
                      <div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-white/70">
                        <div
                          className="h-full rounded-full bg-[#d83b01]"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 font-medium text-sm">
                        {task.name}
                      </p>
                      <button
                        type="button"
                        className="rounded-md p-1 text-[#8a9282] hover:bg-[#f2f4ed] hover:text-[#20231e]"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeTask(task.id);
                        }}
                        aria-label={copy.remove}
                      >
                        <IconX className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-[#7c8476] text-xs">
                      {formatFileSize(task.size)} · {aspectRatio} · {resolution}
                      px
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-[#cbd2c3] bg-white">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#edf5ef] text-[#2f5f4f]">
                  <IconCloudUpload className="size-7" />
                </div>
                <h3 className="mt-4 font-semibold text-xl">
                  {copy.emptyTitle}
                </h3>
                <p className="mt-2 text-[#74796d] text-sm leading-6">
                  {copy.emptyDescription}
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="border-[#dfe3d8] border-t bg-[#fbfcf7] p-4 lg:border-t-0 lg:border-l">
          <section className="rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{copy.inspectorTitle}</h2>
              <IconSparkles className="size-5 text-[#2f5f4f]" />
            </div>
            {selectedTask ? (
              <div className="mt-4">
                <div className="overflow-hidden rounded-lg border border-[#dfe3d8] bg-[#f7f8f4]">
                  <img
                    src={
                      selectedTask.resultDataUrl ?? selectedTask.sourceDataUrl
                    }
                    alt={selectedTask.name}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {selectedTask.name}
                    </p>
                    <p className="text-[#74796d] text-sm">
                      {formatFileSize(selectedTask.size)}
                    </p>
                  </div>
                  <StatusBadge status={selectedTask.status} copy={copy} />
                </div>
                <dl className="mt-4 grid gap-2 text-sm">
                  <InspectorRow label={copy.mode} value={copy.modes[mode]} />
                  <InspectorRow label={copy.language} value={targetLanguage} />
                  <InspectorRow label={copy.ratio} value={aspectRatio} />
                  <InspectorRow
                    label={copy.resolution}
                    value={`${resolution}px`}
                  />
                </dl>
                <Button
                  type="button"
                  className="mt-4 w-full bg-[#d83b01]"
                  disabled={selectedTask.status !== 'completed'}
                  onClick={downloadSelectedTask}
                >
                  <IconDownload className="size-4" />
                  {copy.download}
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-[#74796d] text-sm">{copy.noSelection}</p>
            )}
          </section>

          <section className="mt-4 rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{copy.historyTitle}</h2>
              <IconHistory className="size-5 text-[#2f5f4f]" />
            </div>
            <div className="mt-4 space-y-2">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-[#e5e8df] bg-[#fbfcf7] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{item.name}</p>
                      <Badge variant="outline">{copy.modes[item.mode]}</Badge>
                    </div>
                    <p className="mt-2 text-[#74796d] text-xs">
                      {item.completed}/{item.total} {copy.completed} ·{' '}
                      {item.failed} {copy.failed}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#74796d] text-sm">{copy.resultPlan}</p>
              )}
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[#d4eadb] bg-[#edf7ef] p-4 text-[#43634b] text-sm leading-6">
            <IconCheck className="mb-2 size-5" />
            {completedCount} {copy.completed} · {failedCount} {copy.failed} ·{' '}
            {runningCount} {copy.processing}
          </section>
        </aside>
      </section>
    </main>
  );
}

function FieldSelect({
  label,
  value,
  options,
  renderOption,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  renderOption: (value: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="font-medium text-sm">{label}</span>
      <Select value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger className="w-full bg-[#fbfcf7]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {renderOption(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatusBadge({
  status,
  copy,
}: {
  status: BatchTaskStatus;
  copy: (typeof COPY)[BatchGeneratorLocale];
}) {
  const label: Record<BatchTaskStatus, string> = {
    uploaded: copy.ready,
    queued: copy.queued,
    processing: copy.processing,
    completed: copy.completed,
    failed: copy.failed,
  };
  const className: Record<BatchTaskStatus, string> = {
    uploaded: 'border-[#cbd2c3] bg-white text-[#5f665b]',
    queued: 'border-[#dfe3d8] bg-[#f7f8f4] text-[#5f665b]',
    processing: 'border-[#f3c49f] bg-[#fff4ec] text-[#b73700]',
    completed: 'border-[#bfe4c9] bg-[#edf7ef] text-[#2f5f4f]',
    failed: 'border-[#f0b4b4] bg-[#fff0f0] text-[#b42318]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 font-medium text-xs ${className[status]}`}
    >
      {label[status]}
    </span>
  );
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-[#eef1e8] border-b py-2 last:border-b-0">
      <dt className="text-[#74796d]">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function makeTaskId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
