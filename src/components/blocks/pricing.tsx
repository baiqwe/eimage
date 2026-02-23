import { HeaderSection } from '@/components/shared/header-section';
import { PricingTable } from '@/components/pricing/pricing-table';

const m = {
  subtitle: 'Pricing',
  description: 'Choose the plan that fits your needs',
};

export default function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-16 px-6">
        <HeaderSection
          subtitle={m.subtitle}
          subtitleAs="h2"
          subtitleClassName="text-4xl font-bold"
          description={m.description}
          descriptionAs="p"
        />
        <PricingTable />
      </div>
    </section>
  );
}
