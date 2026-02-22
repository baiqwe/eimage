import { HeaderSection } from '@/components/shared/header-section';
import { messages } from '@/messages';

const m = messages.homePage.stats;

export default function StatsSection() {
  return (
    <section id="stats" className="px-4 py-16">
      <div className="mx-auto max-w-5xl px-6 space-y-8 md:space-y-16">
        <HeaderSection
          title={m.title}
          subtitle={m.subtitle}
          subtitleAs="h2"
          description={m.description}
          descriptionAs="p"
        />

        <div className="grid gap-12 divide-y-0 *:text-center md:grid-cols-3 md:gap-2 md:divide-x">
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">+1200</div>
            <p>{m.items['item-1'].title}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">22 Million</div>
            <p>{m.items['item-2'].title}</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">+500</div>
            <p>{m.items['item-3'].title}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
