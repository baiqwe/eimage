import { HeaderSection } from '@/components/shared/header-section';
import {
  IconBolt,
  IconCpu,
  IconFingerprint,
  IconPencil,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { messages } from '@/messages';

const m = messages.homePage.features3;

const items = [
  { key: 'item-1' as const, Icon: IconBolt },
  { key: 'item-2' as const, Icon: IconCpu },
  { key: 'item-3' as const, Icon: IconFingerprint },
  { key: 'item-4' as const, Icon: IconPencil },
  { key: 'item-5' as const, Icon: IconSettings },
  { key: 'item-6' as const, Icon: IconSparkles },
] as const;

export default function Features3Section() {
  return (
    <section id="features3" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20">
        <HeaderSection
          title={m.title}
          subtitle={m.subtitle}
          subtitleAs="h2"
          description={m.description}
          descriptionAs="p"
        />

        <div className="relative mx-auto grid divide-x divide-y border *:p-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ key, Icon }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" />
                <h3 className="text-base font-medium">{m.items[key].title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {m.items[key].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
