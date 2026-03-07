import HeroSection from '@/components/blocks/hero';
import LogoCloudSection from '@/components/blocks/logo-cloud';
import { lazy, Suspense } from 'react';

const FeaturesSection = lazy(() => import('@/components/blocks/features'));
const Features2Section = lazy(() => import('@/components/blocks/features2'));
const CallToActionSection = lazy(
  () => import('@/components/blocks/calltoaction')
);
const StatsSection = lazy(() => import('@/components/blocks/stats'));
const IntegrationSection = lazy(
  () => import('@/components/blocks/integration')
);
const Integration2Section = lazy(
  () => import('@/components/blocks/integration2')
);
const PricingSection = lazy(() => import('@/components/blocks/pricing'));
const FaqSection = lazy(() => import('@/components/blocks/faqs'));
const TestimonialsSection = lazy(
  () => import('@/components/blocks/testimonials')
);
const NewsletterCard = lazy(
  () => import('@/components/blocks/newsletter-card')
);

export function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <LogoCloudSection />
      <Suspense>
        <FeaturesSection />
        <Features2Section />
        <CallToActionSection />
        <StatsSection />
        <IntegrationSection />
        <Integration2Section />
        <PricingSection />
        <FaqSection />
        <TestimonialsSection />
        <NewsletterCard />
      </Suspense>
    </div>
  );
}
