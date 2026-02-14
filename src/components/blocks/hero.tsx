import { buttonVariants } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { IconArrowRight } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <main id="hero" className="overflow-hidden">
      <section>
        <div className="relative pt-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <a
                href="https://x.com/mkfast"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-accent group mx-auto flex w-fit items-center gap-2 rounded-full border p-1 pl-4"
              >
                <span className="text-foreground text-sm">
                  Introducing MkFast – the best AI SaaS boilerplate
                </span>
                <span className="flex size-6">
                  <IconArrowRight className="m-auto size-3" />
                </span>
              </a>

              <h1 className="mt-8 text-balance text-5xl font-bold lg:mt-16 xl:text-[5rem]">
                Make AI SaaS in days, simply and effortlessly
              </h1>

              <p className="mx-auto mt-8 max-w-4xl text-balance text-lg text-muted-foreground">
                MkFast is a modern SaaS starter with auth, payments, and AI
                features. Build your product faster with a solid foundation.
              </p>

              <div className="mt-12 flex flex-row items-center justify-center gap-4">
                <Link
                  to="/"
                  hash="pricing"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'rounded-xl px-5 text-base'
                  )}
                >
                  Get Started
                </Link>
                <Link
                  to="/"
                  hash="features"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'outline' }),
                    'h-10 rounded-xl px-5'
                  )}
                >
                  See Demo
                </Link>
              </div>
            </div>

            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div className="bg-muted/50 ring-muted/50 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg ring-1">
                <img
                  src="https://cdn.mksaas.com/blocks/music.png"
                  alt="App screen"
                  className="hidden w-full rounded-2xl dark:block"
                />
                <img
                  src="https://cdn.mksaas.com/blocks/music-light.png"
                  alt="App screen"
                  className="w-full rounded-2xl border border-border/25 dark:hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
