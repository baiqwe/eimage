export type ProductLocale = 'zh' | 'en' | 'ja' | 'ko' | 'es';
export type ProductImageKind = 'main' | 'detail';
export type ProductTaskStatus =
  | 'idle'
  | 'drafting'
  | 'ready'
  | 'queued'
  | 'rendering'
  | 'done'
  | 'failed';

export type ProductGenerationTaskInput = {
  id: string;
  kind: ProductImageKind;
  style: string;
  aspectRatio: string;
  resolution?: string;
  prompt: string;
  referenceName?: string;
};

export type ProductGenerationTaskPlan = ProductGenerationTaskInput & {
  providerTaskId: string;
  creditCost: number;
  storagePrefix: string;
  status: 'queued';
};

export type ProductGenerationBatchPlan = {
  batchId: string;
  projectId: string;
  totalCreditCost: number;
  tasks: ProductGenerationTaskPlan[];
};

export const CREDIT_COST = {
  oneK: 10,
  twoK: 20,
  fourK: 40,
} as const;

export const STORAGE_POLICY = {
  freeRetentionDays: 7,
  proRetentionDays: 90,
  studioRetentionDays: 365,
  maxSourceImageBytes: 12 * 1024 * 1024,
  maxOutputImageBytes: 8 * 1024 * 1024,
  thumbnailWidth: 512,
} as const;

export function estimateTaskCreditCost(task: { resolution?: string }) {
  const tier = getResolutionCreditTier(task.resolution);
  return {
    '1K': CREDIT_COST.oneK,
    '2K': CREDIT_COST.twoK,
    '4K': CREDIT_COST.fourK,
  }[tier];
}

export function getResolutionCreditTier(resolution?: string) {
  if (!resolution || resolution === 'basic' || resolution === 'model-default') {
    return '1K';
  }
  if (resolution === '4K' || resolution === '2K' || resolution === '1K') {
    return resolution;
  }
  const [width, height] = parseResolution(resolution);
  const longestSide = Math.max(width, height);
  if (longestSide >= 3072) return '4K';
  if (longestSide >= 1536) return '2K';
  return '1K';
}

export function createGenerationBatchPlan({
  userId,
  projectId,
  tasks,
}: {
  userId: string;
  projectId: string;
  tasks: ProductGenerationTaskInput[];
}): ProductGenerationBatchPlan {
  const batchId = createStableId('batch');
  const plannedTasks = tasks.map((task) => {
    const providerTaskId = createStableId('task');
    return {
      ...task,
      providerTaskId,
      creditCost: estimateTaskCreditCost(task),
      storagePrefix: buildGenerationStoragePrefix({
        userId,
        projectId,
        batchId,
        taskId: task.id,
      }),
      status: 'queued' as const,
    };
  });

  return {
    batchId,
    projectId,
    tasks: plannedTasks,
    totalCreditCost: plannedTasks.reduce(
      (sum, task) => sum + task.creditCost,
      0
    ),
  };
}

export function buildGenerationStoragePrefix({
  userId,
  projectId,
  batchId,
  taskId,
}: {
  userId: string;
  projectId: string;
  batchId: string;
  taskId: string;
}) {
  return `users/${userId}/projects/${projectId}/batches/${batchId}/tasks/${taskId}`;
}

export function buildOutputAltText({
  locale,
  productDescription,
  kind,
  style,
  aspectRatio,
}: {
  locale: ProductLocale;
  productDescription: string;
  kind: ProductImageKind;
  style: string;
  aspectRatio: string;
}) {
  return {
    zh: `${productDescription}的${kind === 'main' ? '电商主图' : '详情页场景图'}，${style} 风格，${aspectRatio} 比例，保持商品原始形貌`,
    en: `${productDescription} ${kind === 'main' ? 'marketplace main image' : 'detail page lifestyle image'} in ${style} style, ${aspectRatio} aspect ratio, preserving the original product shape`,
    ja: `${productDescription}の${kind === 'main' ? 'EC 主画像' : '詳細ページ用シーン画像'}、${style} スタイル、${aspectRatio} 比率、商品の元の形状を維持`,
    ko: `${productDescription} ${kind === 'main' ? '이커머스 메인 이미지' : '상세 페이지 장면 이미지'}, ${style} 스타일, ${aspectRatio} 비율, 원본 상품 형태 유지`,
    es: `${productDescription}, ${kind === 'main' ? 'imagen principal ecommerce' : 'escena de detalle'}, estilo ${style}, proporción ${aspectRatio}, conservando la forma original del producto`,
  }[locale];
}

export function parseResolution(resolution: string) {
  const match = resolution.match(/^(\d+)x(\d+)$/);
  if (!match) return [1024, 1024] as const;
  return [Number(match[1]), Number(match[2])] as const;
}

function createStableId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
