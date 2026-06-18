import { STORAGE_POLICY } from '@/lib/product-generation';

export type ProductPlanCode = 'free' | 'pro' | 'studio';
export type ProductAssetKind = 'source' | 'output' | 'thumbnail' | 'mask';

export function getRetentionDays(plan: ProductPlanCode) {
  if (plan === 'studio') return STORAGE_POLICY.studioRetentionDays;
  if (plan === 'pro') return STORAGE_POLICY.proRetentionDays;
  return STORAGE_POLICY.freeRetentionDays;
}

export function getAssetExpiresAt({
  plan,
  createdAt = new Date(),
}: {
  plan: ProductPlanCode;
  createdAt?: Date;
}) {
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + getRetentionDays(plan));
  return expiresAt;
}

export function buildProductAssetKey({
  userId,
  projectId,
  batchId,
  taskId,
  kind,
  filename,
}: {
  userId: string;
  projectId: string;
  batchId?: string;
  taskId?: string;
  kind: ProductAssetKind;
  filename: string;
}) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (kind === 'source') {
    return `users/${userId}/projects/${projectId}/source/${safeFilename}`;
  }
  if (!batchId || !taskId) {
    throw new Error('batchId and taskId are required for generated assets.');
  }
  return `users/${userId}/projects/${projectId}/batches/${batchId}/tasks/${taskId}/${kind}/${safeFilename}`;
}

export function shouldKeepOriginalAsset({
  plan,
  now = new Date(),
  expiresAt,
}: {
  plan: ProductPlanCode;
  now?: Date;
  expiresAt?: Date | null;
}) {
  if (plan === 'studio') return true;
  if (!expiresAt) return true;
  return expiresAt.getTime() > now.getTime();
}
