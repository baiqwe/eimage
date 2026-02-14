import { buttonVariants } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

export default function CallToActionSection() {
  return (
    <section id="call-to-action" className="bg-muted/50 px-4 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of teams building with MkFast today.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/auth/register"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Get started free
            </Link>
            <Link
              to="/"
              hash="pricing"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
