import { getCurrentPlan } from '@/api/payment';
import { authClient } from '@/auth/client';
import { useQuery } from '@tanstack/react-query';

export const paymentKeys = {
  all: (userId: string) => ['payment', userId] as const,
  currentPlan: (userId: string) => [...paymentKeys.all(userId), 'currentPlan'] as const,
};

export function useCurrentPlan(enabled = true) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? '';

  return useQuery({
    queryKey: paymentKeys.currentPlan(userId),
    queryFn: async () => {
      return getCurrentPlan();
    },
    enabled: enabled && !!userId,
    refetchOnWindowFocus: true,
  });
}
