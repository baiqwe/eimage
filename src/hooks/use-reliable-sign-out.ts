import { authClient } from '@/auth/client';
import { PRODUCT_LOCALES } from '@/components/product/product-locale';
import { messages } from '@/messages';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const SIGN_OUT_TIMEOUT_MS = 4500;

function getLocalizedHomePath() {
  if (typeof window === 'undefined') return '/';
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return PRODUCT_LOCALES.includes(firstSegment as never)
    ? `/${firstSegment}`
    : '/';
}

function waitForTimeout() {
  return new Promise<'timeout'>((resolve) => {
    window.setTimeout(() => resolve('timeout'), SIGN_OUT_TIMEOUT_MS);
  });
}

export function useReliableSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    const homePath = getLocalizedHomePath();

    try {
      toast.loading(`${messages.auth.common.logout}...`, {
        id: 'sign-out',
      });
      await Promise.race([authClient.signOut(), waitForTimeout()]);
      toast.success(messages.auth.common.logout, { id: 'sign-out' });

      await router.invalidate();
      if (typeof window !== 'undefined') {
        window.location.assign(homePath);
      } else {
        await router.navigate({ to: homePath });
      }
    } catch (error) {
      toast.error(messages.auth.common.logoutFailed, { id: 'sign-out' });
      console.error('sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, router]);

  return { isSigningOut, signOut };
}
