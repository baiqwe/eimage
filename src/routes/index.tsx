import { createFileRoute } from '@tanstack/react-router';
import HeroSection from '@/components/blocks/hero';
import LogoCloudSection from '@/components/blocks/logo-cloud';
import StatsSection from '@/components/blocks/stats';
import IntegrationSection from '@/components/blocks/integration';
import FeaturesSection from '@/components/blocks/features';
import Features2Section from '@/components/blocks/features2';
import Features3Section from '@/components/blocks/features3';
import Integration2Section from '@/components/blocks/integration2';
import PricingSection from '@/components/blocks/pricing';
import FaqSection from '@/components/blocks/faqs';
import CallToActionSection from '@/components/blocks/calltoaction';
import TestimonialsSection from '@/components/blocks/testimonials';
import { NewsletterCard } from '@/components/blocks/newsletter-card';
import { websiteConfig } from '@/config/website';
import { getCanonicalUrl } from '@/lib/urls';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: websiteConfig.metadata?.title },
      {
        name: 'description',
        content: websiteConfig.metadata?.description,
      },
    ],
    links: [{ rel: 'canonical', href: getCanonicalUrl('/') }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <LogoCloudSection />
      <StatsSection />
      <IntegrationSection />
      <FeaturesSection />
      <Features2Section />
      <Features3Section />
      <Integration2Section />
      <PricingSection />
      <FaqSection />
      <CallToActionSection />
      <TestimonialsSection />
      <NewsletterCard />
    </div>
  );
}
