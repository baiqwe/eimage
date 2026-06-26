import {
  createGenerationBatch,
  getGenerationTaskStatuses,
} from '@/api/generation';
import { authClient } from '@/auth/client';
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
import {
  useGenerationBatches,
  useGenerationBatchDetail,
  useGenerationCredits,
} from '@/hooks/use-generation-history';
import { downloadFile } from '@/lib/download';
import { estimateTaskCreditCost } from '@/lib/product-generation';
import { KIE_MODELS, type KieModelId } from '@/lib/kie-models';
import { Routes } from '@/lib/routes';
import {
  IconArrowLeft,
  IconCheck,
  IconCloudUpload,
  IconDownload,
  IconEye,
  IconHistory,
  IconPhotoScan,
  IconPlayerPlay,
  IconRefresh,
  IconSparkles,
  IconTrash,
  IconWand,
  IconX,
  IconPackageExport,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

type BatchGeneratorLocale = 'zh' | 'en' | 'ja' | 'ko' | 'es';
type KieAspectRatio = (typeof KIE_MODELS)[number]['aspectRatios'][number];
type KieResolution = (typeof KIE_MODELS)[number]['resolutions'][number];
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
  serverTaskId?: string;
  providerTaskId?: string | null;
  status: BatchTaskStatus;
  progress: number;
  error?: string;
}

const MAX_IMAGES = 30;
const MAX_SIZE_MB = 12;

const TARGET_LANGUAGES = [
  'English',
  'Chinese',
  'Japanese',
  'Korean',
  'Spanish',
];
const LOCALE_TARGET_LANGUAGE: Record<BatchGeneratorLocale, string> = {
  zh: 'Chinese',
  en: 'English',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
};
const DEFAULT_MODEL = KIE_MODELS[0]?.id ?? 'gpt-image-2-image-to-image';
const DEFAULT_MODEL_CONFIG = KIE_MODELS[0];

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
    model: string;
    language: string;
    ratio: string;
    resolution: string;
    parameterHint: string;
    sourcePanel: string;
    resultsPanel: string;
    batchDownload: string;
    preview: string;
    historyDetail: string;
    taskTime: string;
    taskCredits: string;
    promptLabel: string;
    refunded: string;
    notRefunded: string;
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
    login: string;
    refreshCredits: string;
    ready: string;
    queued: string;
    processing: string;
    completed: string;
    failed: string;
    download: string;
    remove: string;
    noSelection: string;
    localOnly: string;
    authRequired: string;
    submitting: string;
    polling: string;
    apiError: string;
    insufficientCredits: (required: number, available: number) => string;
    resultPlan: string;
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
    limitHint: 'JPG、PNG、WebP；提交后会按图片拆成多个 Kie 任务。',
    configTitle: '共享配置',
    configDescription: '所有图片共用一套生成意图，生成时每张图仍是独立任务。',
    model: '生图模型',
    language: '目标语言',
    ratio: '尺寸比例',
    resolution: '分辨率',
    parameterHint: '参数会根据所选 Kie 模型自动切换。',
    sourcePanel: '上传原图',
    resultsPanel: '生成结果',
    batchDownload: '下载 ZIP',
    preview: '预览',
    historyDetail: '批次任务详情',
    taskTime: '时间',
    taskCredits: '点数',
    promptLabel: 'Prompt',
    refunded: '失败已退回',
    notRefunded: '已消耗/处理中',
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
    login: '登录',
    refreshCredits: '刷新点数',
    ready: '已上传',
    queued: '排队中',
    processing: '处理中',
    completed: '已完成',
    failed: '失败',
    download: '下载结果',
    remove: '移除',
    noSelection: '选择一张图片查看详情',
    localOnly: '批量任务会提交到 Kie，每张图片都是独立任务。',
    authRequired: '请先登录后再提交批量任务。',
    submitting: '正在提交批量任务...',
    polling: '任务已提交到 Kie，正在轮询生成结果。',
    apiError: '批量任务提交失败。',
    insufficientCredits: (required, available) =>
      `点数不足：需要 ${required} 点，当前 ${available} 点。`,
    resultPlan:
      '多张结果建议用“批次总览 + 单图检查器”：中间保留密集网格，右侧展示当前图片的大图、状态、下载和错误信息；历史批次作为轻量抽屉或侧栏，不抢占主画布。',
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
    limitHint: 'JPG, PNG, or WebP. Each image becomes a Kie task.',
    configTitle: 'Shared config',
    configDescription:
      'One intent for the whole batch; one independent task per image.',
    model: 'Generation model',
    language: 'Target language',
    ratio: 'Aspect ratio',
    resolution: 'Resolution',
    parameterHint:
      'Parameters switch automatically from the selected Kie model.',
    sourcePanel: 'Source images',
    resultsPanel: 'Generated results',
    batchDownload: 'Download ZIP',
    preview: 'Preview',
    historyDetail: 'Batch task detail',
    taskTime: 'Time',
    taskCredits: 'Credits',
    promptLabel: 'Prompt',
    refunded: 'Failed and refunded',
    notRefunded: 'Spent / running',
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
    login: 'Log in',
    refreshCredits: 'Refresh credits',
    ready: 'Uploaded',
    queued: 'Queued',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    download: 'Download result',
    remove: 'Remove',
    noSelection: 'Select an image to inspect it',
    localOnly: 'Batch runs on Kie. Every image is submitted as one task.',
    authRequired: 'Please log in before submitting a batch.',
    submitting: 'Submitting batch tasks...',
    polling: 'Tasks submitted to Kie. Polling generated results.',
    apiError: 'Batch submission failed.',
    insufficientCredits: (required, available) =>
      `Insufficient credits: ${required} required, ${available} available.`,
    resultPlan:
      'For many outputs, use a batch overview plus single-image inspector: keep a dense grid in the center, show the selected result, status, download, and errors on the right, and keep history as a lightweight side panel.',
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
    limitHint: 'JPG、PNG、WebP。送信後は画像ごとに Kie タスクになります。',
    configTitle: '共有設定',
    configDescription: 'バッチ全体で 1 つの意図を使い、画像ごとに処理します。',
    model: '生成モデル',
    language: '対象言語',
    ratio: '比率',
    resolution: '解像度',
    parameterHint: '選択した Kie モデルに合わせてパラメータが切り替わります。',
    sourcePanel: '元画像',
    resultsPanel: '生成結果',
    batchDownload: 'ZIP 保存',
    preview: 'プレビュー',
    historyDetail: 'バッチタスク詳細',
    taskTime: '時間',
    taskCredits: 'クレジット',
    promptLabel: 'Prompt',
    refunded: '失敗・返却済み',
    notRefunded: '消費済み/処理中',
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
    login: 'ログイン',
    refreshCredits: 'クレジット更新',
    ready: 'アップロード済み',
    queued: '待機中',
    processing: '処理中',
    completed: '完了',
    failed: '失敗',
    download: '結果を保存',
    remove: '削除',
    noSelection: '画像を選択して詳細を確認',
    localOnly: 'バッチは Kie に送信され、各画像は独立タスクになります。',
    authRequired: 'バッチ送信前にログインしてください。',
    submitting: 'バッチタスクを送信中...',
    polling: 'Kie にタスクを送信しました。結果を確認しています。',
    apiError: 'バッチ送信に失敗しました。',
    insufficientCredits: (required, available) =>
      `クレジット不足：必要 ${required}、現在 ${available}。`,
    resultPlan:
      '多数の結果は「バッチ一覧 + 単画像インスペクター」が適しています。中央に密なグリッド、右側に選択画像、状態、保存、エラーを表示し、履歴は軽いサイドパネルにします。',
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
    limitHint: 'JPG, PNG, WebP. 제출 후 이미지는 각각 Kie 작업이 됩니다.',
    configTitle: '공유 설정',
    configDescription:
      '배치 전체에 하나의 의도를 쓰고 이미지는 각각 처리합니다.',
    model: '생성 모델',
    language: '대상 언어',
    ratio: '비율',
    resolution: '해상도',
    parameterHint: '선택한 Kie 모델에 따라 파라미터가 자동 전환됩니다.',
    sourcePanel: '원본 이미지',
    resultsPanel: '생성 결과',
    batchDownload: 'ZIP 다운로드',
    preview: '미리보기',
    historyDetail: '배치 작업 상세',
    taskTime: '시간',
    taskCredits: '크레딧',
    promptLabel: 'Prompt',
    refunded: '실패 환불됨',
    notRefunded: '사용됨/처리 중',
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
    login: '로그인',
    refreshCredits: '크레딧 새로고침',
    ready: '업로드됨',
    queued: '대기 중',
    processing: '처리 중',
    completed: '완료',
    failed: '실패',
    download: '결과 다운로드',
    remove: '삭제',
    noSelection: '이미지를 선택해 상세 확인',
    localOnly: '배치는 Kie로 제출되며 각 이미지는 독립 작업입니다.',
    authRequired: '배치 제출 전에 로그인해 주세요.',
    submitting: '배치 작업 제출 중...',
    polling: 'Kie에 작업을 제출했습니다. 결과를 확인 중입니다.',
    apiError: '배치 제출에 실패했습니다.',
    insufficientCredits: (required, available) =>
      `크레딧 부족: ${required} 필요, 현재 ${available}.`,
    resultPlan:
      '여러 결과는 배치 개요와 단일 이미지 검사기 조합이 적합합니다. 중앙은 촘촘한 그리드, 오른쪽은 선택 이미지와 상태, 다운로드, 오류를 표시하고 히스토리는 가벼운 사이드 패널로 둡니다.',
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
    limitHint: 'JPG, PNG o WebP. Cada imagen se envia como tarea Kie.',
    configTitle: 'Configuracion compartida',
    configDescription:
      'Una intencion para todo el lote; una tarea independiente por imagen.',
    model: 'Modelo de generacion',
    language: 'Idioma objetivo',
    ratio: 'Proporcion',
    resolution: 'Resolucion',
    parameterHint: 'Los parametros cambian segun el modelo Kie seleccionado.',
    sourcePanel: 'Imagenes fuente',
    resultsPanel: 'Resultados',
    batchDownload: 'Descargar ZIP',
    preview: 'Vista previa',
    historyDetail: 'Detalle de tareas',
    taskTime: 'Hora',
    taskCredits: 'Creditos',
    promptLabel: 'Prompt',
    refunded: 'Fallida y reembolsada',
    notRefunded: 'Consumida / en curso',
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
    login: 'Iniciar sesion',
    refreshCredits: 'Actualizar creditos',
    ready: 'Subida',
    queued: 'En cola',
    processing: 'Procesando',
    completed: 'Completada',
    failed: 'Fallida',
    download: 'Descargar resultado',
    remove: 'Eliminar',
    noSelection: 'Selecciona una imagen para revisarla',
    localOnly:
      'El lote se envia a Kie. Cada imagen es una tarea independiente.',
    authRequired: 'Inicia sesion antes de enviar el lote.',
    submitting: 'Enviando tareas del lote...',
    polling: 'Tareas enviadas a Kie. Consultando resultados.',
    apiError: 'No se pudo enviar el lote.',
    insufficientCredits: (required, available) =>
      `Creditos insuficientes: requiere ${required}, tienes ${available}.`,
    resultPlan:
      'Para muchos resultados conviene una vista de lote y un inspector: grid denso al centro, resultado seleccionado, estado, descarga y errores a la derecha, e historial como panel ligero.',
  },
};

export function BatchGeneratorWorkbench({
  locale = 'en',
}: {
  locale?: BatchGeneratorLocale;
}) {
  const copy = COPY[locale];
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const signedIn = !!session?.user;
  const creditQuery = useGenerationCredits();
  const historyQuery = useGenerationBatches(0, 5);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<BatchImageTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [model, setModel] = useState<KieModelId>(DEFAULT_MODEL as KieModelId);
  const [selectedHistoryBatchId, setSelectedHistoryBatchId] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(
    LOCALE_TARGET_LANGUAGE[locale]
  );
  const modelConfig =
    KIE_MODELS.find((item) => item.id === model) ?? DEFAULT_MODEL_CONFIG;
  const [aspectRatio, setAspectRatio] = useState<KieAspectRatio>(
    DEFAULT_MODEL_CONFIG.aspectRatios[0]
  );
  const [resolution, setResolution] = useState<KieResolution>(
    DEFAULT_MODEL_CONFIG.resolutions[0]
  );
  const [prompt, setPrompt] = useState('');
  const [credits, setCredits] = useState(creditQuery.data?.balance ?? 0);
  const [batchNotice, setBatchNotice] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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
    () => tasks.length * estimateTaskCreditCost({ resolution }),
    [resolution, tasks.length]
  );
  const historyDetailQuery = useGenerationBatchDetail(
    selectedHistoryBatchId || historyQuery.data?.items[0]?.id
  );
  const hasTasks = tasks.length > 0;
  const canStart = hasTasks && runningCount === 0;

  useEffect(() => {
    if (creditQuery.data) {
      setCredits(creditQuery.data.balance);
    }
  }, [creditQuery.data]);

  useEffect(() => {
    const nextConfig =
      KIE_MODELS.find((item) => item.id === model) ?? DEFAULT_MODEL_CONFIG;
    if (!(nextConfig.aspectRatios as readonly string[]).includes(aspectRatio)) {
      setAspectRatio(nextConfig.aspectRatios[0]);
    }
    if (!(nextConfig.resolutions as readonly string[]).includes(resolution)) {
      setResolution(nextConfig.resolutions[0]);
    }
  }, [aspectRatio, model, resolution]);

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
    setTasks([]);
    setSelectedTaskId('');
    setBatchNotice('');
  }

  async function startBatch() {
    if (!canStart) return;
    if (!signedIn) {
      setBatchNotice(copy.authRequired);
      return;
    }
    if (credits < creditEstimate) {
      setBatchNotice(copy.insufficientCredits(creditEstimate, credits));
      return;
    }

    setTasks((current) =>
      current.map((task) => ({
        ...task,
        status: 'queued',
        progress: 8,
        error: undefined,
        resultDataUrl: undefined,
      }))
    );
    setBatchNotice(copy.submitting);

    try {
      const sourceImage = tasks[0];
      const plannedTasks = tasks.map((task) => ({
        id: task.id,
        kind: 'detail' as const,
        style: modelConfig.label,
        aspectRatio,
        resolution,
        model,
        prompt: buildBatchPrompt({
          prompt,
          modelLabel: modelConfig.label,
          targetLanguage,
          aspectRatio,
          resolution,
        }),
        referenceImageDataUrl:
          task.id === sourceImage.id ? undefined : task.sourceDataUrl,
        referenceName: task.name,
      }));

      const batch = await createGenerationBatch({
        data: {
          locale,
          productDescription:
            prompt.trim() ||
            `${modelConfig.label} batch image edit for ${tasks.length} product images`,
          sourceImageDataUrl: sourceImage.sourceDataUrl,
          sourceName: sourceImage.name,
          tasks: plannedTasks,
        },
      });

      if (!batch.ok) {
        setCredits(batch.availableCredits);
        setBatchNotice(
          copy.insufficientCredits(
            batch.requiredCredits,
            batch.availableCredits
          )
        );
        setTasks((current) =>
          current.map((task) => ({ ...task, status: 'uploaded', progress: 0 }))
        );
        return;
      }

      setCredits(batch.balance);
      setBatchNotice(copy.polling);
      void historyQuery.refetch();

      setTasks((current) =>
        current.map((task) => {
          const submitted = batch.tasks.find((item) => item.id === task.id);
          if (!submitted) return task;
          return {
            ...task,
            serverTaskId: submitted.taskId,
            providerTaskId: submitted.providerTaskId,
            status: submitted.status === 'failed' ? 'failed' : 'processing',
            progress: submitted.status === 'failed' ? 100 : 24,
            error: submitted.errorMessage,
          };
        })
      );

      await pollGenerationTasks(
        batch.tasks.map((task) => task.taskId),
        new Map(batch.tasks.map((task) => [task.taskId, task.id]))
      );
      void historyQuery.refetch();
      void creditQuery.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.apiError;
      setBatchNotice(message);
      setTasks((current) =>
        current.map((task) =>
          ['queued', 'processing'].includes(task.status)
            ? { ...task, status: 'failed', progress: 100, error: message }
            : task
        )
      );
    }
  }

  async function pollGenerationTasks(
    serverTaskIds: string[],
    clientTaskByServerTask: Map<string, string>
  ) {
    const pending = new Set(serverTaskIds);
    for (let attempt = 0; attempt < 90 && pending.size > 0; attempt += 1) {
      await wait(attempt === 0 ? 1200 : 2500);
      const result = await getGenerationTaskStatuses({
        data: { taskIds: Array.from(pending) },
      });
      setCredits(result.balance);
      for (const status of result.statuses) {
        const clientTaskId = clientTaskByServerTask.get(status.id);
        if (!clientTaskId) continue;
        if (status.status === 'completed' && status.imageUrl) {
          pending.delete(status.id);
          setTasks((current) =>
            current.map((task) =>
              task.id === clientTaskId
                ? {
                    ...task,
                    status: 'completed',
                    progress: 100,
                    resultDataUrl: status.imageUrl,
                    error: undefined,
                  }
                : task
            )
          );
        } else if (status.status === 'failed') {
          pending.delete(status.id);
          setTasks((current) =>
            current.map((task) =>
              task.id === clientTaskId
                ? {
                    ...task,
                    status: 'failed',
                    progress: 100,
                    error: status.errorMessage ?? copy.apiError,
                  }
                : task
            )
          );
        } else {
          setTasks((current) =>
            current.map((task) =>
              task.id === clientTaskId
                ? { ...task, status: 'processing', progress: 56 }
                : task
            )
          );
        }
      }
    }
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
    if (!selectedTask?.resultDataUrl) return;
    void downloadFile(
      selectedTask.resultDataUrl,
      `prodlist-${selectedTask.name}`
    );
  }

  async function downloadCompletedZip() {
    const completedTasks = tasks.filter((task) => task.resultDataUrl);
    if (completedTasks.length === 0) return;
    const files = await Promise.all(
      completedTasks.map(async (task, index) => ({
        name: `${String(index + 1).padStart(2, '0')}-${sanitizeFilename(
          task.name
        )}`,
        blob: await fetchImageBlob(task.resultDataUrl!),
      }))
    );
    const zipBlob = await createZipFromFiles(files);
    const url = URL.createObjectURL(zipBlob);
    await downloadFile(url, `prodlist-batch-${Date.now()}.zip`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
          <div className="flex items-center gap-2">
            {!sessionPending && !signedIn ? (
              <Button
                type="button"
                className="bg-[#20231e]"
                render={<Link to={Routes.Login} />}
              >
                {copy.login}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="hidden bg-white md:inline-flex"
              disabled={!signedIn || creditQuery.isFetching}
              onClick={() => void creditQuery.refetch()}
            >
              <IconRefresh className="size-4" />
              {copy.refreshCredits}
            </Button>
            <div className="rounded-lg border border-[#dfe3d8] bg-white px-3 py-2 text-sm shadow-sm">
              {copy.credits}: <strong>{credits}</strong>
            </div>
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
                  label={copy.model}
                  value={model}
                  options={KIE_MODELS.map((item) => item.id)}
                  renderOption={(value) =>
                    KIE_MODELS.find((item) => item.id === value)?.label ?? value
                  }
                  onChange={(value) => setModel(value as KieModelId)}
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
                    options={modelConfig.aspectRatios}
                    renderOption={(value) => value}
                    onChange={(value) =>
                      setAspectRatio(value as KieAspectRatio)
                    }
                  />
                  <FieldSelect
                    label={copy.resolution}
                    value={resolution}
                    options={modelConfig.resolutions}
                    renderOption={(value) =>
                      `${value} · ${modelConfig.resolutionLabel}`
                    }
                    onChange={(value) => setResolution(value as KieResolution)}
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
                  {copy.parameterHint}
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
              {batchNotice ? (
                <p className="mt-2 rounded-md border border-[#eadfca] bg-[#fff8ea] px-3 py-2 text-[#8a5a16] text-sm">
                  {batchNotice}
                </p>
              ) : null}
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
                variant="outline"
                disabled={completedCount === 0}
                onClick={() => void downloadCompletedZip()}
              >
                <IconPackageExport className="size-4" />
                {copy.batchDownload}
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
            <div className="space-y-6">
              <AssetGridSection
                title={copy.sourcePanel}
                tasks={tasks}
                selectedTaskId={selectedTask?.id}
                imageKind="source"
                copy={copy}
                aspectRatio={aspectRatio}
                resolution={resolution}
                onSelect={setSelectedTaskId}
                onRemove={removeTask}
              />
              <AssetGridSection
                title={copy.resultsPanel}
                tasks={tasks}
                selectedTaskId={selectedTask?.id}
                imageKind="result"
                copy={copy}
                aspectRatio={aspectRatio}
                resolution={resolution}
                onSelect={setSelectedTaskId}
                onRemove={removeTask}
              />
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
                <div className="grid gap-3">
                  <div>
                    <p className="mb-2 font-medium text-[#74796d] text-xs">
                      {copy.sourcePanel}
                    </p>
                    <div className="overflow-hidden rounded-lg border border-[#dfe3d8] bg-[#f7f8f4]">
                      <img
                        src={selectedTask.sourceDataUrl}
                        alt={selectedTask.name}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-[#74796d] text-xs">
                      {copy.resultsPanel}
                    </p>
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[#dfe3d8] bg-[#f7f8f4]">
                      {selectedTask.resultDataUrl ? (
                        <img
                          src={selectedTask.resultDataUrl}
                          alt={selectedTask.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <StatusBadge status={selectedTask.status} copy={copy} />
                      )}
                    </div>
                  </div>
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
                  <InspectorRow
                    label={copy.model}
                    value={
                      KIE_MODELS.find((item) => item.id === model)?.label ??
                      model
                    }
                  />
                  <InspectorRow label={copy.language} value={targetLanguage} />
                  <InspectorRow label={copy.ratio} value={aspectRatio} />
                  <InspectorRow
                    label={copy.resolution}
                    value={`${resolution} · ${modelConfig.resolutionLabel}`}
                  />
                  {selectedTask.providerTaskId ? (
                    <InspectorRow
                      label="Kie"
                      value={selectedTask.providerTaskId.slice(0, 14)}
                    />
                  ) : null}
                </dl>
                {selectedTask.error ? (
                  <p className="mt-3 rounded-md border border-[#f0b4b4] bg-[#fff0f0] px-3 py-2 text-[#b42318] text-sm">
                    {selectedTask.error}
                  </p>
                ) : null}
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
              {signedIn && historyQuery.data?.items.length ? (
                historyQuery.data.items.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`w-full rounded-md border p-3 text-left ${
                      (
                        selectedHistoryBatchId ||
                          historyQuery.data?.items[0]?.id
                      ) === item.id
                        ? 'border-[#2f5f4f] bg-[#edf7ef]'
                        : 'border-[#e5e8df] bg-[#fbfcf7]'
                    }`}
                    onClick={() => setSelectedHistoryBatchId(item.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-[#74796d] text-xs">
                      {item.completedTaskCount}/{item.taskCount}{' '}
                      {copy.completed} · {item.failedTaskCount} {copy.failed}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-[#74796d] text-sm">{copy.resultPlan}</p>
              )}
            </div>
          </section>

          {historyDetailQuery.data ? (
            <section className="mt-4 rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
              <h2 className="font-semibold">{copy.historyDetail}</h2>
              <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {historyDetailQuery.data.tasks.map((task) => {
                  const output = historyDetailQuery.data.outputs.find(
                    (item) => item.taskId === task.id
                  );
                  return (
                    <article
                      key={task.id}
                      className="rounded-md border border-[#e5e8df] bg-[#fbfcf7] p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge
                          status={toBatchTaskStatus(task.status)}
                          copy={copy}
                        />
                        <span className="text-[#74796d] text-xs">
                          {copy.taskCredits}: {task.creditCost} ·{' '}
                          {task.status === 'failed'
                            ? copy.refunded
                            : copy.notRefunded}
                        </span>
                      </div>
                      <p className="mt-2 text-[#74796d] text-xs">
                        {copy.taskTime}:{' '}
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2 line-clamp-3 text-[#5f665b] text-xs">
                        {copy.promptLabel}: {task.prompt}
                      </p>
                      {output?.publicUrl ? (
                        <div className="mt-3 flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              window.open(
                                output.publicUrl ?? '',
                                '_blank',
                                'noopener,noreferrer'
                              )
                            }
                          >
                            <IconEye className="size-4" />
                            {copy.preview}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="flex-1 bg-[#d83b01]"
                            onClick={() =>
                              void downloadFile(
                                output.publicUrl ?? '',
                                `prodlist-${task.id}.png`
                              )
                            }
                          >
                            <IconDownload className="size-4" />
                            {copy.download}
                          </Button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

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

function AssetGridSection({
  title,
  tasks,
  selectedTaskId,
  imageKind,
  copy,
  aspectRatio,
  resolution,
  onSelect,
  onRemove,
}: {
  title: string;
  tasks: BatchImageTask[];
  selectedTaskId?: string;
  imageKind: 'source' | 'result';
  copy: (typeof COPY)[BatchGeneratorLocale];
  aspectRatio: string;
  resolution: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 font-semibold text-xl">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {tasks.map((task) => {
          const imageUrl =
            imageKind === 'source' ? task.sourceDataUrl : task.resultDataUrl;
          return (
            <article
              key={`${imageKind}-${task.id}`}
              className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                selectedTaskId === task.id
                  ? 'border-[#2f5f4f] ring-2 ring-[#2f5f4f]/15'
                  : 'border-[#dfe3d8]'
              }`}
            >
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => onSelect(task.id)}
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#eef1e8]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={task.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="text-center text-[#74796d] text-sm">
                      <StatusBadge status={task.status} copy={copy} />
                    </div>
                  )}
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
              </button>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => onSelect(task.id)}
                  >
                    <p className="line-clamp-1 font-medium text-sm">
                      {task.name}
                    </p>
                  </button>
                  {imageKind === 'source' ? (
                    <button
                      type="button"
                      className="rounded-md p-1 text-[#8a9282] hover:bg-[#f2f4ed] hover:text-[#20231e]"
                      onClick={() => onRemove(task.id)}
                      aria-label={copy.remove}
                    >
                      <IconX className="size-4" />
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="mt-1 text-left text-[#7c8476] text-xs"
                  onClick={() => onSelect(task.id)}
                >
                  {formatFileSize(task.size)} · {aspectRatio} · {resolution}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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

function buildBatchPrompt({
  prompt,
  modelLabel,
  targetLanguage,
  aspectRatio,
  resolution,
}: {
  prompt: string;
  modelLabel: string;
  targetLanguage: string;
  aspectRatio: string;
  resolution: string;
}) {
  const instruction = prompt.trim()
    ? prompt.trim()
    : 'Create a polished ecommerce product image from the uploaded source.';
  return [
    'Use the uploaded image as the immutable source image.',
    `Generation model: ${modelLabel}.`,
    `Target language: ${targetLanguage}.`,
    `Kie aspect ratio: ${aspectRatio}. Kie quality/resolution: ${resolution}.`,
    instruction,
    'Preserve the exact product identity, geometry, material, logos, labels, and visible structure unless the user explicitly asks to translate visible text.',
    'Do not invent extra products. Do not change the product category. Keep the result suitable for ecommerce listing use.',
  ].join(' ');
}

function toBatchTaskStatus(status: string): BatchTaskStatus {
  if (status === 'completed') return 'completed';
  if (status === 'failed' || status === 'cancelled') return 'failed';
  if (status === 'running') return 'processing';
  if (status === 'queued') return 'queued';
  return 'uploaded';
}

async function fetchImageBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return response.blob();
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'image.png';
}

async function createZipFromFiles(files: Array<{ name: string; blob: Blob }>) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const crc = crc32(data);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const local = new DataView(localHeader.buffer);
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0, true);
    local.setUint16(8, 0, true);
    local.setUint16(10, 0, true);
    local.setUint16(12, 0, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    localHeader.set(nameBytes, 30);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const central = new DataView(centralHeader.buffer);
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, 0, true);
    central.setUint16(14, 0, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, data.length, true);
    central.setUint32(24, data.length, true);
    central.setUint16(28, nameBytes.length, true);
    central.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    chunks.push(localHeader, data);
    centralDirectory.push(centralHeader);
    offset += localHeader.length + data.length;
  }

  const centralOffset = offset;
  const centralSize = centralDirectory.reduce(
    (sum, item) => sum + item.length,
    0
  );
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);

  return new Blob([...chunks, ...centralDirectory, end], {
    type: 'application/zip',
  });
}

function crc32(data: Uint8Array) {
  let crc = -1;
  for (const byte of data) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const CRC_TABLE = Array.from({ length: 256 }, (_unused, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
