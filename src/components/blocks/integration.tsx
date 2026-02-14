import { HeaderSection } from '@/components/layout/header-section'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

const integrations = [
  {
    title: 'AI & LLMs',
    description: 'Connect to OpenAI, Anthropic, and more.',
  },
  {
    title: 'Replit',
    description: 'Deploy and run in the cloud.',
  },
  {
    title: 'Magic UI',
    description: 'Beautiful animated components.',
  },
  {
    title: 'VS Codium',
    description: 'AI-powered code editor.',
  },
  {
    title: 'MediaWiki',
    description: 'Knowledge base integration.',
  },
  {
    title: 'Google PaLM',
    description: 'Google AI models.',
  },
]

function IntegrationCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="bg-transparent p-6 hover:bg-accent dark:hover:bg-card">
      <div className="relative">
        <div className="size-10 rounded-lg bg-muted" />

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'gap-1 pr-2'
            )}
          >
            Learn more
            <IconChevronRight className="ml-0 size-3.5 opacity-50" />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default function IntegrationSection() {
  return (
    <section id="integration" className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <HeaderSection
          title="INTEGRATIONS"
          subtitle="Works with your stack"
          description="Connect to the tools you already use."
          subtitleAs="h2"
          descriptionAs="p"
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => (
            <IntegrationCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
