import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { messages } from '@/messages';
import { getCanonicalUrl, getMailtoUrl } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { IconBrandX, IconMail } from '@tabler/icons-react';

const m = messages.about;

export const Route = createFileRoute('/(pages)/about')({
  head: () => ({
    meta: [
      {
        title: `${m.title} | ${websiteConfig.metadata?.name}`,
      },
      { name: 'description', content: m.description },
    ],
    links: [{ rel: 'canonical', href: getCanonicalUrl('/about') }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const twitter = websiteConfig.social?.twitter;
  const supportEmailHref = getMailtoUrl(websiteConfig.mail?.supportEmail);

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="relative mx-auto mb-24 mt-8 max-w-[--breakpoint-md] md:mt-16">
          <div className="mx-auto flex flex-col justify-between">
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Avatar and name */}
              <div className="flex items-center gap-8">
                <Avatar className="size-32 p-0.5">
                  <AvatarImage
                    className="rounded-full border-4 border-border"
                    src="/logo.png"
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    <div className="size-32 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl text-foreground">
                    {websiteConfig.metadata?.name}
                  </h1>
                  <p className="mt-2 text-base text-muted-foreground">
                    {m.bio}
                  </p>
                </div>
              </div>

              {/* Introduction and social */}
              <div>
                <p className="mb-8 text-base text-muted-foreground">
                  {m.introduction}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  {twitter && (
                    <a
                      href={twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'rounded-lg'
                      )}
                    >
                      <IconBrandX className="mr-1 size-4" />
                      {m.followUs}
                    </a>
                  )}
                  {supportEmailHref && (
                    <a
                      href={supportEmailHref}
                      className={cn(
                        buttonVariants(),
                        'rounded-lg inline-flex items-center'
                      )}
                    >
                      <IconMail className="mr-1 size-4" />
                      {m.contactUs}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
