import { authClient } from '@/auth/client';
import type { ApiKey } from '@/db/types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const apiKeysKeys = {
  all: (userId: string) => ['apikeys', userId] as const,
  lists: (userId: string) => [...apiKeysKeys.all(userId), 'lists'] as const,
  list: (userId: string, params: { pageIndex: number; pageSize: number }) =>
    [...apiKeysKeys.lists(userId), params] as const,
};

export function useApiKeys(pageIndex: number, pageSize: number) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useQuery({
    queryKey: apiKeysKeys.list(userId, { pageIndex, pageSize }),
    queryFn: async () => {
      const result = await authClient.apiKey.list({
        query: {
          limit: pageSize,
          offset: pageIndex * pageSize,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch API keys');
      }

      const items = (result.data ?? []) as ApiKey[];
      return { items, total: items.length };
    },
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const { data, error } = await authClient.apiKey.create({ name });

      if (error) {
        throw new Error(error.message || 'Failed to create API key');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(userId) });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useMutation({
    mutationFn: async ({ keyId }: { keyId: string }) => {
      const { error } = await authClient.apiKey.delete({ keyId });

      if (error) {
        throw new Error(error.message || 'Failed to delete API key');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.all(userId) });
    },
  });
}
