import { HeaderSection } from '@/components/layout/header-section'

export default function StatsSection() {
  return (
    <section id="stats" className="px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <HeaderSection
          title="STATS"
          subtitle="Built for growth"
          subtitleAs="h2"
          description="Numbers that speak for themselves."
          descriptionAs="p"
        />

        <div className="grid gap-12 *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">+1200</div>
            <p>Active users</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">22 Million</div>
            <p>API requests</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold text-primary">+500</div>
            <p>Teams</p>
          </div>
        </div>
      </div>
    </section>
  )
}
