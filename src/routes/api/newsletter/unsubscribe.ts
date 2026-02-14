import { createFileRoute } from '@tanstack/react-router'
import { unsubscribe } from '@/newsletter'
import { websiteConfig } from '@/config/website'

export const Route = createFileRoute('/api/newsletter/unsubscribe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!websiteConfig.newsletter?.enable) {
          return Response.json(
            { success: false, error: 'Newsletter is not enabled' },
            { status: 400 }
          )
        }
        let body: { email?: string }
        try {
          body = (await request.json()) as { email?: string }
        } catch {
          return Response.json(
            { success: false, error: 'Invalid JSON body' },
            { status: 400 }
          )
        }
        const email = typeof body?.email === 'string' ? body.email.trim() : ''
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json(
            { success: false, error: 'Please enter a valid email address' },
            { status: 400 }
          )
        }
        try {
          const ok = await unsubscribe(email)
          if (!ok) {
            return Response.json(
              {
                success: false,
                error: 'Failed to unsubscribe from the newsletter',
              },
              { status: 500 }
            )
          }
          return Response.json({ success: true })
        } catch (error) {
          console.error('Unsubscribe newsletter error:', error)
          return Response.json(
            {
              success: false,
              error:
                error instanceof Error ? error.message : 'Something went wrong',
            },
            { status: 500 }
          )
        }
      },
    },
  },
})
