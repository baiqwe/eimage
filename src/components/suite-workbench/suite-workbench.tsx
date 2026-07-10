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
import {
  GeneratorActionBar,
  GeneratorShell,
} from '@/components/generator/generator-workbench-layout';
import { Label } from '@/components/ui/label';
import { useGenerationBatches } from '@/hooks/use-generation-history';
import { estimateTaskCreditCost } from '@/lib/product-generation';
import {
  clearGeneratorSession,
  loadGeneratorSession,
  saveGeneratorSession,
} from '@/lib/generator-session';
import {
  KIE_MODELS,
  getDefaultKieAspectRatio,
  getDefaultKieOutputValue,
  getKieOutputOptionsForAspectRatio,
  getKieModelConfig,
} from '@/lib/kie-models';
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
  referenceAssets: SourceAsset[];
  excludedGlobalSourceIds: string[];
  imageUrl?: string;
  serverTaskId?: string;
  providerTaskId?: string;
  status: TaskStatus;
  expanded: boolean;
};

type SourceAsset = {
  id: string;
  name: string;
  dataUrl: string;
};

type GeneratedAsset = {
  id: string;
  taskId: string;
  sourceId: string;
  sourceName: string;
  kind: TaskKind;
  style: string;
  imageUrl?: string;
  serverTaskId?: string;
  providerTaskId?: string;
  status: TaskStatus;
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

const STYLE_LABELS: Record<Locale, Record<string, string>> = {
  zh: {
    'Pure Studio Key Light': '纯净棚拍主光',
    'Minimal Reflection Plinth': '极简反射展台',
    'Soft Shadow Marketplace': '柔和阴影商城图',
    'Color Block Premium': '高级色块主图',
    'Morning Window Lifestyle': '清晨窗边生活场景',
    'Cozy Coffee Counter': '温暖咖啡吧台',
    'Premium Dark Editorial': '高级暗调杂志风',
    'Outdoor Natural Tabletop': '户外自然桌面',
    'Neon Retail Showcase': '霓虹零售展示',
  },
  en: {},
  ja: {
    'Pure Studio Key Light': 'クリーンなスタジオ主光',
    'Minimal Reflection Plinth': 'ミニマル反射台',
    'Soft Shadow Marketplace': '柔らかな影のマーケット画像',
    'Color Block Premium': '上質なカラーブロック',
    'Morning Window Lifestyle': '朝の窓辺ライフスタイル',
    'Cozy Coffee Counter': '居心地のよいカフェカウンター',
    'Premium Dark Editorial': '上質なダーク編集風',
    'Outdoor Natural Tabletop': '屋外ナチュラル卓上',
    'Neon Retail Showcase': 'ネオン小売ショーケース',
  },
  ko: {
    'Pure Studio Key Light': '깔끔한 스튜디오 키라이트',
    'Minimal Reflection Plinth': '미니멀 반사 받침대',
    'Soft Shadow Marketplace': '부드러운 그림자 마켓 이미지',
    'Color Block Premium': '프리미엄 컬러 블록',
    'Morning Window Lifestyle': '아침 창가 라이프스타일',
    'Cozy Coffee Counter': '포근한 커피 카운터',
    'Premium Dark Editorial': '프리미엄 다크 에디토리얼',
    'Outdoor Natural Tabletop': '야외 내추럴 테이블',
    'Neon Retail Showcase': '네온 리테일 쇼케이스',
  },
  es: {
    'Pure Studio Key Light': 'Luz principal de estudio limpio',
    'Minimal Reflection Plinth': 'Pedestal minimalista con reflejo',
    'Soft Shadow Marketplace': 'Marketplace con sombra suave',
    'Color Block Premium': 'Bloques de color premium',
    'Morning Window Lifestyle': 'Lifestyle junto a ventana matinal',
    'Cozy Coffee Counter': 'Mostrador de cafe acogedor',
    'Premium Dark Editorial': 'Editorial oscuro premium',
    'Outdoor Natural Tabletop': 'Mesa natural al aire libre',
    'Neon Retail Showcase': 'Escaparate retail neon',
  },
};

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
    polling: '任务已提交，正在轮询生成结果。',
    providerTask: 'AI 任务',
    batch: '批次',
    batchReady: (credits: number, count: number) =>
      `已创建批次，${count} 个单图任务并发执行，预扣 ${credits} 点。`,
    insufficientCredits: (required: number, available: number) =>
      `点数不足：需要 ${required} 点，当前剩余 ${available} 点。`,
    maxTasksExceeded: (count: number) =>
      `本次会创建 ${count} 个输出任务，单批最多支持 30 个，请减少素材图或任务卡片。`,
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
    resolution: '输出质量',
    modelDefault: '模型默认',
    prompt: '提示词',
    draft: '智能撰写',
    reference: '参考图',
    useGlobal: '默认使用全局商品图',
    globalSources: '全局商品图',
    fallbackDescription: '上传的商品图片',
    excludedGlobalSources: '本任务已排除',
    excludeGlobalSource: '仅从本任务移除',
    restoreGlobalSources: '恢复全局图',
    addReference: '添加参考图',
    removeReference: '移除参考图',
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
    expandTask: '展开任务',
    collapseTask: '收起任务',
    removeTask: '删除任务',
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
    polling: 'Task submitted. Polling for the generated asset.',
    providerTask: 'AI task',
    batch: 'Batch',
    batchReady: (credits: number, count: number) =>
      `Batch created. ${count} single-image tasks are running in parallel, reserving ${credits} credits.`,
    insufficientCredits: (required: number, available: number) =>
      `Insufficient credits: ${required} required, ${available} available.`,
    maxTasksExceeded: (count: number) =>
      `This run would create ${count} output tasks. A single batch supports up to 30; remove some source images or task cards.`,
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
    resolution: 'Output quality',
    modelDefault: 'Model default',
    prompt: 'Prompt',
    draft: 'Smart draft',
    reference: 'Reference image',
    useGlobal: 'Uses global product image by default',
    globalSources: 'Global product images',
    fallbackDescription: 'the uploaded product image',
    excludedGlobalSources: 'Excluded for this task',
    excludeGlobalSource: 'Remove from this task only',
    restoreGlobalSources: 'Restore global images',
    addReference: 'Add reference',
    removeReference: 'Remove reference',
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
    expandTask: 'Expand task',
    collapseTask: 'Collapse task',
    removeTask: 'Remove task',
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
    polling: 'タスクを送信しました。結果を確認しています。',
    providerTask: 'AI タスク',
    batch: 'バッチ',
    batchReady: (credits: number, count: number) =>
      `バッチを作成しました。${count} 件の単画像タスクを並列実行し、${credits} クレジットを予約します。`,
    insufficientCredits: (required: number, available: number) =>
      `クレジット不足：必要 ${required}、残高 ${available}。`,
    maxTasksExceeded: (count: number) =>
      `この実行では ${count} 件の出力タスクが作成されます。1 バッチは最大 30 件までです。素材画像またはタスクカードを減らしてください。`,
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
    resolution: '出力品質',
    modelDefault: 'モデル既定',
    prompt: 'Prompt',
    draft: 'AI 下書き',
    reference: '参照画像',
    useGlobal: '通常は共通の商品画像を使用',
    globalSources: '共通の商品画像',
    fallbackDescription: 'アップロードされた商品画像',
    excludedGlobalSources: 'このタスクから除外',
    excludeGlobalSource: 'このタスクからのみ削除',
    restoreGlobalSources: '共通画像を復元',
    addReference: '参照画像を追加',
    removeReference: '参照画像を削除',
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
    expandTask: 'タスクを展開',
    collapseTask: 'タスクを折りたたむ',
    removeTask: 'タスクを削除',
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
    polling: '작업을 제출했습니다. 생성 결과를 확인 중입니다.',
    providerTask: 'AI 작업',
    batch: '배치',
    batchReady: (credits: number, count: number) =>
      `배치가 생성되었습니다. ${count}개의 단일 이미지 작업을 병렬 실행하고 ${credits} 크레딧을 예약합니다.`,
    insufficientCredits: (required: number, available: number) =>
      `크레딧 부족: ${required} 필요, 현재 ${available}.`,
    maxTasksExceeded: (count: number) =>
      `이번 실행은 ${count}개의 출력 작업을 만듭니다. 단일 배치는 최대 30개까지 지원하므로 이미지나 작업 카드를 줄여 주세요.`,
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
    resolution: '출력 품질',
    modelDefault: '모델 기본값',
    prompt: '프롬프트',
    draft: 'AI 작성',
    reference: '참조 이미지',
    useGlobal: '기본적으로 전역 상품 이미지 사용',
    globalSources: '전역 상품 이미지',
    fallbackDescription: '업로드된 상품 이미지',
    excludedGlobalSources: '이 작업에서 제외됨',
    excludeGlobalSource: '이 작업에서만 제거',
    restoreGlobalSources: '전역 이미지 복원',
    addReference: '참조 추가',
    removeReference: '참조 삭제',
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
    expandTask: '작업 펼치기',
    collapseTask: '작업 접기',
    removeTask: '작업 삭제',
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
    polling: 'Tarea enviada. Consultando el resultado generado.',
    providerTask: 'Tarea AI',
    batch: 'Lote',
    batchReady: (credits: number, count: number) =>
      `Lote creado. ${count} tareas de imagen se ejecutan en paralelo y reservan ${credits} créditos.`,
    insufficientCredits: (required: number, available: number) =>
      `Créditos insuficientes: se necesitan ${required}, tienes ${available}.`,
    maxTasksExceeded: (count: number) =>
      `Esta ejecución crearía ${count} tareas de salida. Un lote admite hasta 30; elimina imágenes fuente o tarjetas de tarea.`,
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
    resolution: 'Calidad de salida',
    modelDefault: 'Predeterminado',
    prompt: 'Prompt',
    draft: 'Redactar con IA',
    reference: 'Imagen de referencia',
    useGlobal: 'Usa la imagen global por defecto',
    globalSources: 'Imagenes globales del producto',
    fallbackDescription: 'la imagen de producto subida',
    excludedGlobalSources: 'Excluidas para esta tarea',
    excludeGlobalSource: 'Quitar solo de esta tarea',
    restoreGlobalSources: 'Restaurar imagenes globales',
    addReference: 'Agregar referencia',
    removeReference: 'Quitar referencia',
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
    expandTask: 'Expandir tarea',
    collapseTask: 'Contraer tarea',
    removeTask: 'Eliminar tarea',
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
  const restoredSessionRef = useRef(false);
  const promptSyncRef = useRef({
    locale,
    description: DEFAULT_DESCRIPTION,
  });
  const { data: session } = authClient.useSession();
  const [sourceAssets, setSourceAssets] = useState<SourceAsset[]>([]);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [credits, setCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('task-main');
  const [batchNotice, setBatchNotice] = useState('');
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
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
    const userId = session?.user?.id;
    if (!userId || restoredSessionRef.current) return;
    const saved = loadGeneratorSession('photo-set', userId);
    if (!saved || saved.tasks.length === 0) return;

    restoredSessionRef.current = true;
    setBatchNotice(t.polling);
    setGeneratedAssets(
      saved.tasks.map((savedTask) => {
        const taskId = savedTask.clientId.includes('__')
          ? savedTask.clientId.split('__')[0]
          : savedTask.clientId;
        const task = tasks.find((item) => item.id === taskId);
        return {
          id: savedTask.clientId,
          taskId,
          sourceId: savedTask.clientId.includes('__')
            ? (savedTask.clientId.split('__')[1] ?? 'restored')
            : 'restored',
          sourceName: savedTask.name,
          kind: task?.kind ?? 'main',
          style: task?.style ?? savedTask.name,
          serverTaskId: savedTask.serverTaskId,
          status: 'rendering' as TaskStatus,
        };
      })
    );
    setTasks((current) =>
      current.map((task) => {
        const savedTask = saved.tasks.find(
          (item) =>
            item.clientId === task.id ||
            item.clientId.startsWith(`${task.id}__`)
        );
        return savedTask
          ? {
              ...task,
              serverTaskId: savedTask.serverTaskId,
              status: 'rendering',
              expanded: true,
            }
          : task;
      })
    );
    setSelectedTaskId(
      saved.tasks[0]?.clientId.includes('__')
        ? (saved.tasks[0]?.clientId.split('__')[0] ?? selectedTaskId)
        : (saved.tasks[0]?.clientId ?? selectedTaskId)
    );
    void pollGenerationTasks(
      saved.tasks.map((task) => task.serverTaskId),
      new Map(saved.tasks.map((task) => [task.serverTaskId, task.clientId])),
      saved.batchId
    );
  }, [session?.user?.id, selectedTaskId, t.polling]);

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
  const creditEstimate = useMemo(
    () =>
      tasks.reduce(
        (sum, task) =>
          sum +
          (getTaskSourceAssets(task).length > 0
            ? estimateTaskCreditCost(task)
            : 0),
        0
      ),
    [tasks, sourceAssets]
  );
  const running = tasks.some((task) =>
    ['queued', 'rendering'].includes(task.status)
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
    const defaultModel = KIE_MODELS[0].id;
    const defaultAspectRatio = getDefaultTaskAspectRatio(defaultModel, kind);
    const defaultResolution = getDefaultKieOutputValue(defaultModel);
    const task: WorkbenchTask = {
      id,
      kind,
      style: kind === 'main' ? MAIN_STYLES[0] : DETAIL_STYLES[0],
      model: defaultModel,
      aspectRatio: defaultAspectRatio,
      resolution: defaultResolution,
      ...createClientPrompt(
        {
          id,
          kind,
          style: kind === 'main' ? MAIN_STYLES[0] : DETAIL_STYLES[0],
          aspectRatio: defaultAspectRatio,
          resolution: defaultResolution,
          model: defaultModel,
          prompt: '',
          reasoning: '',
          keywords: [],
          referenceAssets: [],
          excludedGlobalSourceIds: [],
          status: 'idle',
          expanded: true,
        },
        description,
        locale
      ),
      referenceAssets: [],
      excludedGlobalSourceIds: [],
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

  function getTaskSourceAssets(task: WorkbenchTask): SourceAsset[] {
    const excluded = new Set(task.excludedGlobalSourceIds ?? []);
    return sourceAssets.filter((asset) => !excluded.has(asset.id));
  }

  function getTaskReferenceAssets(task: WorkbenchTask): SourceAsset[] {
    return task.referenceAssets ?? [];
  }

  async function onFilesChange(fileList?: FileList | File[]) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length === 0) return;
    const assets = await Promise.all(
      files.map(async (file) => ({
        id: `source-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        dataUrl: await readFileAsDataUrl(file),
      }))
    );
    setSourceAssets((current) => [...current, ...assets].slice(0, 30));
  }

  function removeSourceAsset(id: string) {
    setSourceAssets((current) => current.filter((asset) => asset.id !== id));
    setTasks((current) =>
      current.map((task) => ({
        ...task,
        excludedGlobalSourceIds: (task.excludedGlobalSourceIds ?? []).filter(
          (sourceId) => sourceId !== id
        ),
      }))
    );
  }

  async function onTaskFilesChange(id: string, fileList?: FileList | File[]) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length === 0) return;
    const assets = await Promise.all(
      files.map(async (file) => ({
        id: `reference-${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        dataUrl: await readFileAsDataUrl(file),
      }))
    );
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              referenceAssets: [
                ...getTaskReferenceAssets(task),
                ...assets,
              ].slice(0, 15),
              imageUrl: undefined,
              status: sourceAssets.length > 0 ? 'ready' : 'idle',
            }
          : task
      )
    );
  }

  function removeTaskReference(id: string, referenceId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              referenceAssets: getTaskReferenceAssets(task).filter(
                (asset) => asset.id !== referenceId
              ),
              imageUrl: undefined,
              status: sourceAssets.length > 0 ? 'ready' : 'idle',
            }
          : task
      )
    );
  }

  function excludeTaskGlobalSource(id: string, sourceId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              excludedGlobalSourceIds: Array.from(
                new Set([...(task.excludedGlobalSourceIds ?? []), sourceId])
              ),
              imageUrl: undefined,
              status:
                getTaskSourceAssets({
                  ...task,
                  excludedGlobalSourceIds: [
                    ...(task.excludedGlobalSourceIds ?? []),
                    sourceId,
                  ],
                }).length > 0
                  ? 'ready'
                  : 'idle',
            }
          : task
      )
    );
  }

  function restoreTaskGlobalSources(id: string) {
    updateTask(id, {
      excludedGlobalSourceIds: [],
      imageUrl: undefined,
      status: sourceAssets.length > 0 ? 'ready' : 'idle',
    });
  }

  function clearTaskReferences(id: string) {
    updateTask(id, {
      referenceAssets: [],
      imageUrl: undefined,
      status: sourceAssets.length > 0 ? 'ready' : 'idle',
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
    const taskSources = getTaskSourceAssets(task);
    if (taskSources.length === 0) return;
    if (!signedIn) {
      setBatchNotice(t.authRequired);
      return;
    }
    const cost = estimateTaskCreditCost(task);
    if (credits < cost) {
      setBatchNotice(t.insufficientCredits(cost, credits));
      return;
    }
    const effectiveDescription = getEffectiveDescription(description, locale);
    const promptPatch = task.prompt.trim()
      ? {}
      : createClientPrompt(task, effectiveDescription, locale);
    await startGeneration([task], promptPatch);
  }

  async function generateAll() {
    const runnable = tasks.filter(
      (task) => getTaskSourceAssets(task).length > 0
    );
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
    const effectiveDescription = getEffectiveDescription(description, locale);
    const generationUnits = runnable.flatMap((task) => {
      const taskSources = getTaskSourceAssets(task);
      const [primarySource, ...additionalSources] = taskSources;
      if (!primarySource) return [];
      return {
        unitId: task.id,
        task,
        source: primarySource,
        references: [...additionalSources, ...getTaskReferenceAssets(task)],
        sourceCount: taskSources.length,
      };
    });
    const fallbackSource = generationUnits[0]?.source ?? sourceAssets[0];
    if (!fallbackSource) return;
    if (generationUnits.length > 30) {
      setBatchNotice(t.maxTasksExceeded(generationUnits.length));
      return;
    }
    const plannedTasks = generationUnits.map(
      ({ unitId, task, source, references }) => ({
        id: unitId,
        kind: task.kind,
        style: task.style,
        aspectRatio: task.aspectRatio,
        resolution: task.resolution,
        model: task.model,
        prompt:
          singlePromptPatch?.prompt ||
          task.prompt.trim() ||
          createClientPrompt(task, effectiveDescription, locale).prompt,
        referenceImageDataUrl: source.dataUrl,
        referenceName: source.name,
        referenceImages: references.map((asset) => ({
          dataUrl: asset.dataUrl,
          name: asset.name,
        })),
      })
    );
    try {
      setBatchNotice('');
      setGeneratedAssets((current) => [
        ...current,
        ...generationUnits.map(({ unitId, task, source, sourceCount }) => ({
          id: unitId,
          taskId: task.id,
          sourceId: source.id,
          sourceName: `${sourceCount} ${t.file}`,
          kind: task.kind,
          style: task.style,
          status: 'queued' as TaskStatus,
        })),
      ]);
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
          productDescription: effectiveDescription,
          sourceImageDataUrl: fallbackSource.dataUrl,
          sourceName: fallbackSource.name || 'source-product.png',
          tasks: plannedTasks,
        },
      });

      if (!batch.ok) {
        setGeneratedAssets((current) =>
          current.filter(
            (asset) => !generationUnits.some((unit) => unit.unitId === asset.id)
          )
        );
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
      if (session?.user?.id) {
        saveGeneratorSession({
          mode: 'photo-set',
          userId: session.user.id,
          batchId: batch.batchId,
          createdAt: Date.now(),
          tasks: batch.tasks.map((task) => ({
            clientId: task.id,
            serverTaskId: task.taskId,
            name: `${task.id}.png`,
          })),
        });
      }

      setTasks((current) =>
        current.map((task) => {
          const submitted = batch.tasks.find((item) => item.id === task.id);
          if (!submitted) return task;
          const promptPatch = task.prompt.trim()
            ? {}
            : createClientPrompt(task, effectiveDescription, locale);
          return {
            ...task,
            ...promptPatch,
            prompt: submitted.prompt,
            model: submitted.model,
            status: 'rendering',
          };
        })
      );
      setGeneratedAssets((current) =>
        current.map((asset) => {
          const submitted = batch.tasks.find((item) => item.id === asset.id);
          return submitted
            ? {
                ...asset,
                serverTaskId: submitted.taskId,
                providerTaskId: submitted.providerTaskId ?? undefined,
                status:
                  submitted.status === 'failed'
                    ? ('failed' as TaskStatus)
                    : ('rendering' as TaskStatus),
              }
            : asset;
        })
      );
      setSelectedTaskId(runnable[0]?.id ?? selectedTaskId);
      await pollGenerationTasks(
        batch.tasks.map((task) => task.taskId),
        new Map(batch.tasks.map((task) => [task.taskId, task.id])),
        batch.batchId
      );
    } catch (error) {
      setBatchNotice(
        error instanceof Error ? error.message : 'Generation failed.'
      );
      setGeneratedAssets((current) =>
        current.map((asset) =>
          generationUnits.some((unit) => unit.unitId === asset.id)
            ? { ...asset, status: 'failed' }
            : asset
        )
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
        const assetId = clientTaskByServerTask.get(status.id);
        if (!assetId) continue;
        const taskId = assetId;
        if (status.status === 'completed' && status.imageUrl) {
          pending.delete(status.id);
          setGeneratedAssets((current) =>
            current.map((asset) =>
              asset.id === assetId
                ? { ...asset, imageUrl: status.imageUrl, status: 'done' }
                : asset
            )
          );
          updateTask(taskId, {
            imageUrl: status.imageUrl,
            status: 'done',
          });
        } else if (status.status === 'failed') {
          pending.delete(status.id);
          setGeneratedAssets((current) =>
            current.map((asset) =>
              asset.id === assetId ? { ...asset, status: 'failed' } : asset
            )
          );
          updateTask(taskId, {
            status: 'failed',
          });
          if (status.errorMessage) setBatchNotice(status.errorMessage);
        } else {
          setGeneratedAssets((current) =>
            current.map((asset) =>
              asset.id === assetId ? { ...asset, status: 'rendering' } : asset
            )
          );
          updateTask(taskId, { status: 'rendering' });
        }
      }
    }
    if (pending.size === 0 && session?.user?.id) {
      clearGeneratorSession('photo-set', session.user.id);
      void refetchHistory();
    } else if (batchId && session?.user?.id) {
      saveGeneratorSession({
        mode: 'photo-set',
        userId: session.user.id,
        batchId,
        createdAt: Date.now(),
        tasks: Array.from(pending).map((serverTaskId) => ({
          serverTaskId,
          clientId: clientTaskByServerTask.get(serverTaskId) ?? serverTaskId,
          name: `${serverTaskId}.png`,
        })),
      });
    }
  }

  return (
    <GeneratorShell
      header={
        <GeneratorWorkbenchHeader
          locale={locale}
          active="photo-set"
          credits={credits}
          refreshDisabled={!signedIn || creditsLoading}
          refreshing={creditsLoading}
          onRefresh={() => void refreshCredits()}
          onLocaleChange={handleLocaleChange}
        />
      }
      columns="lg:grid-cols-[340px_minmax(440px,1fr)_400px]"
      source={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{t.globalTitle}</p>
              <p className="text-[#74796d] text-xs">{t.globalSubtitle}</p>
            </div>
            <Badge variant="outline">{t.globalBadge}</Badge>
          </div>

          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void onFilesChange(event.dataTransfer.files);
            }}
            className={cn(
              'relative flex min-h-28 w-full items-center justify-center',
              'overflow-hidden rounded-xl border border-[#d9ded1]',
              'border-dashed bg-[#fbfcf7] p-3 text-left shadow-sm transition hover:border-[#9aa48d] hover:bg-white'
            )}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-4 rounded-lg p-2 text-left text-[#74796d] transition hover:text-[#20231e]"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#eef1e8] text-[#5e6a58] shadow-inner">
                <IconUpload className="size-7" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-[#2f352c] text-base">
                  {t.upload}
                </span>
                <span className="block text-[#74796d] text-xs">
                  {sourceAssets.length > 0
                    ? `${sourceAssets.length} ${t.file}`
                    : t.globalSubtitle}
                </span>
              </span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              void onFilesChange(event.target.files);
              event.currentTarget.value = '';
            }}
          />

          <div className="mb-5 rounded-lg border border-[#dfe3d8] bg-white p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-[#74796d] text-xs">{t.file}</span>
              <IconPhoto className="size-4 text-[#9aa48d]" />
            </div>
            {sourceAssets.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {sourceAssets.map((asset, index) => (
                  <ImageAssetChip
                    key={asset.id}
                    asset={asset}
                    code={getAssetCode('G', index)}
                    onRemove={() => removeSourceAsset(asset.id)}
                    removeLabel={t.removeTask}
                  />
                ))}
              </div>
            ) : (
              <p className="truncate font-medium text-sm">{t.noFile}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">{t.description}</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-36 resize-none border-[#b7cbbd] bg-white shadow-inner focus-visible:ring-[#2f5f4f]"
            />
          </div>
          {!signedIn ? (
            <p className="mt-3 text-[#72511f] text-sm">{t.authRequired}</p>
          ) : null}
        </div>
      }
      config={
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
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
                className="bg-white text-[#20231e] hover:bg-[#eef1e8] hover:text-[#20231e] active:scale-[0.98]"
                onClick={() => addTask('main')}
              >
                <IconPlus className="size-4" />
                {t.addMain}
              </Button>
              <Button
                type="button"
                className="bg-[#d23b00] text-white hover:bg-[#a82f00] hover:text-white active:scale-[0.98]"
                onClick={() => addTask('detail')}
              >
                <IconPlus className="size-4" />
                {t.addDetail}
              </Button>
            </div>
          </div>

          <GeneratorActionBar
            creditLabel={t.credits}
            creditValue={creditEstimate}
            primaryLabel={t.generateAll}
            primaryDisabled={
              !tasks.some((task) => getTaskSourceAssets(task).length > 0) ||
              running
            }
            primaryLoading={running}
            primaryIcon={<IconWand className="size-4" />}
            onPrimary={() => void generateAll()}
          />

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                t={t}
                locale={locale}
                selected={task.id === selectedTask?.id}
                sourceReady={getTaskSourceAssets(task).length > 0}
                globalSources={sourceAssets}
                baseDescription={description}
                descriptionReady={description.trim().length > 0}
                onSelect={() => setSelectedTaskId(task.id)}
                onRemove={() => removeTask(task.id)}
                onUpdate={(patch) => updateTask(task.id, patch)}
                onTaskFilesChange={(files) =>
                  void onTaskFilesChange(task.id, files)
                }
                onRemoveTaskReference={(referenceId) =>
                  removeTaskReference(task.id, referenceId)
                }
                onClearTaskReferences={() => clearTaskReferences(task.id)}
                onExcludeGlobalSource={(sourceId) =>
                  excludeTaskGlobalSource(task.id, sourceId)
                }
                onRestoreGlobalSources={() => restoreTaskGlobalSources(task.id)}
                onDraft={() => void draftPrompt(task)}
                onRender={() => void renderTask(task)}
              />
            ))}
          </div>
        </div>
      }
      results={
        <Inspector
          task={selectedTask}
          tasks={tasks}
          assets={generatedAssets}
          selectedTaskId={selectedTask?.id}
          onSelectTask={setSelectedTaskId}
          locale={locale}
          t={t}
        />
      }
    />
  );
}

function TaskCard({
  task,
  t,
  locale,
  selected,
  sourceReady,
  globalSources,
  baseDescription,
  descriptionReady,
  onSelect,
  onRemove,
  onUpdate,
  onTaskFilesChange,
  onRemoveTaskReference,
  onClearTaskReferences,
  onExcludeGlobalSource,
  onRestoreGlobalSources,
  onDraft,
  onRender,
}: {
  task: WorkbenchTask;
  t: (typeof WORKBENCH_COPY)[Locale];
  locale: Locale;
  selected: boolean;
  sourceReady: boolean;
  globalSources: SourceAsset[];
  baseDescription: string;
  descriptionReady: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<WorkbenchTask>) => void;
  onTaskFilesChange: (files?: FileList | File[]) => void;
  onRemoveTaskReference: (referenceId: string) => void;
  onClearTaskReferences: () => void;
  onExcludeGlobalSource: (sourceId: string) => void;
  onRestoreGlobalSources: () => void;
  onDraft: () => void;
  onRender: () => void;
}) {
  const styles = task.kind === 'main' ? MAIN_STYLES : DETAIL_STYLES;
  const modelConfig = getKieModelConfig(task.model);
  const outputOptions = getKieOutputOptionsForAspectRatio(
    task.model,
    task.aspectRatio
  );
  const styleLabels = getStyleLabels(locale);
  const resolutionLabel = task.resolution || t.modelDefault;
  const referenceAssets = task.referenceAssets ?? [];
  const excludedGlobalSourceIds = new Set(task.excludedGlobalSourceIds ?? []);
  const activeGlobalSources = globalSources.filter(
    (asset) => !excludedGlobalSourceIds.has(asset.id)
  );
  const excludedGlobalSources = globalSources.filter((asset) =>
    excludedGlobalSourceIds.has(asset.id)
  );

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
            <p className="truncate font-semibold text-sm">
              {getStyleLabel(task.style, locale)}
            </p>
            <p className="text-[#74796d] text-xs">
              {task.aspectRatio} · {resolutionLabel} · {t.statuses[task.status]}
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
            variant="outline"
            aria-label={task.expanded ? t.collapseTask : t.expandTask}
            className="border-[#dfe3d8] bg-[#fbfcf7] text-[#2f352c] shadow-none hover:border-[#2f5f4f]/40 hover:bg-[#eef6f0] hover:text-[#2f5f4f]"
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
            variant="outline"
            aria-label={t.removeTask}
            className="border-[#dfe3d8] bg-[#fbfcf7] text-[#5f6759] shadow-none hover:border-[#d33b00]/30 hover:bg-[#fff1eb] hover:text-[#d33b00]"
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
          <div
            className={cn(
              'grid gap-3',
              modelConfig.outputParam ? 'md:grid-cols-4' : 'md:grid-cols-3'
            )}
          >
            <FieldSelect
              label={t.model}
              value={task.model}
              values={KIE_MODELS.map((model) => model.id)}
              labels={Object.fromEntries(
                KIE_MODELS.map((model) => [model.id, model.label])
              )}
              onChange={(model) => {
                onUpdate({
                  model,
                  aspectRatio: getDefaultTaskAspectRatio(model, task.kind),
                  resolution: getDefaultKieOutputValue(model),
                  imageUrl: undefined,
                  status: 'ready',
                });
              }}
            />
            <FieldSelect
              label={t.style}
              value={task.style}
              values={[...styles]}
              labels={styleLabels}
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
              values={modelConfig.aspectRatios}
              onChange={(aspectRatio) => {
                const nextOutputOptions = getKieOutputOptionsForAspectRatio(
                  task.model,
                  aspectRatio
                );
                onUpdate({
                  aspectRatio,
                  resolution: nextOutputOptions.includes(task.resolution)
                    ? task.resolution
                    : (nextOutputOptions[0] ?? ''),
                });
              }}
            />
            {modelConfig.outputParam ? (
              <FieldSelect
                label={t.resolution}
                value={task.resolution}
                values={outputOptions}
                labels={Object.fromEntries(
                  outputOptions.map((option) => [
                    option,
                    `${option} · ${modelConfig.outputParam?.label}`,
                  ])
                )}
                onChange={(resolution) => onUpdate({ resolution })}
              />
            ) : null}
          </div>

          <div className="rounded-lg border border-[#dfe3d8] bg-[#fbfcf7] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">{t.reference}</p>
                <p className="text-[#74796d] text-xs">
                  {activeGlobalSources.length > 0 ? t.useGlobal : t.noFile}
                  {referenceAssets.length > 0
                    ? ` + R${String(referenceAssets.length).padStart(2, '0')}`
                    : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {referenceAssets.length > 0 ? (
                  <button
                    type="button"
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-[#dfe3d8] bg-white px-2.5 text-[#74796d] hover:border-[#d33b00]/30 hover:bg-[#fff1eb] hover:text-[#d33b00]"
                    aria-label={t.removeReference}
                    onClick={(event) => {
                      event.stopPropagation();
                      onClearTaskReferences();
                    }}
                  >
                    <IconTrash className="size-4" />
                  </button>
                ) : null}
                <label
                  htmlFor={`${task.id}-reference`}
                  className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#dfe3d8] bg-white px-2.5 font-medium text-sm hover:bg-[#eef1e8]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconUpload className="size-4" />
                  {t.addReference}
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[#74796d] text-xs">{t.globalSources}</p>
                {activeGlobalSources.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {activeGlobalSources.map((asset) => {
                      const code = getAssetCode(
                        'G',
                        globalSources.findIndex((item) => item.id === asset.id)
                      );
                      return (
                        <AssetCodeBadge
                          key={asset.id}
                          title={asset.name}
                          actionLabel={t.excludeGlobalSource}
                          onRemove={() => onExcludeGlobalSource(asset.id)}
                        >
                          {code}
                        </AssetCodeBadge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[#74796d] text-xs">{t.noFile}</p>
                )}
              </div>
              {excludedGlobalSources.length > 0 ? (
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-[#74796d] text-xs">
                      {t.excludedGlobalSources}
                    </p>
                    <button
                      type="button"
                      className="font-medium text-[#2f5f4f] text-xs hover:text-[#203f35]"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRestoreGlobalSources();
                      }}
                    >
                      {t.restoreGlobalSources}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {excludedGlobalSources.map((asset) => (
                      <span
                        key={asset.id}
                        className="rounded-md border border-[#ead8cf] bg-[#fff7f3] px-2 py-1 font-semibold text-[#a33b16] text-xs"
                        title={asset.name}
                      >
                        {getAssetCode(
                          'G',
                          globalSources.findIndex(
                            (item) => item.id === asset.id
                          )
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {referenceAssets.length > 0 ? (
                <div>
                  <p className="mb-1 text-[#74796d] text-xs">{t.reference}</p>
                  <div className="grid max-w-md grid-cols-4 gap-2">
                    {referenceAssets.map((asset, index) => (
                      <ImageAssetChip
                        key={asset.id}
                        asset={asset}
                        code={getAssetCode('R', index)}
                        onRemove={() => onRemoveTaskReference(asset.id)}
                        removeLabel={t.removeReference}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <input
              id={`${task.id}-reference`}
              className="hidden"
              type="file"
              accept="image/*"
              multiple
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                onTaskFilesChange(event.target.files);
                event.currentTarget.value = '';
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={`${task.id}-prompt`}>{t.prompt}</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="bg-white text-[#20231e] hover:bg-[#eef1e8] hover:text-[#20231e] active:scale-[0.98]"
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
            className="w-full bg-[#20231e] text-white hover:bg-[#30352d] hover:text-white active:scale-[0.99]"
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
          <span className="truncate">{labels?.[value] ?? value}</span>
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

function ImageAssetChip({
  asset,
  code,
  onRemove,
  removeLabel,
}: {
  asset: SourceAsset;
  code: string;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[#dfe3d8] bg-[#f7f8f4] shadow-sm">
      <img
        src={asset.dataUrl}
        alt={asset.name}
        className="aspect-square w-full object-cover"
      />
      <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1 rounded bg-[#20231e]/80 px-1.5 py-0.5 text-white">
        <span className="font-semibold text-[10px] leading-4">{code}</span>
        <button
          type="button"
          className="rounded text-white/80 hover:bg-white/15 hover:text-white"
          aria-label={removeLabel}
          title={asset.name}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <IconTrash className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function AssetCodeBadge({
  children,
  title,
  actionLabel,
  onRemove,
}: {
  children: string;
  title?: string;
  actionLabel?: string;
  onRemove?: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border border-[#dfe3d8] bg-white px-2 py-1 font-semibold text-[#2f352c] text-xs"
      title={title}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          className="-mr-1 rounded p-0.5 text-[#8b9286] hover:bg-[#fff1eb] hover:text-[#d33b00]"
          aria-label={actionLabel}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <IconTrash className="size-3" />
        </button>
      ) : null}
    </span>
  );
}

function Inspector({
  task,
  tasks,
  assets,
  selectedTaskId,
  onSelectTask,
  locale,
  t,
}: {
  task?: WorkbenchTask;
  tasks: WorkbenchTask[];
  assets: GeneratedAsset[];
  selectedTaskId?: string;
  onSelectTask: (id: string) => void;
  locale: Locale;
  t: (typeof WORKBENCH_COPY)[Locale];
}) {
  const completedAssets = assets.filter((item) => item.imageUrl);
  const selectedAsset =
    completedAssets.find((item) => item.taskId === task?.id) ??
    completedAssets[0];
  const totalAssets = Math.max(assets.length, tasks.length);
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
          {t.currentTask}: {getStyleLabel(task.style, locale)}
        </p>
      </div>

      <div className="rounded-lg border border-[#dfe3d8] bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-semibold text-sm">{t.resultAssets}</p>
          <span className="text-[#74796d] text-xs">
            {completedAssets.length}/{totalAssets}
          </span>
        </div>
        {completedAssets.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {completedAssets.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTask(item.taskId)}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-md border bg-[#f7f8f4]',
                  'transition hover:border-[#2f5f4f] focus:outline-none focus:ring-2 focus:ring-[#2f5f4f]/30',
                  selectedTaskId === item.taskId
                    ? 'border-[#2f5f4f] ring-2 ring-[#2f5f4f]/20'
                    : 'border-[#dfe3d8]'
                )}
              >
                <img
                  src={item.imageUrl}
                  alt={`${getStyleLabel(item.style, locale)} generated asset`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-1 bottom-1 truncate rounded bg-[#20231e]/80 px-1.5 py-0.5 text-[10px] text-white">
                  {item.kind === 'main' ? t.main : t.detail} · {item.sourceName}
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
        ) : selectedAsset?.imageUrl ? (
          <img
            src={selectedAsset.imageUrl}
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

      {selectedAsset?.imageUrl ? (
        <Button
          type="button"
          className="w-full"
          onClick={() =>
            void downloadFile(
              selectedAsset.imageUrl!,
              `suite-workbench-${selectedAsset.id}.png`
            )
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
          <dd className="text-right">{task.resolution || t.modelDefault}</dd>
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

function getEffectiveDescription(description: string, locale: Locale) {
  const trimmed = description.trim();
  if (trimmed.length >= 4) return trimmed;
  return WORKBENCH_COPY[locale].fallbackDescription;
}

function createInitialTasks(
  description: string,
  locale: Locale = 'zh'
): WorkbenchTask[] {
  const defaultModel = KIE_MODELS[0].id;
  const defaultMainAspectRatio = getDefaultTaskAspectRatio(
    defaultModel,
    'main'
  );
  const defaultDetailAspectRatio = getDefaultTaskAspectRatio(
    defaultModel,
    'detail'
  );
  const defaultResolution = getDefaultKieOutputValue(defaultModel);
  const mainTask: WorkbenchTask = {
    id: 'task-main',
    kind: 'main',
    style: MAIN_STYLES[0],
    model: defaultModel,
    aspectRatio: defaultMainAspectRatio,
    resolution: defaultResolution,
    prompt: '',
    reasoning: '',
    keywords: [],
    referenceAssets: [],
    excludedGlobalSourceIds: [],
    status: 'idle',
    expanded: true,
  };
  const detailTask: WorkbenchTask = {
    id: 'task-detail',
    kind: 'detail',
    style: DETAIL_STYLES[0],
    model: defaultModel,
    aspectRatio: defaultDetailAspectRatio,
    resolution: defaultResolution,
    prompt: '',
    reasoning: '',
    keywords: [],
    referenceAssets: [],
    excludedGlobalSourceIds: [],
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

function getStyleLabels(locale: Locale) {
  return Object.fromEntries(
    [...MAIN_STYLES, ...DETAIL_STYLES].map((style) => [
      style,
      getStyleLabel(style, locale),
    ])
  );
}

function getStyleLabel(style: string, locale: Locale) {
  return STYLE_LABELS[locale][style] ?? style;
}

function getDefaultTaskAspectRatio(model: string, kind: TaskKind) {
  if (kind === 'main') return getDefaultKieAspectRatio(model);
  const aspectRatios = getKieModelConfig(model).aspectRatios;
  return (
    ['3:4', '9:16', '4:5', '2:3'].find((ratio) =>
      aspectRatios.includes(ratio)
    ) ?? getDefaultKieAspectRatio(model)
  );
}

function getAssetCode(prefix: string, index: number) {
  return `${prefix}${String(index + 1).padStart(2, '0')}`;
}

function getClientReasoning(locale: Locale, isMain: boolean) {
  const copy = {
    zh: isMain
      ? '用纯净构图和高级布光突出商品轮廓，让主图更适合投放和货架展示。'
      : '用竖版多板块结构呈现商品场景、材质细节和卖点信息，让结果更接近电商详情页长图。',
    en: isMain
      ? 'A clean composition and premium lighting make the product suitable for marketplace hero placement.'
      : 'A vertical multi-section layout shows lifestyle context, material closeups, and selling points like an ecommerce detail-page image.',
    ja: isMain
      ? 'クリーンな構図と上質な照明で商品輪郭を強調し、EC の主画像に適した見え方にします。'
      : '縦長の複数セクションで利用シーン、素材のディテール、訴求ポイントを見せ、EC 詳細ページらしく構成します。',
    ko: isMain
      ? '깔끔한 구도와 고급 조명으로 상품 윤곽을 강조해 마켓플레이스 메인 이미지에 적합하게 만듭니다.'
      : '세로형 다중 섹션으로 사용 장면, 소재 디테일, 핵심 포인트를 보여 주어 이커머스 상세페이지처럼 구성합니다.',
    es: isMain
      ? 'Una composición limpia y luz premium hacen que el producto funcione como imagen principal de marketplace.'
      : 'Un diseño vertical con varias secciones muestra contexto, detalles de material y puntos de venta como una imagen de ficha ecommerce.',
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
        : '画面用于电商详情页长图，请生成竖版信息型版式，而不是单张主图。使用 3 到 4 个上下分区：顶部生活场景展示商品，中段展示材质纹理和工艺细节，下段展示使用方式、尺寸感或核心卖点。整体像高级详情页视觉海报，可包含抽象信息块、图标感标签和留白，但不要生成可读文字。',
      '严格保留商品原始形状、轮廓、材质、颜色、标签和几何结构。',
      '只允许调整背景、光线、阴影、反射、氛围和版式，不要改动商品本体。',
    ],
    en: [
      'Create a photorealistic ecommerce image using the uploaded product as the immutable source.',
      `Product description: ${description}.`,
      `Style direction: ${style}.`,
      isMain
        ? 'Use a marketplace-ready hero composition with the product centered and a premium studio background.'
        : 'Create a vertical ecommerce detail-page poster, not a single hero image. Use 3 to 4 stacked sections: top lifestyle product scene, middle material and craftsmanship closeups, lower usage context, scale cues, or key selling-point panels. The layout should feel like a premium product detail page with abstract info blocks, icon-like badges, and clean spacing, but do not generate readable text.',
      'Preserve the exact product shape, silhouette, material, color, labels, and geometry.',
      'Change only the background, lighting, shadow, reflection, atmosphere, and page layout.',
    ],
    ja: [
      'アップロードした商品画像を不変の主体として、高精細な EC 商品画像を生成してください。',
      `商品説明：${description}。`,
      `スタイル方針：${style}。`,
      isMain
        ? 'マーケットプレイス向け主画像として、商品を中央に配置し、上質なスタジオ背景で構成します。'
        : '単一の主画像ではなく、縦長の EC 詳細ページ用ビジュアルとして構成してください。上から 3〜4 セクションに分け、上部は利用シーン、中段は素材感や工芸ディテール、下段は使用方法、サイズ感、主要な訴求ポイントを表現します。抽象的な情報ブロックやアイコン風ラベル、余白を使って高級な商品詳細ページらしくし、読める文字は生成しないでください。',
      '商品の形状、輪郭、素材、色、ラベル、幾何構造は厳密に維持してください。',
      '変更してよいのは背景、照明、影、反射、空気感、ページ構成のみです。',
    ],
    ko: [
      '업로드한 상품 이미지를 변경 불가한 기준으로 사용해 사실적인 이커머스 이미지를 생성하세요.',
      `상품 설명: ${description}.`,
      `스타일 방향: ${style}.`,
      isMain
        ? '마켓플레이스용 메인 이미지처럼 상품을 중앙에 두고 프리미엄 스튜디오 배경으로 구성합니다.'
        : '단일 메인 이미지가 아니라 세로형 이커머스 상세페이지 포스터로 구성하세요. 위에서 아래로 3~4개의 섹션을 만들고, 상단은 라이프스타일 상품 장면, 중간은 소재 질감과 공예 디테일, 하단은 사용 방식, 크기감 또는 핵심 판매 포인트 패널을 보여 주세요. 추상 정보 블록, 아이콘 느낌의 배지, 깔끔한 여백은 허용하지만 읽을 수 있는 텍스트는 만들지 마세요.',
      '상품의 형태, 윤곽, 재질, 색상, 라벨, 기하 구조를 정확히 유지하세요.',
      '배경, 조명, 그림자, 반사, 분위기, 페이지 레이아웃만 변경하고 상품 본체는 바꾸지 마세요.',
    ],
    es: [
      'Genera una imagen ecommerce fotorrealista usando el producto subido como fuente inmutable.',
      `Descripción del producto: ${description}.`,
      `Dirección de estilo: ${style}.`,
      isMain
        ? 'Usa una composición principal lista para marketplace, con el producto centrado y fondo de estudio premium.'
        : 'Crea un poster vertical para una página de detalle ecommerce, no una sola imagen principal. Usa 3 o 4 secciones apiladas: escena lifestyle superior, primeros planos de material y acabado en el centro, y contexto de uso, escala o paneles de beneficios en la parte inferior. Debe parecer una página de detalle premium con bloques informativos abstractos, etiquetas tipo icono y buen espacio en blanco, pero sin texto legible.',
      'Conserva exactamente la forma, silueta, material, color, etiquetas y geometría del producto.',
      'Cambia solo el fondo, la iluminación, la sombra, el reflejo, la atmósfera y el layout.',
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
