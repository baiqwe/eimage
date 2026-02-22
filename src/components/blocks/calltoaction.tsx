import { buttonVariants } from '@/components/ui/button';
import { messages } from '@/messages';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

const m = messages.homePage.calltoaction;

export default function CallToActionSection() {
  return (
    <section id="call-to-action" className="bg-muted/50 px-4 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            {m.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{m.description}</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/auth/register"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              <span>{m.primaryButton}</span>
            </Link>
            <Link
              to="/"
              hash="pricing"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              <span>{m.secondaryButton}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
