import { getCurrentPlan } from '@/api/payment';
import type { PricePlan, Subscription } from '@/payment/types';
import { useQuery } from '@tanstack/react-query';

export type CurrentPlanResult = {
  currentPlan: PricePlan | null;
  subscription: Subscription | null;
};

export function useCurrentPlan(userId: string | undefined) {
  return useQuery({
    queryKey: ['currentPlan', userId],
    queryFn: async () => {
      if (!userId) throw new Error('userId required');
      return getCurrentPlan({ data: { userId } });
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
}
