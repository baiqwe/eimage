import { Logo } from '@/components/layout/logo';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

function IntegrationCard({
  children,
  className,
  borderClassName,
}: {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex size-20 rounded-xl bg-muted dark:bg-muted/50',
        className
      )}
    >
      <div
        role="presentation"
        className={cn('absolute inset-0 rounded-xl border', borderClassName)}
      />
      <div className="relative z-20 m-auto size-fit flex items-center justify-center [&>*]:size-8">
        {children}
      </div>
    </div>
  );
}

export default function Integration2Section() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center sm:grid-cols-2">
          <div className="relative mx-auto w-fit">
            <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
              <IntegrationCard>
                <div className="rounded bg-muted-foreground/20 size-8" />
              </IntegrationCard>
              <IntegrationCard>
                <div className="rounded bg-muted-foreground/20 size-8" />
              </IntegrationCard>
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              <IntegrationCard>
                <div className="rounded bg-muted-foreground/20 size-8" />
              </IntegrationCard>
              <IntegrationCard
                borderClassName="border-black/25 dark:border-white/25"
                className="dark:bg-muted"
              >
                <Logo />
              </IntegrationCard>
              <IntegrationCard>
                <div className="rounded bg-muted-foreground/20 size-8" />
              </IntegrationCard>
            </div>
            <div className="mx-auto flex w-fit justify-center gap-2">
              <IntegrationCard>
                <div className="rounded bg-muted-foreground/20 size-8" />
              </IntegrationCard>
              <IntegrationCard>
                <div className="rounded bg-muted-foreground/20 size-8" />
              </IntegrationCard>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Integrates with your favorite tools
            </h2>
            <p className="text-muted-foreground">
              Connect to APIs, databases, and services with a few lines of code.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link to="/" className={cn(buttonVariants({ size: 'lg' }))}>
                Get started
              </Link>
              <Link
                to="/"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' })
                )}
              >
                View docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
