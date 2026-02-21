import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { websiteConfig } from '@/config/website';
import { useCurrentPlan } from '@/hooks/use-payment';
import { authClient } from '@/auth/client';
import { getCanonicalUrl } from '@/lib/urls';
import { messages } from '@/messages';

const m = messages.pricing;

export const Route = createFileRoute('/(pages)/pricing')({
  head: () => ({
    meta: [
      {
        title: `${m.title} | ${websiteConfig.metadata?.name}`,
      },
      {
        name: 'description',
        content: m.description,
      },
    ],
    links: [{ rel: 'canonical', href: getCanonicalUrl('/pricing') }],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const { data: planData } = useCurrentPlan(userId);
  const currentPlan = planData?.currentPlan ?? null;

  return (
    <Container className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{m.title}</h1>
          <p className="text-lg text-muted-foreground">{m.subtitle}</p>
        </div>
        <PricingTable
          currentPlan={currentPlan}
          metadata={userId ? { userId } : undefined}
        />
      </div>
    </Container>
  );
}
