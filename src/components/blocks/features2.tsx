import { HeaderSection } from '@/components/layout/header-section'
import { IconActivity, IconBolt, IconCompass, IconMail } from '@tabler/icons-react'

export default function Features2Section() {
  return (
    <section id="features2" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20">
        <HeaderSection
          title="FEATURES"
          subtitle="Designed for productivity"
          subtitleAs="h2"
          description="Everything you need to build and ship faster."
          descriptionAs="p"
        />

        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-semibold">Features</h2>
            <p className="mt-6 text-muted-foreground">
              Everything you need to build and ship faster.
            </p>

            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <IconMail className="size-5 shrink-0" />
                Email notifications
              </li>
              <li>
                <IconBolt className="size-5 shrink-0" />
                Real-time updates
              </li>
              <li>
                <IconActivity className="size-5 shrink-0" />
                Activity tracking
              </li>
              <li>
                <IconCompass className="size-5 shrink-0" />
                Custom workflows
              </li>
            </ul>
          </div>

          <div className="relative rounded-3xl border border-border/50 p-3 lg:col-span-3">
            <div className="aspect-[76/59] relative rounded-2xl bg-gradient-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <img
                src="https://cdn.mksaas.com/blocks/dark-card.webp"
                alt="Card"
                className="hidden rounded-[15px] dark:block size-full object-cover"
              />
              <img
                src="https://cdn.mksaas.com/blocks/card.png"
                alt="Card"
                className="rounded-[15px] shadow size-full object-cover dark:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
