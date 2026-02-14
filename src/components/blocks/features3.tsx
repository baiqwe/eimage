import { HeaderSection } from '@/components/layout/header-section'
import {
  IconBolt,
  IconCpu,
  IconFingerprint,
  IconPencil,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react'

const items = [
  {
    icon: IconBolt,
    title: 'Fast',
    description: 'Optimized for speed and low latency.',
  },
  {
    icon: IconCpu,
    title: 'Scalable',
    description: 'Handles growth from zero to millions.',
  },
  {
    icon: IconFingerprint,
    title: 'Secure',
    description: 'Auth and encryption built in.',
  },
  {
    icon: IconPencil,
    title: 'Customizable',
    description: 'Theme and extend to fit your brand.',
  },
  {
    icon: IconSettings,
    title: 'Configurable',
    description: 'Environment-based configuration.',
  },
  {
    icon: IconSparkles,
    title: 'AI-ready',
    description: 'Integrate LLMs and agents easily.',
  },
]

export default function Features3Section() {
  return (
    <section id="features3" className="px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-8 lg:space-y-20">
        <HeaderSection
          title="FEATURES"
          subtitle="Built for developers"
          subtitleAs="h2"
          description="Developer experience first."
          descriptionAs="p"
        />

        <div className="relative mx-auto grid divide-x divide-y border *:p-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <item.icon className="size-4 shrink-0" />
                <h3 className="text-base font-medium">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
