import { Link } from '@tanstack/react-router';
import { Logo } from '@/components/layout/logo';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4">
      <Logo className="size-12" />
      <h1 className="text-4xl font-bold">Not Found</h1>
      <p className="text-balance text-center text-xl font-medium text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className={cn(buttonVariants({ size: 'lg', variant: 'default' }))}
      >
        Back to Home
      </Link>
    </div>
  );
}
