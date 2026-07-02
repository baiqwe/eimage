import type { ReactNode } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function GeneratorShell({
  header,
  source,
  config,
  results,
  children,
  columns = 'lg:grid-cols-[360px_minmax(0,1fr)_420px]',
}: {
  header: ReactNode;
  source: ReactNode;
  config: ReactNode;
  results: ReactNode;
  children?: ReactNode;
  columns?: string;
}) {
  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#20231e]">
      {header}
      <section
        className={cn('grid min-h-[calc(100vh-4rem)] grid-cols-1', columns)}
      >
        <aside className="min-w-0 border-[#dfe3d8] border-b bg-[#fbfcf7] p-4 lg:border-r lg:border-b-0">
          {source}
        </aside>
        <section className="min-w-0 bg-[#f7f8f4] p-4 md:p-6">{config}</section>
        <aside className="min-w-0 border-[#dfe3d8] border-t bg-[#fbfcf7] p-4 lg:border-t-0 lg:border-l">
          {results}
        </aside>
      </section>
      {children}
    </main>
  );
}

export function GeneratorPanel({
  title,
  description,
  eyebrow,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm',
        className
      )}
    >
      {title || description || eyebrow || action ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-semibold text-[#2f5f4f] text-sm">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="mt-1 font-semibold text-xl tracking-tight">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-[#74796d] text-sm leading-6">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function GeneratorActionBar({
  creditLabel,
  creditValue,
  balanceLabel,
  balanceValue,
  primaryLabel,
  primaryDisabled,
  primaryLoading,
  primaryIcon,
  notice,
  secondary,
  onPrimary,
}: {
  creditLabel: string;
  creditValue: number;
  balanceLabel?: string;
  balanceValue?: number;
  primaryLabel: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  primaryIcon?: ReactNode;
  notice?: ReactNode;
  secondary?: ReactNode;
  onPrimary: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#dfe3d8] bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-md border border-[#dfe3d8] bg-[#fbfcf7] px-3 py-2 text-sm">
          {creditLabel}: <strong>{creditValue}</strong>
        </div>
        {typeof balanceValue === 'number' && balanceLabel ? (
          <div className="rounded-md border border-[#dfe3d8] bg-[#fbfcf7] px-3 py-2 text-sm">
            {balanceLabel}: <strong>{balanceValue}</strong>
          </div>
        ) : null}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {secondary}
          <Button
            type="button"
            className="bg-[#20231e] text-white hover:bg-[#30352d] hover:text-white active:scale-[0.98]"
            disabled={primaryDisabled || primaryLoading}
            onClick={onPrimary}
          >
            {primaryLoading ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              primaryIcon
            )}
            {primaryLabel}
          </Button>
        </div>
      </div>
      {notice ? (
        <div className="mt-3 rounded-md border border-[#eadfca] bg-[#fff8ea] px-3 py-2 text-[#8a5a16] text-sm">
          {notice}
        </div>
      ) : null}
    </div>
  );
}

export function GeneratorResultPanel({
  title,
  summary,
  action,
  empty,
  children,
}: {
  title: ReactNode;
  summary?: ReactNode;
  action?: ReactNode;
  empty?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <GeneratorPanel
      title={title}
      description={summary}
      action={action}
      className="h-full"
    >
      {children ?? (
        <div className="min-h-[520px] rounded-lg border border-dashed border-[#dfe3d8] bg-[#fbfcf7]">
          {empty}
        </div>
      )}
    </GeneratorPanel>
  );
}
