import { websiteConfig } from '@/config/website'
import { HeaderSection } from '@/components/layout/header-section'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function NewsletterCard() {
  const enabled = websiteConfig.newsletter?.enable ?? false
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle'
  )

  if (!enabled) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    // Placeholder: wire to your newsletter API
    setTimeout(() => setStatus('done'), 500)
  }

  return (
    <div className="w-full rounded-lg bg-muted/50 p-16">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderSection
          title="NEWSLETTER"
          subtitle="Stay in the loop"
          description="Get product updates and tips in your inbox."
        />

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </Button>
        </form>
        {status === 'done' && (
          <p className="text-sm text-muted-foreground">
            Thanks for subscribing!
          </p>
        )}
      </div>
    </div>
  )
}
