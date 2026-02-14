import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const logoLight = websiteConfig.metadata?.images?.logoLight ?? '/logo.png';
  const logoDark = websiteConfig.metadata?.images?.logoDark ?? logoLight;
  return (
    <>
      <img
        src={logoLight}
        alt="Logo"
        className={cn('size-8 rounded-md dark:hidden', className)}
        width={32}
        height={32}
      />
      <img
        src={logoDark}
        alt="Logo"
        className={cn('size-8 rounded-md hidden dark:block', className)}
        width={32}
        height={32}
      />
    </>
  );
}
