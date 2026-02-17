import { ClientScript } from '@/components/layout/client-script';
import { clientEnv } from '@/env/client';

/**
 * Plausible Analytics
 * https://plausible.io
 */
export function PlausibleAnalytics() {
  if (!import.meta.env.PROD) return null;
  const domain = clientEnv.VITE_PLAUSIBLE_DOMAIN;
  const script = clientEnv.VITE_PLAUSIBLE_SCRIPT;
  if (!domain || !script) return null;

  return <ClientScript src={script} defer dataAttributes={{ domain }} />;
}
