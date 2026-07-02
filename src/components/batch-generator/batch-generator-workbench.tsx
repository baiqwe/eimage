import {
  createGenerationBatch,
  getGenerationTaskStatuses,
} from '@/api/generation';
import { authClient } from '@/auth/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GeneratorWorkbenchHeader } from '@/components/generator/generator-workbench-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGenerationCredits } from '@/hooks/use-generation-history';
import { downloadFile } from '@/lib/download';
import {
  clearGeneratorSession,
  loadGeneratorSession,
  saveGeneratorSession,
} from '@/lib/generator-session';
import {
  KIE_MODELS,
  type KieModelId,
  getDefaultKieAspectRatio,
  getDefaultKieOutputValue,
  supportsKieOutputParam,
} from '@/lib/kie-models';
import { estimateTaskCreditCost } from '@/lib/product-generation';
import {
  getLocalizedPublicPath,
  useProductLocale,
} from '@/components/product/product-locale';
import type { ProductLocale } from '@/components/product/product-locale';
import {
  IconCloudUpload,
  IconDownload,
  IconEye,
  IconPackageExport,
  IconPhotoScan,
  IconPlayerPlay,
  IconTrash,
  IconWand,
  IconX,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

type BatchGeneratorLocale = 'zh' | 'en' | 'ja' | 'ko' | 'es';
type KieAspectRatio = string;
type KieResolution = string;
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
  sourceDataUrl?: string;
  resultDataUrl?: string;
  serverTaskId?: string;
  providerTaskId?: string | null;
  status: BatchTaskStatus;
  progress: number;
  error?: string;
}

const MAX_IMAGES = 30;
const MAX_SIZE_MB = 12;

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
    ratio: string;
    resolution: string;
    parameterHint: string;
    sourcePreview: string;
    resultsPanel: string;
    batchDownload: string;
    preview: string;
    openDashboard: string;
    resultEmpty: string;
    resultEmptyDescription: string;
    prompt: string;
    promptPlaceholder: string;
    start: string;
    clear: string;
    gridTitle: string;
    gridDescription: string;
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
    localOnly: string;
    authRequired: string;
    submitting: string;
    polling: string;
    apiError: string;
    zipPreparing: string;
    zipReady: string;
    zipFallback: string;
    generatorSet: string;
    batchEditor: string;
    insufficientCredits: (required: number, available: number) => string;
  }
> = {
  zh: {
    back: '返回首页',
    eyebrow: '批量改图工作台',
    title: '多张商品图，一套指令，独立生成结果',
    description:
      '上传多张商品图后，每张图片会独立生成。中间专注预览原图，右侧集中展示生成结果、预览和下载。',
    uploadTitle: '批量上传',
    uploadDescription: '支持 1-30 张商品图，单张不超过 12MB。',
    chooseFiles: '选择图片',
    dropHint: '拖拽图片到这里',
    limitHint: 'JPG、PNG、WebP；提交后会按图片拆成多个独立任务。',
    configTitle: '共享配置',
    configDescription: '所有图片共用一套生成意图，生成时每张图仍是独立任务。',
    model: '生图模型',
    ratio: '尺寸比例',
    resolution: '分辨率',
    parameterHint: '参数会根据所选模型自动切换。',
    sourcePreview: '原图预览',
    resultsPanel: '生成结果',
    batchDownload: '下载 ZIP',
    preview: '预览',
    openDashboard: '查看工作台',
    resultEmpty: '结果会显示在这里',
    resultEmptyDescription:
      '开始生成后，每张图片的结果会以卡片形式出现在右侧。',
    prompt: '统一指令',
    promptPlaceholder:
      '例如：把图片中的文字改成红色主色调，保持产品形状不变，统一为干净的电商主图风格。',
    start: '开始批量任务',
    clear: '清空',
    gridTitle: '原图预览',
    gridDescription: '这里只展示上传的原图，生成结果集中在右侧。',
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
    localOnly: '每张图片都会作为独立任务生成。',
    authRequired: '请先登录后再提交批量任务。',
    submitting: '正在提交批量任务...',
    polling: '任务已提交，正在生成结果。',
    apiError: '批量任务提交失败。',
    zipPreparing: '正在打包 ZIP...',
    zipReady: 'ZIP 已开始下载。',
    zipFallback: 'ZIP 打包失败，请先使用单张下载。',
    generatorSet: '套图生成器',
    batchEditor: '批量生图',
    insufficientCredits: (required, available) =>
      `点数不足：需要 ${required} 点，当前 ${available} 点。`,
  },
  en: {
    back: 'Back home',
    eyebrow: 'Batch image workbench',
    title: 'Many product images, one instruction set, independent outputs',
    description:
      'Upload product images, apply one shared instruction, preview sources in the center, and review generated result cards on the right.',
    uploadTitle: 'Batch upload',
    uploadDescription: 'Upload 1-30 product images, up to 12MB each.',
    chooseFiles: 'Choose images',
    dropHint: 'Drop product images here',
    limitHint: 'JPG, PNG, or WebP. Each image becomes an independent task.',
    configTitle: 'Shared config',
    configDescription:
      'One intent for the whole batch; one independent task per image.',
    model: 'Generation model',
    ratio: 'Aspect ratio',
    resolution: 'Resolution',
    parameterHint: 'Parameters switch automatically from the selected model.',
    sourcePreview: 'Source preview',
    resultsPanel: 'Generated results',
    batchDownload: 'Download ZIP',
    preview: 'Preview',
    openDashboard: 'View dashboard',
    resultEmpty: 'Results will appear here',
    resultEmptyDescription:
      'After generation starts, each finished image will appear as a result card.',
    prompt: 'Shared instruction',
    promptPlaceholder:
      'Example: change the visual text to a red theme, preserve the product shape, and unify the batch as clean ecommerce hero shots.',
    start: 'Start batch',
    clear: 'Clear',
    gridTitle: 'Source preview',
    gridDescription:
      'This area only shows uploaded source images. Results stay on the right.',
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
    localOnly: 'Every image is generated as an independent task.',
    authRequired: 'Please log in before submitting a batch.',
    submitting: 'Submitting batch tasks...',
    polling: 'Tasks submitted. Generating results.',
    apiError: 'Batch submission failed.',
    zipPreparing: 'Preparing ZIP...',
    zipReady: 'ZIP download started.',
    zipFallback: 'ZIP packaging failed. Please use single-image downloads.',
    generatorSet: 'Photo set',
    batchEditor: 'Batch editor',
    insufficientCredits: (required, available) =>
      `Insufficient credits: ${required} required, ${available} available.`,
  },
  ja: {
    back: 'ホームへ戻る',
    eyebrow: '一括画像ワークベンチ',
    title: '複数の商品画像を 1 つの指示で個別に処理',
    description:
      '商品画像をまとめてアップロードし、中央で元画像を確認し、右側で生成結果カードを確認・保存できます。',
    uploadTitle: '一括アップロード',
    uploadDescription: '1-30 枚の商品画像、1 枚 12MB まで対応。',
    chooseFiles: '画像を選択',
    dropHint: '商品画像をここにドロップ',
    limitHint: 'JPG、PNG、WebP。画像ごとに独立タスクとして処理します。',
    configTitle: '共有設定',
    configDescription: 'バッチ全体で 1 つの意図を使い、画像ごとに処理します。',
    model: '生成モデル',
    ratio: '比率',
    resolution: '解像度',
    parameterHint: '選択したモデルに合わせてパラメータが切り替わります。',
    sourcePreview: '元画像プレビュー',
    resultsPanel: '生成結果',
    batchDownload: 'ZIP 保存',
    preview: 'プレビュー',
    openDashboard: 'ダッシュボードを見る',
    resultEmpty: '結果はここに表示されます',
    resultEmptyDescription:
      '生成開始後、完了した画像が結果カードとして表示されます。',
    prompt: '共通指示',
    promptPlaceholder:
      '例：画像内の文字を赤系のトーンに変更し、商品形状を保ち、清潔な EC メイン画像に統一する。',
    start: '一括開始',
    clear: 'クリア',
    gridTitle: '元画像プレビュー',
    gridDescription: 'ここにはアップロードした元画像のみ表示します。',
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
    localOnly: '各画像は独立タスクとして生成されます。',
    authRequired: 'バッチ送信前にログインしてください。',
    submitting: 'バッチタスクを送信中...',
    polling: 'タスクを送信しました。結果を生成しています。',
    apiError: 'バッチ送信に失敗しました。',
    zipPreparing: 'ZIP を準備しています...',
    zipReady: 'ZIP のダウンロードを開始しました。',
    zipFallback: 'ZIP 作成に失敗しました。個別保存を使用してください。',
    generatorSet: 'セット生成',
    batchEditor: '一括編集',
    insufficientCredits: (required, available) =>
      `クレジット不足：必要 ${required}、現在 ${available}。`,
  },
  ko: {
    back: '홈으로',
    eyebrow: '배치 이미지 워크벤치',
    title: '여러 상품 이미지를 하나의 지시로 각각 처리',
    description:
      '여러 상품 이미지를 업로드하고 중앙에서 원본을 확인한 뒤 오른쪽에서 생성 결과 카드를 확인하고 다운로드합니다.',
    uploadTitle: '일괄 업로드',
    uploadDescription: '1-30장, 이미지당 최대 12MB.',
    chooseFiles: '이미지 선택',
    dropHint: '상품 이미지를 여기에 놓기',
    limitHint: 'JPG, PNG, WebP. 이미지는 각각 독립 작업으로 처리됩니다.',
    configTitle: '공유 설정',
    configDescription:
      '배치 전체에 하나의 의도를 쓰고 이미지는 각각 처리합니다.',
    model: '생성 모델',
    ratio: '비율',
    resolution: '해상도',
    parameterHint: '선택한 모델에 따라 파라미터가 자동 전환됩니다.',
    sourcePreview: '원본 미리보기',
    resultsPanel: '생성 결과',
    batchDownload: 'ZIP 다운로드',
    preview: '미리보기',
    openDashboard: '대시보드 보기',
    resultEmpty: '결과가 여기에 표시됩니다',
    resultEmptyDescription:
      '생성을 시작하면 완료된 이미지가 결과 카드로 표시됩니다.',
    prompt: '공통 지시',
    promptPlaceholder:
      '예: 이미지 속 문구를 빨간 톤으로 바꾸고 상품 형태를 유지하며 깔끔한 커머스 대표 이미지로 통일.',
    start: '배치 시작',
    clear: '비우기',
    gridTitle: '원본 미리보기',
    gridDescription: '이 영역에는 업로드한 원본 이미지만 표시됩니다.',
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
    localOnly: '각 이미지는 독립 작업으로 생성됩니다.',
    authRequired: '배치 제출 전에 로그인해 주세요.',
    submitting: '배치 작업 제출 중...',
    polling: '작업을 제출했습니다. 결과를 생성 중입니다.',
    apiError: '배치 제출에 실패했습니다.',
    zipPreparing: 'ZIP 준비 중...',
    zipReady: 'ZIP 다운로드를 시작했습니다.',
    zipFallback: 'ZIP 패키징에 실패했습니다. 개별 다운로드를 사용해 주세요.',
    generatorSet: '세트 생성',
    batchEditor: '배치 편집',
    insufficientCredits: (required, available) =>
      `크레딧 부족: ${required} 필요, 현재 ${available}.`,
  },
  es: {
    back: 'Volver al inicio',
    eyebrow: 'Workbench por lotes',
    title:
      'Muchas imagenes de producto, una instruccion, resultados independientes',
    description:
      'Sube varias imagenes, revisa las fuentes en el centro y descarga los resultados desde tarjetas a la derecha.',
    uploadTitle: 'Carga por lotes',
    uploadDescription: 'Sube de 1 a 30 imagenes, hasta 12MB cada una.',
    chooseFiles: 'Elegir imagenes',
    dropHint: 'Arrastra imagenes aqui',
    limitHint: 'JPG, PNG o WebP. Cada imagen se procesa por separado.',
    configTitle: 'Configuracion compartida',
    configDescription:
      'Una intencion para todo el lote; una tarea independiente por imagen.',
    model: 'Modelo de generacion',
    ratio: 'Proporcion',
    resolution: 'Resolucion',
    parameterHint: 'Los parametros cambian segun el modelo seleccionado.',
    sourcePreview: 'Vista de fuentes',
    resultsPanel: 'Resultados',
    batchDownload: 'Descargar ZIP',
    preview: 'Vista previa',
    openDashboard: 'Ver panel',
    resultEmpty: 'Los resultados apareceran aqui',
    resultEmptyDescription:
      'Al iniciar la generacion, cada imagen completada aparecera como tarjeta.',
    prompt: 'Instruccion comun',
    promptPlaceholder:
      'Ejemplo: cambiar el texto visible a una paleta roja, conservar el producto y unificar el lote como imagenes ecommerce limpias.',
    start: 'Iniciar lote',
    clear: 'Limpiar',
    gridTitle: 'Vista de fuentes',
    gridDescription: 'Esta zona solo muestra las imagenes subidas.',
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
    localOnly: 'Cada imagen se genera como una tarea independiente.',
    authRequired: 'Inicia sesion antes de enviar el lote.',
    submitting: 'Enviando tareas del lote...',
    polling: 'Tareas enviadas. Generando resultados.',
    apiError: 'No se pudo enviar el lote.',
    zipPreparing: 'Preparando ZIP...',
    zipReady: 'La descarga ZIP comenzo.',
    zipFallback:
      'No se pudo crear el ZIP. Usa las descargas individuales por ahora.',
    generatorSet: 'Set de fotos',
    batchEditor: 'Editor por lotes',
    insufficientCredits: (required, available) =>
      `Creditos insuficientes: requiere ${required}, tienes ${available}.`,
  },
};

export function BatchGeneratorWorkbench({
  locale = 'en',
}: {
  locale?: BatchGeneratorLocale;
}) {
  const { locale: currentLocale, setLocale } = useProductLocale(locale);
  const copy = COPY[currentLocale];
  const typedLocale = currentLocale as ProductLocale;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: session } = authClient.useSession();
  const signedIn = !!session?.user;
  const creditQuery = useGenerationCredits();
  const inputRef = useRef<HTMLInputElement>(null);
  const restoredSessionRef = useRef(false);
  const [tasks, setTasks] = useState<BatchImageTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [model, setModel] = useState<KieModelId>(DEFAULT_MODEL as KieModelId);
  const modelConfig =
    KIE_MODELS.find((item) => item.id === model) ?? DEFAULT_MODEL_CONFIG;
  const [aspectRatio, setAspectRatio] = useState<KieAspectRatio>(
    getDefaultKieAspectRatio(DEFAULT_MODEL)
  );
  const [resolution, setResolution] = useState<KieResolution>(
    getDefaultKieOutputValue(DEFAULT_MODEL)
  );
  const [prompt, setPrompt] = useState('');
  const [credits, setCredits] = useState(creditQuery.data?.balance ?? 0);
  const [batchNotice, setBatchNotice] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipDownloading, setZipDownloading] = useState(false);

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
  const hasTasks = tasks.length > 0;
  const hasSubmittedTasks = tasks.some((task) => task.status !== 'uploaded');
  const canStart =
    hasTasks &&
    runningCount === 0 &&
    !hasSubmittedTasks &&
    tasks.every((task) => !!task.sourceDataUrl);

  function handleLocaleChange(next: ProductLocale) {
    setLocale(next);
    const nextPath = getLocalizedPublicPath(pathname, next);
    if (nextPath !== pathname) {
      navigate({ to: nextPath });
    }
  }

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
    if (
      supportsKieOutputParam(nextConfig.id) &&
      !nextConfig.outputParam?.options.includes(resolution)
    ) {
      setResolution(getDefaultKieOutputValue(nextConfig.id));
    }
    if (!supportsKieOutputParam(nextConfig.id) && resolution) {
      setResolution('');
    }
  }, [aspectRatio, model, resolution]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || restoredSessionRef.current || tasks.length > 0) return;
    const saved = loadGeneratorSession('batch', userId);
    if (!saved || saved.tasks.length === 0) return;

    restoredSessionRef.current = true;
    setTasks(
      saved.tasks.map((task) => ({
        id: task.clientId,
        name: task.name,
        size: 0,
        serverTaskId: task.serverTaskId,
        status: 'processing' as const,
        progress: 42,
      }))
    );
    setSelectedTaskId(saved.tasks[0]?.clientId ?? '');
    setBatchNotice(copy.polling);
    void pollGenerationTasks(
      saved.tasks.map((task) => task.serverTaskId),
      new Map(saved.tasks.map((task) => [task.serverTaskId, task.clientId])),
      saved.batchId
    );
  }, [copy.polling, session?.user?.id, tasks.length]);

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
        resolution: supportsKieOutputParam(model) ? resolution : '',
        model,
        prompt: buildBatchPrompt({
          prompt,
          modelLabel: modelConfig.label,
          aspectRatio,
          resolution: supportsKieOutputParam(model) ? resolution : '',
        }),
        referenceImageDataUrl:
          task.id === sourceImage.id ? undefined : task.sourceDataUrl,
        referenceName: task.name,
      }));

      const batch = await createGenerationBatch({
        data: {
          locale: currentLocale,
          productDescription:
            prompt.trim() ||
            `${modelConfig.label} batch image edit for ${tasks.length} product images`,
          sourceImageDataUrl: sourceImage.sourceDataUrl!,
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
      if (session?.user?.id) {
        saveGeneratorSession({
          mode: 'batch',
          userId: session.user.id,
          batchId: batch.batchId,
          createdAt: Date.now(),
          tasks: batch.tasks.map((task) => ({
            clientId: task.id,
            serverTaskId: task.taskId,
            name:
              tasks.find((item) => item.id === task.id)?.name ??
              `${task.id}.png`,
          })),
        });
      }

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
        new Map(batch.tasks.map((task) => [task.taskId, task.id])),
        batch.batchId
      );
      void creditQuery.refetch();
    } catch (error) {
      const message = sanitizeProviderMessage(
        error instanceof Error ? error.message : copy.apiError
      );
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
    clientTaskByServerTask: Map<string, string>,
    batchId?: string
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
                    error: sanitizeProviderMessage(
                      status.errorMessage ?? copy.apiError
                    ),
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
    if (pending.size === 0 && session?.user?.id) {
      clearGeneratorSession('batch', session.user.id);
      setBatchNotice('');
    } else if (batchId && session?.user?.id) {
      saveGeneratorSession({
        mode: 'batch',
        userId: session.user.id,
        batchId,
        createdAt: Date.now(),
        tasks: Array.from(pending).map((serverTaskId) => ({
          serverTaskId,
          clientId: clientTaskByServerTask.get(serverTaskId) ?? serverTaskId,
          name:
            tasks.find(
              (task) => task.id === clientTaskByServerTask.get(serverTaskId)
            )?.name ?? `${serverTaskId}.png`,
        })),
      });
    }
  }

  function downloadTask(task: BatchImageTask) {
    if (!task.resultDataUrl) return;
    void downloadFile(task.resultDataUrl, `prodlist-${task.name}`);
  }

  async function downloadCompletedZip() {
    const completedTasks = tasks.filter((task) => task.resultDataUrl);
    if (completedTasks.length === 0) return;
    setZipDownloading(true);
    setBatchNotice(copy.zipPreparing);
    try {
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
      setBatchNotice(copy.zipReady);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setBatchNotice(copy.zipFallback);
    } finally {
      setZipDownloading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231e]">
      <GeneratorWorkbenchHeader
        locale={typedLocale}
        active="batch"
        credits={credits}
        refreshDisabled={!signedIn || creditQuery.isFetching}
        refreshing={creditQuery.isFetching}
        onRefresh={() => void creditQuery.refetch()}
        onLocaleChange={handleLocaleChange}
      />

      <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[400px_minmax(0,0.8fr)_460px]">
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
                className={`mt-3 flex min-h-28 cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 transition ${
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
                <div className="flex w-full items-center gap-3 text-left">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#6e7d67] shadow-sm">
                    <IconPhotoScan className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{copy.dropHint}</p>
                    <p className="mt-1 text-[#8a9282] text-xs">
                      {copy.limitHint}
                    </p>
                  </div>
                  <Button type="button" size="sm" className="bg-[#20231e]">
                    {copy.chooseFiles}
                  </Button>
                </div>
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

            <section className="rounded-lg border-2 border-[#2f5f4f]/25 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{copy.prompt}</h2>
                  <p className="mt-1 text-[#74796d] text-sm">
                    {copy.parameterHint}
                  </p>
                </div>
                <IconWand className="size-5 text-[#d83b01]" />
              </div>
              <Textarea
                id="batch-shared-prompt"
                value={prompt}
                placeholder={copy.promptPlaceholder}
                className="mt-4 min-h-36 resize-none border-[#b7cbbd] bg-[#fbfcf7] text-base leading-7 shadow-inner focus-visible:ring-[#2f5f4f]"
                onChange={(event) => setPrompt(event.target.value)}
              />
            </section>

            <section className="rounded-lg border border-[#dfe3d8] bg-white/85 p-4 shadow-sm shadow-black/0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-sm">{copy.configTitle}</h2>
                  <p className="mt-1 text-[#74796d] text-sm">
                    {copy.configDescription}
                  </p>
                </div>
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
                  {modelConfig.outputParam ? (
                    <FieldSelect
                      label={copy.resolution}
                      value={resolution}
                      options={modelConfig.outputParam.options}
                      renderOption={(value) =>
                        `${value} · ${modelConfig.outputParam?.label}`
                      }
                      onChange={(value) =>
                        setResolution(value as KieResolution)
                      }
                    />
                  ) : null}
                </div>
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
            <SourcePreviewSection
              title={copy.sourcePreview}
              tasks={tasks}
              selectedTaskId={selectedTask?.id}
              copy={copy}
              onSelect={setSelectedTaskId}
              onRemove={removeTask}
            />
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

        <aside className="border-[#dfe3d8] border-t bg-[#fbfcf7] p-4 lg:border-t-0 xl:border-l">
          <section className="rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-xl">{copy.resultsPanel}</h2>
                <p className="mt-1 text-[#74796d] text-sm">
                  {completedCount} {copy.completed} · {failedCount}{' '}
                  {copy.failed} · {runningCount} {copy.processing}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="bg-white"
                disabled={completedCount === 0 || zipDownloading}
                onClick={() => void downloadCompletedZip()}
              >
                <IconPackageExport className="size-4" />
                {copy.batchDownload}
              </Button>
            </div>

            {hasSubmittedTasks ? (
              <ResultCardGrid
                tasks={tasks}
                copy={copy}
                onPreview={setPreviewUrl}
                onDownload={downloadTask}
              />
            ) : (
              <div className="min-h-[520px] rounded-lg border border-dashed border-[#dfe3d8] bg-[#fbfcf7]" />
            )}
          </section>
        </aside>
      </section>

      {previewUrl ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setPreviewUrl('')}
          aria-label={copy.preview}
        >
          <img
            src={previewUrl}
            alt={copy.preview}
            className="max-h-[92vh] max-w-[92vw] rounded-lg bg-white object-contain shadow-2xl"
          />
        </button>
      ) : null}
    </main>
  );
}

function SourcePreviewSection({
  title,
  tasks,
  selectedTaskId,
  copy,
  onSelect,
  onRemove,
}: {
  title: string;
  tasks: BatchImageTask[];
  selectedTaskId?: string;
  copy: (typeof COPY)[BatchGeneratorLocale];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 font-semibold text-xl">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {tasks.map((task) => (
          <article
            key={`source-${task.id}`}
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
                {task.sourceDataUrl ? (
                  <img
                    src={task.sourceDataUrl}
                    alt={task.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#eef1e8] text-[#7c8476] text-xs">
                    {copy.processing}
                  </div>
                )}
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
                  <p className="mt-1 text-[#7c8476] text-xs">
                    {formatFileSize(task.size)}
                  </p>
                </button>
                <button
                  type="button"
                  className="rounded-md p-1 text-[#8a9282] hover:bg-[#f2f4ed] hover:text-[#20231e]"
                  onClick={() => onRemove(task.id)}
                  aria-label={copy.remove}
                >
                  <IconX className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResultCardGrid({
  tasks,
  copy,
  onPreview,
  onDownload,
}: {
  tasks: BatchImageTask[];
  copy: (typeof COPY)[BatchGeneratorLocale];
  onPreview: (url: string) => void;
  onDownload: (task: BatchImageTask) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tasks.map((task) => (
        <article
          key={`result-${task.id}`}
          className="overflow-hidden rounded-lg border border-[#dfe3d8] bg-[#fbfcf7]"
        >
          <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#eef1e8]">
            {task.resultDataUrl ? (
              <button
                type="button"
                className="h-full w-full"
                onClick={() => onPreview(task.resultDataUrl ?? '')}
              >
                <img
                  src={task.resultDataUrl}
                  alt={task.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </button>
            ) : (
              <div className="px-4 text-center">
                <StatusBadge status={task.status} copy={copy} />
                {['queued', 'processing'].includes(task.status) ? (
                  <div className="mt-4 w-32 max-w-full">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#d83b01] transition-all duration-500"
                        style={{ width: `${Math.max(task.progress, 8)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[#74796d] text-xs">
                      {task.progress}%
                    </p>
                  </div>
                ) : null}
                {task.error ? (
                  <p className="mt-3 line-clamp-3 text-[#b42318] text-xs">
                    {sanitizeProviderMessage(task.error)}
                  </p>
                ) : null}
              </div>
            )}
            <div className="absolute top-2 left-2">
              <StatusBadge status={task.status} copy={copy} />
            </div>
          </div>
          <div className="p-2.5">
            <p className="line-clamp-1 font-medium text-sm">{task.name}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!task.resultDataUrl}
                onClick={() =>
                  task.resultDataUrl && onPreview(task.resultDataUrl)
                }
              >
                <IconEye className="size-4" />
                {copy.preview}
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-[#d83b01]"
                disabled={!task.resultDataUrl}
                onClick={() => onDownload(task)}
              >
                <IconDownload className="size-4" />
                {copy.download}
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
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
          <span className="truncate">
            {renderOption ? renderOption(value) : value}
          </span>
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
  aspectRatio,
  resolution,
}: {
  prompt: string;
  modelLabel: string;
  aspectRatio: string;
  resolution: string;
}) {
  const instruction = prompt.trim()
    ? prompt.trim()
    : 'Create a polished ecommerce product image from the uploaded source.';
  return [
    'Use the uploaded image as the immutable source image.',
    `Generation model: ${modelLabel}.`,
    `Aspect ratio: ${aspectRatio}.`,
    resolution ? `Output quality: ${resolution}.` : '',
    instruction,
    'Preserve the exact product identity, geometry, material, logos, labels, and visible structure unless the user explicitly asks to translate visible text.',
    'Do not invent extra products. Do not change the product category. Keep the result suitable for ecommerce listing use.',
  ]
    .filter(Boolean)
    .join(' ');
}

async function fetchImageBlob(url: string) {
  if (url.startsWith('data:')) {
    const response = await fetch(url);
    return response.blob();
  }
  if (url.startsWith('blob:')) {
    const response = await fetch(url);
    return response.blob();
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return response.blob();
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'image.png';
}

function sanitizeProviderMessage(message: string) {
  return message
    .replace(/\bKie\b/gi, 'AI')
    .replace(/\bprovider\b/gi, 'service')
    .replace(/task creation/gi, 'task submission');
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
