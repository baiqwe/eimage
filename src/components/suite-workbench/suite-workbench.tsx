import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconLoader2,
  IconPhoto,
  IconPlus,
  IconSparkles,
  IconTrash,
  IconUpload,
  IconWand,
} from '@tabler/icons-react';
import { draftProductImagePrompt } from '@/api/ai';
import {
  createGenerationBatch,
  getGenerationCredits,
  getGenerationTaskStatuses,
} from '@/api/generation';
import { authClient } from '@/auth/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GeneratorWorkbenchHeader } from '@/components/generator/generator-workbench-header';
import { Label } from '@/components/ui/label';
import { useGenerationBatches } from '@/hooks/use-generation-history';
import { estimateTaskCreditCost } from '@/lib/product-generation';
import { KIE_MODELS } from '@/lib/kie-models';
import {
  getLocalizedPublicPath,
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { downloadFile } from '@/lib/download';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';

type TaskKind = 'main' | 'detail';
type TaskStatus =
  | 'idle'
  | 'drafting'
  | 'ready'
  | 'queued'
  | 'rendering'
  | 'done'
  | 'failed';

type WorkbenchTask = {
  id: string;
  kind: TaskKind;
  style: string;
  aspectRatio: string;
  resolution: string;
  prompt: string;
  model: string;
  reasoning: string;
  keywords: string[];
  referenceImage?: string;
  referenceName?: string;
  imageUrl?: string;
  serverTaskId?: string;
  providerTaskId?: string;
  status: TaskStatus;
  expanded: boolean;
};

type Locale = ProductLocale;

const MAIN_STYLES = [
  'Pure Studio Key Light',
  'Minimal Reflection Plinth',
  'Soft Shadow Marketplace',
  'Color Block Premium',
] as const;

const DETAIL_STYLES = [
  'Morning Window Lifestyle',
  'Cozy Coffee Counter',
  'Premium Dark Editorial',
  'Outdoor Natural Tabletop',
  'Neon Retail Showcase',
] as const;

const ASPECT_RATIOS = ['1:1', '4:5', '3:4', '16:9', '9:16'] as const;
const RESOLUTIONS = [
  '1024x1024',
  '1536x1920',
  '1024x1536',
  '1920x1080',
] as const;

const DEFAULT_DESCRIPTION = '一款极简白色的陶瓷咖啡杯，带有原木底座，哑光质感';

const WORKBENCH_COPY = {
  zh: {
    subtitle: '商品图智能生成工作台',
    credits: '生图点数',
    language: '语言',
    globalTitle: '全局环境变量',
    globalSubtitle: '所有任务共用的商品锚点',
    upload: '上传商品素材图',
    file: '素材文件',
    noFile: '未上传',
    description: '商品基础描述',
    generateAll: '生成',
    back: '返回首页',
    login: '登录 / 注册',
    authRequired: '请先登录或注册，系统会自动赠送试用生图点数。',
    refreshCredits: '刷新点数',
    model: '生图模型',
    polling: '任务已提交到 Kie，正在轮询生成结果。',
    providerTask: 'Kie 任务',
    batch: '批次',
    batchReady: (credits: number, count: number) =>
      `已创建批次，${count} 个单图任务并发执行，预扣 ${credits} 点。`,
    insufficientCredits: (required: number, available: number) =>
      `点数不足：需要 ${required} 点，当前剩余 ${available} 点。`,
    history: '历史',
    historyTitle: '最近批次',
    emptyHistory: '生成后会在这里看到批次、任务数和扣点记录。',
    queueTitle: '渲染任务队列',
    queueSubtitle: '主图与详情图可以并行规划、独立生成、分别追溯',
    summary: (main: number, detail: number) =>
      `当前素材包：${main} 个主图，${detail} 个详情页`,
    addMain: '主图',
    addDetail: '详情图',
    main: '主图',
    detail: '详情图',
    style: '风格预设',
    ratio: '尺寸比例',
    resolution: '分辨率',
    prompt: '提示词',
    draft: '智能撰写',
    reference: '参考图',
    useGlobal: '默认使用全局商品图',
    changeReference: '修改参考图',
    promptPlaceholder:
      '根据风格自动生成默认提示词，也可以点击智能撰写或手动修改。',
    render: '开始渲染',
    rerender: '重新渲染',
    inspector: '实时画廊与资产检查器',
    currentTask: '当前任务',
    waiting: '等待生成',
    rendering: '渲染中',
    resultAssets: '结果资产',
    noResults: '完成后会在这里展示本批次的全部图片。',
    download: '下载原图',
    details: '任务详情',
    type: '类型',
    status: '状态',
    reasoning: 'AI 设计意图',
    selectTask: '选择一个任务查看资产详情',
    statuses: {
      idle: '待配置',
      drafting: '撰写中',
      ready: '可渲染',
      queued: '排队中',
      rendering: '渲染中',
      done: '已完成',
      failed: '失败',
    },
    globalBadge: '全局',
    sourceAlt: '商品素材图',
  },
  en: {
    subtitle: 'Product image generation workbench',
    credits: 'Credits',
    language: 'Language',
    globalTitle: 'Global Context',
    globalSubtitle: 'Shared product anchor for every task',
    upload: 'Upload source product image',
    file: 'Source file',
    noFile: 'Not uploaded',
    description: 'Base product description',
    generateAll: 'Generate',
    back: 'Back home',
    login: 'Log in / Sign up',
    authRequired:
      'Please log in or create an account first. Trial credits are granted automatically.',
    refreshCredits: 'Refresh credits',
    model: 'Generation model',
    polling: 'Task submitted to Kie. Polling for the generated asset.',
    providerTask: 'Kie task',
    batch: 'Batch',
    batchReady: (credits: number, count: number) =>
      `Batch created. ${count} single-image tasks are running in parallel, reserving ${credits} credits.`,
    insufficientCredits: (required: number, available: number) =>
      `Insufficient credits: ${required} required, ${available} available.`,
    history: 'History',
    historyTitle: 'Recent batches',
    emptyHistory: 'Batches, task counts, and credit usage will appear here.',
    queueTitle: 'Render Task Queue',
    queueSubtitle:
      'Plan hero and detail assets in parallel, then inspect each output',
    summary: (main: number, detail: number) =>
      `Current pack: ${main} main image${main === 1 ? '' : 's'}, ${detail} detail page image${detail === 1 ? '' : 's'}`,
    addMain: 'Main',
    addDetail: 'Detail',
    main: 'Main',
    detail: 'Detail',
    style: 'Style preset',
    ratio: 'Aspect ratio',
    resolution: 'Resolution',
    prompt: 'Prompt',
    draft: 'Smart draft',
    reference: 'Reference image',
    useGlobal: 'Uses global product image by default',
    changeReference: 'Change reference',
    promptPlaceholder:
      'A style-based prompt is prefilled. Draft with AI or edit manually.',
    render: 'Render',
    rerender: 'Render again',
    inspector: 'Live Gallery & Asset Inspector',
    currentTask: 'Current task',
    waiting: 'Waiting',
    rendering: 'Rendering',
    resultAssets: 'Result assets',
    noResults: 'All completed images in this batch will appear here.',
    download: 'Download original',
    details: 'Task Details',
    type: 'Type',
    status: 'Status',
    reasoning: 'AI Design Intent',
    selectTask: 'Select a task to inspect the asset',
    statuses: {
      idle: 'Draft',
      drafting: 'Drafting',
      ready: 'Ready',
      queued: 'Queued',
      rendering: 'Rendering',
      done: 'Done',
      failed: 'Failed',
    },
    globalBadge: 'Global',
    sourceAlt: 'Source product image',
  },
  ja: {
    subtitle: '商品画像生成ワークベンチ',
    credits: 'クレジット',
    language: '言語',
    globalTitle: 'グローバル設定',
    globalSubtitle: '全タスクで共有する商品情報',
    upload: '商品素材画像をアップロード',
    file: '素材ファイル',
    noFile: '未アップロード',
    description: '商品説明',
    generateAll: '生成',
    back: 'ホームへ戻る',
    login: 'ログイン / 登録',
    authRequired:
      '先にログインまたは登録してください。試用クレジットは自動付与されます。',
    refreshCredits: 'クレジット更新',
    model: '生成モデル',
    polling: 'Kie にタスクを送信しました。結果を確認しています。',
    providerTask: 'Kie タスク',
    batch: 'バッチ',
    batchReady: (credits: number, count: number) =>
      `バッチを作成しました。${count} 件の単画像タスクを並列実行し、${credits} クレジットを予約します。`,
    insufficientCredits: (required: number, available: number) =>
      `クレジット不足：必要 ${required}、残高 ${available}。`,
    history: '履歴',
    historyTitle: '最近のバッチ',
    emptyHistory: '生成後、バッチ、タスク数、クレジット消費が表示されます。',
    queueTitle: 'レンダリングタスクキュー',
    queueSubtitle: '主画像と詳細画像を並列で設計し、それぞれ確認できます',
    summary: (main: number, detail: number) =>
      `現在のパック：主画像 ${main} 件、詳細画像 ${detail} 件`,
    addMain: '主画像',
    addDetail: '詳細画像',
    main: '主画像',
    detail: '詳細画像',
    style: 'スタイル',
    ratio: '比率',
    resolution: '解像度',
    prompt: 'Prompt',
    draft: 'AI 下書き',
    reference: '参照画像',
    useGlobal: '通常は共通の商品画像を使用',
    changeReference: '参照画像を変更',
    promptPlaceholder:
      'スタイルに基づく Prompt を自動生成できます。AI 下書き後に手動編集も可能です。',
    render: 'レンダリング開始',
    rerender: '再レンダリング',
    inspector: 'ライブギャラリーと素材インスペクター',
    currentTask: '現在のタスク',
    waiting: '生成待ち',
    rendering: 'レンダリング中',
    resultAssets: '生成結果',
    noResults: '完了した画像がここに一覧表示されます。',
    download: '元画像をダウンロード',
    details: 'タスク詳細',
    type: '種類',
    status: '状態',
    reasoning: 'AI デザイン意図',
    selectTask: 'タスクを選択して詳細を表示',
    statuses: {
      idle: '下書き',
      drafting: '作成中',
      ready: '準備完了',
      queued: '待機中',
      rendering: 'レンダリング中',
      done: '完了',
      failed: '失敗',
    },
    globalBadge: '共通',
    sourceAlt: '商品素材画像',
  },
  ko: {
    subtitle: '상품 이미지 생성 워크벤치',
    credits: '크레딧',
    language: '언어',
    globalTitle: '전역 컨텍스트',
    globalSubtitle: '모든 작업이 공유하는 상품 기준 정보',
    upload: '상품 소재 이미지 업로드',
    file: '소재 파일',
    noFile: '업로드 안 됨',
    description: '상품 기본 설명',
    generateAll: '생성',
    back: '홈으로',
    login: '로그인 / 가입',
    authRequired:
      '먼저 로그인하거나 가입해 주세요. 체험 크레딧이 자동 지급됩니다.',
    refreshCredits: '크레딧 새로고침',
    model: '생성 모델',
    polling: 'Kie에 작업을 제출했습니다. 생성 결과를 확인 중입니다.',
    providerTask: 'Kie 작업',
    batch: '배치',
    batchReady: (credits: number, count: number) =>
      `배치가 생성되었습니다. ${count}개의 단일 이미지 작업을 병렬 실행하고 ${credits} 크레딧을 예약합니다.`,
    insufficientCredits: (required: number, available: number) =>
      `크레딧 부족: ${required} 필요, 현재 ${available}.`,
    history: '기록',
    historyTitle: '최근 배치',
    emptyHistory: '생성 후 배치, 작업 수, 크레딧 사용량이 여기에 표시됩니다.',
    queueTitle: '렌더링 작업 큐',
    queueSubtitle:
      '메인 이미지와 상세 이미지를 병렬로 설계하고 각각 확인합니다',
    summary: (main: number, detail: number) =>
      `현재 팩: 메인 ${main}개, 상세 ${detail}개`,
    addMain: '메인',
    addDetail: '상세',
    main: '메인',
    detail: '상세',
    style: '스타일 프리셋',
    ratio: '화면 비율',
    resolution: '해상도',
    prompt: '프롬프트',
    draft: 'AI 작성',
    reference: '참조 이미지',
    useGlobal: '기본적으로 전역 상품 이미지 사용',
    changeReference: '참조 변경',
    promptPlaceholder:
      '스타일 기반 Prompt가 자동으로 채워집니다. AI 작성 후 직접 수정할 수 있습니다.',
    render: '렌더링 시작',
    rerender: '다시 렌더링',
    inspector: '실시간 갤러리 및 에셋 검사기',
    currentTask: '현재 작업',
    waiting: '생성 대기',
    rendering: '렌더링 중',
    resultAssets: '결과 에셋',
    noResults: '완료된 이미지가 여기에 모두 표시됩니다.',
    download: '원본 다운로드',
    details: '작업 상세',
    type: '유형',
    status: '상태',
    reasoning: 'AI 디자인 의도',
    selectTask: '작업을 선택해 에셋 상세 보기',
    statuses: {
      idle: '초안',
      drafting: '작성 중',
      ready: '준비됨',
      queued: '대기 중',
      rendering: '렌더링 중',
      done: '완료',
      failed: '실패',
    },
    globalBadge: '전역',
    sourceAlt: '상품 소재 이미지',
  },
  es: {
    subtitle: 'Workbench de generación de imágenes de producto',
    credits: 'Créditos',
    language: 'Idioma',
    globalTitle: 'Contexto global',
    globalSubtitle: 'Ancla de producto compartida por todas las tareas',
    upload: 'Subir imagen de producto',
    file: 'Archivo fuente',
    noFile: 'Sin subir',
    description: 'Descripción base del producto',
    generateAll: 'Generar',
    back: 'Volver al inicio',
    login: 'Iniciar sesión / Registrarse',
    authRequired:
      'Inicia sesión o crea una cuenta primero. Los créditos de prueba se conceden automáticamente.',
    refreshCredits: 'Actualizar créditos',
    model: 'Modelo de generación',
    polling: 'Tarea enviada a Kie. Consultando el resultado generado.',
    providerTask: 'Tarea Kie',
    batch: 'Lote',
    batchReady: (credits: number, count: number) =>
      `Lote creado. ${count} tareas de imagen se ejecutan en paralelo y reservan ${credits} créditos.`,
    insufficientCredits: (required: number, available: number) =>
      `Créditos insuficientes: se necesitan ${required}, tienes ${available}.`,
    history: 'Historial',
    historyTitle: 'Lotes recientes',
    emptyHistory: 'Aquí aparecerán lotes, tareas y consumo de créditos.',
    queueTitle: 'Cola de tareas de render',
    queueSubtitle:
      'Planifica imágenes principales y de detalle en paralelo, luego revisa cada resultado',
    summary: (main: number, detail: number) =>
      `Paquete actual: ${main} principales, ${detail} detalles`,
    addMain: 'Principal',
    addDetail: 'Detalle',
    main: 'Principal',
    detail: 'Detalle',
    style: 'Preset de estilo',
    ratio: 'Proporción',
    resolution: 'Resolución',
    prompt: 'Prompt',
    draft: 'Redactar con IA',
    reference: 'Imagen de referencia',
    useGlobal: 'Usa la imagen global por defecto',
    changeReference: 'Cambiar referencia',
    promptPlaceholder:
      'Se completa un Prompt según el estilo. Puedes redactarlo con IA o editarlo manualmente.',
    render: 'Renderizar',
    rerender: 'Renderizar de nuevo',
    inspector: 'Galería en vivo e inspector de assets',
    currentTask: 'Tarea actual',
    waiting: 'Esperando generación',
    rendering: 'Renderizando',
    resultAssets: 'Assets generados',
    noResults: 'Todas las imágenes completadas aparecerán aquí.',
    download: 'Descargar original',
    details: 'Detalles de tarea',
    type: 'Tipo',
    status: 'Estado',
    reasoning: 'Intención de diseño IA',
    selectTask: 'Selecciona una tarea para revisar el asset',
    statuses: {
      idle: 'Borrador',
      drafting: 'Redactando',
      ready: 'Lista',
      queued: 'En cola',
      rendering: 'Renderizando',
      done: 'Completada',
      failed: 'Fallida',
    },
    globalBadge: 'Global',
    sourceAlt: 'Imagen fuente del producto',
  },
} as const;

export function SuiteWorkbench({
  initialLocale,
}: {
  initialLocale?: ProductLocale;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { locale, setLocale } = useProductLocale(initialLocale);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const promptSyncRef = useRef({
    locale,
    description: DEFAULT_DESCRIPTION,
  });
  const { data: session } = authClient.useSession();
  const [sourceImage, setSourceImage] = useState<string>();
  const [sourceName, setSourceName] = useState('');
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [credits, setCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('task-main');
  const [batchNotice, setBatchNotice] = useState('');
  const [tasks, setTasks] = useState<WorkbenchTask[]>(() =>
    createInitialTasks(DEFAULT_DESCRIPTION, locale)
  );
  const t = WORKBENCH_COPY[locale];
  const signedIn = Boolean(session?.user);
  const { refetch: refetchHistory } = useGenerationBatches(0, 10);

  function handleLocaleChange(next: ProductLocale) {
    setLocale(next);
    const nextPath = getLocalizedPublicPath(pathname, next);
    if (nextPath !== pathname) {
      navigate({ to: nextPath });
    }
  }

  useEffect(() => {
    if (!signedIn) {
      setCredits(0);
      return;
    }
    void refreshCredits();
  }, [signedIn]);

  useEffect(() => {
    const previous = promptSyncRef.current;
    if (previous.locale === locale && previous.description === description) {
      return;
    }

    setTasks((current) =>
      current.map((task) => {
        if (task.serverTaskId || task.imageUrl) {
          return task;
        }

        const previousPrompt = createClientPrompt(
          task,
          previous.description,
          previous.locale
        );
        const shouldSyncPrompt =
          task.prompt.trim() === '' ||
          task.prompt === previousPrompt.prompt ||
          (task.reasoning === previousPrompt.reasoning &&
            task.keywords.join('|') === previousPrompt.keywords.join('|'));

        if (!shouldSyncPrompt) {
          return task;
        }

        return {
          ...task,
          ...createClientPrompt(task, description, locale),
        };
      })
    );

    promptSyncRef.current = { locale, description };
  }, [description, locale]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${t.subtitle} | ProdList AI`;
    }
  }, [t.subtitle]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0],
    [selectedTaskId, tasks]
  );
  const taskSummary = useMemo(
    () => ({
      main: tasks.filter((task) => task.kind === 'main').length,
      detail: tasks.filter((task) => task.kind === 'detail').length,
    }),
    [tasks]
  );

  function updateTask(id: string, patch: Partial<WorkbenchTask>) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...patch } : task))
    );
  }

  async function refreshCredits() {
    setCreditsLoading(true);
    try {
      const result = await getGenerationCredits();
      setCredits(result.balance);
    } catch {
      setBatchNotice(t.authRequired);
    } finally {
      setCreditsLoading(false);
    }
  }

  function addTask(kind: TaskKind) {
    const id = `task-${kind}-${Date.now()}`;
    const task: WorkbenchTask = {
      id,
      kind,
      style: kind === 'main' ? MAIN_STYLES[0] : DETAIL_STYLES[0],
      model: KIE_MODELS[0].id,
      aspectRatio: kind === 'main' ? '1:1' : '3:4',
      resolution: kind === 'main' ? '1024x1024' : '1024x1536',
      ...createClientPrompt(
        {
          id,
          kind,
          style: kind === 'main' ? MAIN_STYLES[0] : DETAIL_STYLES[0],
          aspectRatio: kind === 'main' ? '1:1' : '3:4',
          resolution: kind === 'main' ? '1024x1024' : '1024x1536',
          model: KIE_MODELS[0].id,
          prompt: '',
          reasoning: '',
          keywords: [],
          status: 'idle',
          expanded: true,
        },
        description,
        locale
      ),
      status: 'idle',
      expanded: true,
    };
    setTasks((current) => [
      ...current.map((item) => ({ ...item, expanded: false })),
      task,
    ]);
    setSelectedTaskId(id);
  }

  function removeTask(id: string) {
    setTasks((current) => {
      const next = current.filter((task) => task.id !== id);
      if (selectedTaskId === id) setSelectedTaskId(next[0]?.id ?? '');
      return next;
    });
  }

  async function onFileChange(file?: File) {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setSourceImage(dataUrl);
    setSourceName(file.name);
  }

  async function onTaskFileChange(id: string, file?: File) {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    updateTask(id, {
      referenceImage: dataUrl,
      referenceName: file.name,
      imageUrl: undefined,
      status: 'ready',
    });
  }

  async function draftPrompt(task: WorkbenchTask) {
    if (!description.trim()) return;
    updateTask(task.id, { status: 'drafting' });
    try {
      const result = await draftProductImagePrompt({
        data: {
          description,
          imageType: task.kind,
          style: task.style,
          locale,
        },
      });
      updateTask(task.id, {
        prompt: result.prompt,
        reasoning: result.reasoning,
        keywords: result.keywords,
        status: 'ready',
      });
    } catch {
      updateTask(task.id, {
        ...createClientPrompt(task, description, locale),
        status: 'ready',
      });
    }
  }

  async function renderTask(task: WorkbenchTask) {
    const referenceImage = task.referenceImage ?? sourceImage;
    if (!referenceImage) return;
    if (!signedIn) {
      setBatchNotice(t.authRequired);
      return;
    }
    const cost = estimateTaskCreditCost(task);
    if (credits < cost) {
      setBatchNotice(t.insufficientCredits(cost, credits));
      return;
    }
    const promptPatch = task.prompt.trim()
      ? {}
      : createClientPrompt(task, description, locale);
    await startGeneration([task], promptPatch);
  }

  async function generateAll() {
    const runnable = tasks.filter((task) => task.referenceImage ?? sourceImage);
    if (runnable.length === 0) return;
    if (!signedIn) {
      setBatchNotice(t.authRequired);
      return;
    }
    await startGeneration(runnable);
  }

  async function startGeneration(
    runnable: WorkbenchTask[],
    singlePromptPatch?: Partial<WorkbenchTask>
  ) {
    const plannedTasks = runnable.map((task) => ({
      id: task.id,
      kind: task.kind,
      style: task.style,
      aspectRatio: task.aspectRatio,
      resolution: task.resolution,
      model: task.model,
      prompt:
        singlePromptPatch?.prompt ||
        task.prompt.trim() ||
        createClientPrompt(task, description, locale).prompt,
      referenceImageDataUrl: task.referenceImage,
      referenceName: task.referenceName ?? sourceName,
    }));
    try {
      setBatchNotice('');
      setTasks((current) =>
        current.map((task) =>
          runnable.some((item) => item.id === task.id)
            ? { ...task, ...singlePromptPatch, status: 'queued' }
            : task
        )
      );

      const batch = await createGenerationBatch({
        data: {
          locale,
          productDescription: description,
          sourceImageDataUrl: sourceImage!,
          sourceName: sourceName || 'source-product.png',
          tasks: plannedTasks,
        },
      });

      if (!batch.ok) {
        setBatchNotice(
          t.insufficientCredits(batch.requiredCredits, batch.availableCredits)
        );
        setCredits(batch.availableCredits);
        setTasks((current) =>
          current.map((task) =>
            runnable.some((item) => item.id === task.id)
              ? { ...task, status: 'ready' }
              : task
          )
        );
        return;
      }

      setCredits(batch.balance);
      setBatchNotice(
        `${t.batchReady(batch.totalCreditCost, batch.tasks.length)} ${t.polling}`
      );
      void refetchHistory();

      setTasks((current) =>
        current.map((task) => {
          const submitted = batch.tasks.find((item) => item.id === task.id);
          if (!submitted) return task;
          const promptPatch = task.prompt.trim()
            ? {}
            : createClientPrompt(task, description, locale);
          return {
            ...task,
            ...promptPatch,
            prompt: submitted.prompt,
            serverTaskId: submitted.taskId,
            providerTaskId: submitted.providerTaskId ?? undefined,
            model: submitted.model,
            status: 'rendering',
          };
        })
      );
      setSelectedTaskId(runnable[0]?.id ?? selectedTaskId);
      await pollGenerationTasks(
        batch.tasks.map((task) => task.taskId),
        new Map(batch.tasks.map((task) => [task.taskId, task.id]))
      );
    } catch (error) {
      setBatchNotice(
        error instanceof Error ? error.message : 'Generation failed.'
      );
      setTasks((current) =>
        current.map((task) =>
          runnable.some((item) => item.id === task.id)
            ? { ...task, status: 'failed' }
            : task
        )
      );
      void refreshCredits();
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
          updateTask(clientTaskId, {
            imageUrl: status.imageUrl,
            status: 'done',
          });
        } else if (status.status === 'failed') {
          pending.delete(status.id);
          updateTask(clientTaskId, { status: 'failed' });
          if (status.errorMessage) setBatchNotice(status.errorMessage);
        } else {
          updateTask(clientTaskId, { status: 'rendering' });
        }
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231e]">
      <GeneratorWorkbenchHeader
        locale={locale}
        active="photo-set"
        credits={credits}
        refreshDisabled={!signedIn || creditsLoading}
        refreshing={creditsLoading}
        onRefresh={() => void refreshCredits()}
        onLocaleChange={handleLocaleChange}
      />

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[320px_minmax(440px,1fr)_380px]">
        <aside className="border-[#dfe3d8] border-b bg-[#fbfcf7] p-4 lg:border-r lg:border-b-0">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{t.globalTitle}</p>
              <p className="text-[#74796d] text-xs">{t.globalSubtitle}</p>
            </div>
            <Badge variant="outline">{t.globalBadge}</Badge>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void onFileChange(event.dataTransfer.files[0]);
            }}
            className={cn(
              'mb-5 flex aspect-square w-full items-center justify-center',
              'overflow-hidden rounded-lg border border-[#d9ded1]',
              'border-dashed bg-white text-left shadow-sm hover:border-[#9aa48d]'
            )}
          >
            {sourceImage ? (
              <img
                src={sourceImage}
                alt={t.sourceAlt}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-[#74796d]">
                <span className="flex size-12 items-center justify-center rounded-lg bg-[#eef1e8]">
                  <IconUpload className="size-6" />
                </span>
                <span className="font-medium text-sm">{t.upload}</span>
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(event) => void onFileChange(event.target.files?.[0])}
          />

          <div className="mb-5 rounded-lg border border-[#dfe3d8] bg-white p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-[#74796d] text-xs">{t.file}</span>
              <IconPhoto className="size-4 text-[#9aa48d]" />
            </div>
            <p className="truncate font-medium text-sm">
              {sourceName || t.noFile}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">{t.description}</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-36 resize-none bg-white"
            />
          </div>
          <Button
            type="button"
            className="mt-6 h-11 w-full bg-[#20231e] text-base hover:bg-[#30352d]"
            disabled={
              !sourceImage || tasks.some((task) => task.status === 'rendering')
            }
            onClick={() => void generateAll()}
          >
            <IconWand className="size-4" />
            {t.generateAll}
          </Button>
          {!signedIn ? (
            <p className="mt-3 text-[#72511f] text-sm">{t.authRequired}</p>
          ) : null}
        </aside>

        <section className="min-w-0 bg-[#f7f8f4] p-4 md:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="font-bold text-2xl">{t.queueTitle}</h1>
              <p className="text-[#74796d] text-sm">{t.queueSubtitle}</p>
              <p className="mt-1 font-medium text-[#2f5f4f] text-sm">
                {t.summary(taskSummary.main, taskSummary.detail)}
              </p>
              {batchNotice ? (
                <p className="mt-1 text-[#72511f] text-sm">{batchNotice}</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => addTask('main')}
              >
                <IconPlus className="size-4" />
                {t.addMain}
              </Button>
              <Button type="button" onClick={() => addTask('detail')}>
                <IconPlus className="size-4" />
                {t.addDetail}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                t={t}
                locale={locale}
                selected={task.id === selectedTask?.id}
                sourceReady={Boolean(task.referenceImage ?? sourceImage)}
                globalSourceName={sourceName || t.noFile}
                baseDescription={description}
                descriptionReady={description.trim().length > 0}
                onSelect={() => setSelectedTaskId(task.id)}
                onRemove={() => removeTask(task.id)}
                onUpdate={(patch) => updateTask(task.id, patch)}
                onTaskFileChange={(file) =>
                  void onTaskFileChange(task.id, file)
                }
                onDraft={() => void draftPrompt(task)}
                onRender={() => void renderTask(task)}
              />
            ))}
          </div>
        </section>

        <aside className="border-[#dfe3d8] border-t bg-[#fbfcf7] p-4 lg:border-t-0 lg:border-l">
          <Inspector
            task={selectedTask}
            tasks={tasks}
            selectedTaskId={selectedTask?.id}
            onSelectTask={setSelectedTaskId}
            t={t}
          />
        </aside>
      </div>
    </main>
  );
}

function TaskCard({
  task,
  t,
  locale,
  selected,
  sourceReady,
  globalSourceName,
  baseDescription,
  descriptionReady,
  onSelect,
  onRemove,
  onUpdate,
  onTaskFileChange,
  onDraft,
  onRender,
}: {
  task: WorkbenchTask;
  t: (typeof WORKBENCH_COPY)[Locale];
  locale: Locale;
  selected: boolean;
  sourceReady: boolean;
  globalSourceName: string;
  baseDescription: string;
  descriptionReady: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<WorkbenchTask>) => void;
  onTaskFileChange: (file?: File) => void;
  onDraft: () => void;
  onRender: () => void;
}) {
  const styles = task.kind === 'main' ? MAIN_STYLES : DETAIL_STYLES;

  return (
    <article
      className={cn(
        'rounded-lg border bg-white shadow-sm transition',
        selected ? 'border-[#2f5f4f] shadow-[#2f5f4f]/10' : 'border-[#dfe3d8]'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-3 border-[#edf0e8] border-b p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Badge
            className={cn(
              task.kind === 'main'
                ? 'bg-[#d9eadf] text-[#285340]'
                : 'bg-[#e9dfc9] text-[#72511f]'
            )}
          >
            {task.kind === 'main' ? t.main : t.detail}
          </Badge>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm">{task.style}</p>
            <p className="text-[#74796d] text-xs">
              {task.aspectRatio} · {task.resolution} · {t.statuses[task.status]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {task.status === 'drafting' || task.status === 'rendering' ? (
            <IconLoader2 className="size-4 animate-spin text-[#2f5f4f]" />
          ) : null}
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onUpdate({ expanded: !task.expanded });
            }}
          >
            {task.expanded ? <IconChevronUp /> : <IconChevronDown />}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            <IconTrash />
          </Button>
        </div>
      </div>

      {task.expanded ? (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <FieldSelect
              label={t.model}
              value={task.model}
              values={KIE_MODELS.map((model) => model.id)}
              labels={Object.fromEntries(
                KIE_MODELS.map((model) => [model.id, model.label])
              )}
              onChange={(model) =>
                onUpdate({
                  model,
                  imageUrl: undefined,
                  status: 'ready',
                })
              }
            />
            <FieldSelect
              label={t.style}
              value={task.style}
              values={[...styles]}
              onChange={(style) =>
                onUpdate({
                  style,
                  ...createClientPrompt(
                    { ...task, style },
                    baseDescription,
                    locale
                  ),
                  imageUrl: undefined,
                  status: 'ready',
                })
              }
            />
            <FieldSelect
              label={t.ratio}
              value={task.aspectRatio}
              values={[...ASPECT_RATIOS]}
              onChange={(aspectRatio) => onUpdate({ aspectRatio })}
            />
            <FieldSelect
              label={t.resolution}
              value={task.resolution}
              values={[...RESOLUTIONS]}
              onChange={(resolution) => onUpdate({ resolution })}
            />
          </div>

          <div className="rounded-lg border border-[#dfe3d8] bg-[#fbfcf7] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">{t.reference}</p>
                <p className="text-[#74796d] text-xs">
                  {task.referenceName ?? t.useGlobal}
                </p>
              </div>
              <label
                htmlFor={`${task.id}-reference`}
                className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#dfe3d8] bg-white px-2.5 font-medium text-sm hover:bg-[#eef1e8]"
                onClick={(event) => event.stopPropagation()}
              >
                <IconUpload className="size-4" />
                {t.changeReference}
              </label>
            </div>
            <p className="truncate text-[#74796d] text-xs">
              {task.referenceName ?? globalSourceName}
            </p>
            <input
              id={`${task.id}-reference`}
              className="hidden"
              type="file"
              accept="image/*"
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => onTaskFileChange(event.target.files?.[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={`${task.id}-prompt`}>{t.prompt}</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!descriptionReady || task.status === 'drafting'}
                onClick={(event) => {
                  event.stopPropagation();
                  onDraft();
                }}
              >
                {task.status === 'drafting' ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconSparkles className="size-4" />
                )}
                {t.draft}
              </Button>
            </div>
            <Textarea
              id={`${task.id}-prompt`}
              value={task.prompt}
              onChange={(event) =>
                onUpdate({ prompt: event.target.value, status: 'ready' })
              }
              className="min-h-32 resize-none"
              placeholder={t.promptPlaceholder}
            />
          </div>

          <Button
            type="button"
            className="w-full bg-[#20231e] hover:bg-[#30352d]"
            disabled={!sourceReady || task.status === 'rendering'}
            onClick={(event) => {
              event.stopPropagation();
              onRender();
            }}
          >
            {task.status === 'rendering' ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconWand className="size-4" />
            )}
            {task.imageUrl ? t.rerender : t.render}
          </Button>
        </div>
      ) : null}
    </article>
  );
}

function FieldSelect({
  label,
  value,
  values,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger className="w-full bg-[#fbfcf7]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {values.map((item) => (
            <SelectItem key={item} value={item}>
              {labels?.[item] ?? item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Inspector({
  task,
  tasks,
  selectedTaskId,
  onSelectTask,
  t,
}: {
  task?: WorkbenchTask;
  tasks: WorkbenchTask[];
  selectedTaskId?: string;
  onSelectTask: (id: string) => void;
  t: (typeof WORKBENCH_COPY)[Locale];
}) {
  const completedTasks = tasks.filter((item) => item.imageUrl);
  if (!task) {
    return (
      <div className="flex h-full items-center justify-center text-[#74796d] text-sm">
        {t.selectTask}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <p className="font-semibold text-sm">{t.inspector}</p>
        <p className="text-[#74796d] text-xs">
          {t.currentTask}: {task.style}
        </p>
      </div>

      <div className="rounded-lg border border-[#dfe3d8] bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-semibold text-sm">{t.resultAssets}</p>
          <span className="text-[#74796d] text-xs">
            {completedTasks.length}/{tasks.length}
          </span>
        </div>
        {completedTasks.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {completedTasks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTask(item.id)}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-md border bg-[#f7f8f4]',
                  'transition hover:border-[#2f5f4f] focus:outline-none focus:ring-2 focus:ring-[#2f5f4f]/30',
                  selectedTaskId === item.id
                    ? 'border-[#2f5f4f] ring-2 ring-[#2f5f4f]/20'
                    : 'border-[#dfe3d8]'
                )}
              >
                <img
                  src={item.imageUrl}
                  alt={`${item.style} generated asset`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-1 bottom-1 truncate rounded bg-[#20231e]/80 px-1.5 py-0.5 text-[10px] text-white">
                  {item.kind === 'main' ? t.main : t.detail}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[#74796d] text-sm">{t.noResults}</p>
        )}
      </div>

      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[#dfe3d8] bg-white shadow-sm">
        {task.status === 'rendering' ? (
          <div className="flex flex-col items-center gap-3 text-[#74796d]">
            <IconLoader2 className="size-8 animate-spin text-[#2f5f4f]" />
            <span className="text-sm">{t.rendering}</span>
          </div>
        ) : task.imageUrl ? (
          <img
            src={task.imageUrl}
            alt="Generated product asset"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-[#74796d]">
            <IconPhoto className="size-8" />
            <span className="text-sm">{t.waiting}</span>
          </div>
        )}
      </div>

      {task.imageUrl ? (
        <Button
          type="button"
          className="w-full"
          onClick={() =>
            void downloadFile(task.imageUrl!, `suite-workbench-${task.id}.png`)
          }
        >
          <IconDownload className="size-4" />
          {t.download}
        </Button>
      ) : null}

      <div className="rounded-lg border border-[#dfe3d8] bg-white p-4">
        <p className="mb-3 font-semibold text-sm">{t.details}</p>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-[#74796d]">{t.type}</dt>
          <dd className="text-right">
            {task.kind === 'main' ? t.main : t.detail}
          </dd>
          <dt className="text-[#74796d]">{t.ratio}</dt>
          <dd className="text-right">{task.aspectRatio}</dd>
          <dt className="text-[#74796d]">{t.resolution}</dt>
          <dd className="text-right">{task.resolution}</dd>
          <dt className="text-[#74796d]">{t.model}</dt>
          <dd className="truncate text-right">{getModelLabel(task.model)}</dd>
          {task.providerTaskId ? (
            <>
              <dt className="text-[#74796d]">{t.providerTask}</dt>
              <dd className="truncate text-right">{task.providerTaskId}</dd>
            </>
          ) : null}
          <dt className="text-[#74796d]">{t.status}</dt>
          <dd className="text-right">{t.statuses[task.status]}</dd>
        </dl>
      </div>

      {task.reasoning ? (
        <div className="rounded-lg border border-[#cbdcd2] bg-[#eef6f0] p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold text-[#285340] text-sm">
            <IconSparkles className="size-4" />
            {t.reasoning}
          </p>
          <p className="text-[#3c4a3f] text-sm leading-relaxed">
            {task.reasoning}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {task.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function createClientPrompt(
  task: WorkbenchTask,
  description: string,
  locale: Locale = 'zh'
) {
  const isMain = task.kind === 'main';
  return {
    prompt: getClientPrompt(locale, description, task.style, isMain),
    reasoning: getClientReasoning(locale, isMain),
    keywords: getClientKeywords(locale, isMain),
  };
}

function createInitialTasks(
  description: string,
  locale: Locale = 'zh'
): WorkbenchTask[] {
  const mainTask: WorkbenchTask = {
    id: 'task-main',
    kind: 'main',
    style: MAIN_STYLES[0],
    model: KIE_MODELS[0].id,
    aspectRatio: ASPECT_RATIOS[0],
    resolution: RESOLUTIONS[0],
    prompt: '',
    reasoning: '',
    keywords: [],
    status: 'idle',
    expanded: true,
  };
  const detailTask: WorkbenchTask = {
    id: 'task-detail',
    kind: 'detail',
    style: DETAIL_STYLES[0],
    model: KIE_MODELS[0].id,
    aspectRatio: ASPECT_RATIOS[2],
    resolution: RESOLUTIONS[2],
    prompt: '',
    reasoning: '',
    keywords: [],
    status: 'idle',
    expanded: false,
  };

  return [
    { ...mainTask, ...createClientPrompt(mainTask, description, locale) },
    { ...detailTask, ...createClientPrompt(detailTask, description, locale) },
  ];
}

function getModelLabel(modelId: string) {
  return KIE_MODELS.find((model) => model.id === modelId)?.label ?? modelId;
}

function getClientReasoning(locale: Locale, isMain: boolean) {
  const copy = {
    zh: isMain
      ? '用纯净构图和高级布光突出商品轮廓，让主图更适合投放和货架展示。'
      : '用具体场景补足商品使用氛围，同时保持主体不被 AI 改形。',
    en: isMain
      ? 'A clean composition and premium lighting make the product suitable for marketplace hero placement.'
      : 'A concrete lifestyle scene adds buying context while preserving the uploaded product shape.',
    ja: isMain
      ? 'クリーンな構図と上質な照明で商品輪郭を強調し、EC の主画像に適した見え方にします。'
      : '具体的な利用シーンを加えながら、アップロード商品の形状は維持します。',
    ko: isMain
      ? '깔끔한 구도와 고급 조명으로 상품 윤곽을 강조해 마켓플레이스 메인 이미지에 적합하게 만듭니다.'
      : '구체적인 사용 장면을 더하면서 업로드된 상품 형태는 유지합니다.',
    es: isMain
      ? 'Una composición limpia y luz premium hacen que el producto funcione como imagen principal de marketplace.'
      : 'Una escena lifestyle añade contexto de compra sin alterar la forma del producto subido.',
  };
  return copy[locale];
}

function getClientPrompt(
  locale: Locale,
  description: string,
  style: string,
  isMain: boolean
) {
  const promptByLocale = {
    zh: [
      '基于上传商品图生成高真实感电商商品图，并将原商品作为不可变主体。',
      `商品描述：${description}。`,
      `风格方向：${style}。`,
      isMain
        ? '画面用于平台主图，主体居中，构图干净，高级棚拍背景。'
        : '画面用于详情场景图，环境真实自然，保留生活化氛围。',
      '严格保留商品原始形状、轮廓、材质、颜色、标签和几何结构。',
      '只允许调整背景、光线、阴影、反射和氛围，不要改动商品本体。',
    ],
    en: [
      'Create a photorealistic ecommerce image using the uploaded product as the immutable source.',
      `Product description: ${description}.`,
      `Style direction: ${style}.`,
      isMain
        ? 'Use a marketplace-ready hero composition with the product centered and a premium studio background.'
        : 'Use a realistic lifestyle detail composition with believable environmental context.',
      'Preserve the exact product shape, silhouette, material, color, labels, and geometry.',
      'Change only the background, lighting, shadow, reflection, and atmosphere.',
    ],
    ja: [
      'アップロードした商品画像を不変の主体として、高精細な EC 商品画像を生成してください。',
      `商品説明：${description}。`,
      `スタイル方針：${style}。`,
      isMain
        ? 'マーケットプレイス向け主画像として、商品を中央に配置し、上質なスタジオ背景で構成します。'
        : '詳細ページ向けに、自然で信頼感のあるライフスタイルシーンで構成します。',
      '商品の形状、輪郭、素材、色、ラベル、幾何構造は厳密に維持してください。',
      '変更してよいのは背景、照明、影、反射、空気感のみです。',
    ],
    ko: [
      '업로드한 상품 이미지를 변경 불가한 기준으로 사용해 사실적인 이커머스 이미지를 생성하세요.',
      `상품 설명: ${description}.`,
      `스타일 방향: ${style}.`,
      isMain
        ? '마켓플레이스용 메인 이미지처럼 상품을 중앙에 두고 프리미엄 스튜디오 배경으로 구성합니다.'
        : '상세 페이지용 라이프스타일 장면처럼 자연스럽고 믿을 수 있는 환경 맥락을 구성합니다.',
      '상품의 형태, 윤곽, 재질, 색상, 라벨, 기하 구조를 정확히 유지하세요.',
      '배경, 조명, 그림자, 반사, 분위기만 변경하고 상품 본체는 바꾸지 마세요.',
    ],
    es: [
      'Genera una imagen ecommerce fotorrealista usando el producto subido como fuente inmutable.',
      `Descripción del producto: ${description}.`,
      `Dirección de estilo: ${style}.`,
      isMain
        ? 'Usa una composición principal lista para marketplace, con el producto centrado y fondo de estudio premium.'
        : 'Usa una composición lifestyle de detalle con un contexto ambiental creíble.',
      'Conserva exactamente la forma, silueta, material, color, etiquetas y geometría del producto.',
      'Cambia solo el fondo, la iluminación, la sombra, el reflejo y la atmósfera.',
    ],
  };
  return promptByLocale[locale].join(' ');
}

function getClientKeywords(locale: Locale, isMain: boolean) {
  const copy = {
    zh: isMain ? ['主图', '锁边', '棚拍'] : ['详情图', '场景', '氛围'],
    en: isMain
      ? ['Main image', 'Shape lock', 'Studio']
      : ['Detail image', 'Scene', 'Mood'],
    ja: isMain
      ? ['主画像', '形状維持', 'スタジオ']
      : ['詳細画像', 'シーン', '雰囲気'],
    ko: isMain ? ['메인', '형태 유지', '스튜디오'] : ['상세', '장면', '무드'],
    es: isMain
      ? ['Principal', 'Forma preservada', 'Estudio']
      : ['Detalle', 'Escena', 'Ambiente'],
  };
  return copy[locale];
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
