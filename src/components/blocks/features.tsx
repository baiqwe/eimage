'use client';

import { HeaderSection } from '@/components/layout/header-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  IconChartBar,
  IconDatabase,
  IconFingerprint,
  IconId,
} from '@tabler/icons-react';
import { useState } from 'react';

const items = [
  {
    id: 'item-1',
    icon: IconDatabase,
    title: 'Database',
    description:
      'Store and query your data with a powerful database layer. Supports relations, migrations, and type-safe access.',
  },
  {
    id: 'item-2',
    icon: IconFingerprint,
    title: 'Authentication',
    description:
      'Secure auth with email, OAuth, and magic links. Session management and role-based access built in.',
  },
  {
    id: 'item-3',
    icon: IconId,
    title: 'Identity',
    description:
      'User profiles, avatars, and account management. Connect multiple providers per user.',
  },
  {
    id: 'item-4',
    icon: IconChartBar,
    title: 'Analytics',
    description:
      'Track usage and conversions. Dashboards and reports out of the box.',
  },
];

export default function FeaturesSection() {
  const [activeItem, setActiveItem] = useState('item-1');

  return (
    <section id="features" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20">
        <HeaderSection
          title="FEATURES"
          subtitle="Everything you need to ship"
          subtitleAs="h2"
          description="Built-in features so you can focus on your product."
          descriptionAs="p"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-24">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="text-left">
              <h3 className="py-1 text-3xl font-semibold leading-normal text-foreground lg:text-4xl">
                Features
              </h3>
              <p className="mt-4 text-muted-foreground">
                Built-in features so you can focus on your product.
              </p>
            </div>
            <Accordion
              value={[activeItem]}
              onValueChange={(v) =>
                setActiveItem((v?.[0] as string) ?? 'item-1')
              }
              className="w-full"
            >
              {items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 text-base">
                      <item.icon className="size-4" />
                      {item.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="relative flex w-full overflow-hidden rounded-2xl border bg-background p-2 lg:col-span-7">
            <div className="aspect-[76/59] relative w-full rounded-2xl bg-muted">
              <img
                src="https://cdn.mksaas.com/blocks/charts.png"
                alt="Feature"
                className="size-full object-cover object-left-top rounded-2xl dark:block"
              />
              <img
                src="https://cdn.mksaas.com/blocks/charts-light.png"
                alt="Feature"
                className="size-full object-cover object-left-top rounded-2xl dark:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
