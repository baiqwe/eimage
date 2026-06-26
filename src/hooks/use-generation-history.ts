import {
  getGenerationCredits,
  getGenerationBatchDetail,
  getGenerationStats,
  listGenerationBatches,
} from '@/api/generation';
import { authClient } from '@/auth/client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const generationHistoryKeys = {
  all: (userId: string) => ['generation-history', userId] as const,
  lists: (userId: string) =>
    [...generationHistoryKeys.all(userId), 'lists'] as const,
  list: (userId: string, params: { pageIndex: number; pageSize: number }) =>
    [...generationHistoryKeys.lists(userId), params] as const,
  detail: (userId: string, batchId: string) =>
    [...generationHistoryKeys.all(userId), 'detail', batchId] as const,
  stats: (userId: string) =>
    [...generationHistoryKeys.all(userId), 'stats'] as const,
  credits: (userId: string) =>
    [...generationHistoryKeys.all(userId), 'credits'] as const,
};

/**
 * Fetches user's generation batch list
 */
export function useGenerationBatches(pageIndex: number, pageSize: number) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useQuery({
    queryKey: generationHistoryKeys.list(userId, { pageIndex, pageSize }),
    queryFn: () => listGenerationBatches({ data: { pageIndex, pageSize } }),
    placeholderData: keepPreviousData,
    enabled: !!userId,
  });
}

/**
 * Fetches batch detail with tasks and outputs
 */
export function useGenerationBatchDetail(batchId: string | undefined) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useQuery({
    queryKey: generationHistoryKeys.detail(userId, batchId ?? ''),
    queryFn: () => getGenerationBatchDetail({ data: { batchId: batchId! } }),
    enabled: !!userId && !!batchId,
  });
}

/**
 * Fetches generation stats for dashboard
 */
export function useGenerationStats() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useQuery({
    queryKey: generationHistoryKeys.stats(userId),
    queryFn: () => getGenerationStats(),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}

export function useGenerationCredits() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useQuery({
    queryKey: generationHistoryKeys.credits(userId),
    queryFn: () => getGenerationCredits(),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}
