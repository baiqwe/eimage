import { HeaderSection } from '@/components/layout/header-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Jane Doe',
    role: 'CTO, Acme Inc',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    quote:
      'MkFast saved us months of development. We shipped our MVP in 2 weeks.',
  },
  {
    name: 'John Smith',
    role: 'Founder, Startup',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    quote:
      'The best SaaS starter we evaluated. Auth and billing just work.',
  },
  {
    name: 'Alex Chen',
    role: 'Engineer, Tech Co',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    quote: 'Clean code, great DX. We extended it for our use case easily.',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <HeaderSection
          title="TESTIMONIALS"
          titleAs="h2"
          subtitle="Loved by teams"
          subtitleAs="p"
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {testimonials.map(({ name, role, quote, image }) => (
            <Card
              key={name}
              className="bg-transparent shadow-none hover:bg-accent dark:hover:bg-card"
            >
              <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-4">
                <Avatar className="size-9 border-2 border-gray-200">
                  <AvatarImage alt={name} src={image} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">{name}</h3>
                  <span className="text-muted-foreground block text-sm tracking-wide">
                    {role}
                  </span>
                  <blockquote className="mt-3">
                    <p className="text-gray-700 dark:text-gray-300">{quote}</p>
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
