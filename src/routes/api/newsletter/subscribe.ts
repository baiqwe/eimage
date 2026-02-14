import { createFileRoute } from '@tanstack/react-router'
import { websiteConfig } from '@/config/website'
import { sendEmail } from '@/mail'
import { subscribe } from '@/newsletter'

export const Route = createFileRoute('/api/newsletter/subscribe')({
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
          const ok = await subscribe(email)
          if (!ok) {
            return Response.json(
              { success: false, error: 'Failed to subscribe to the newsletter' },
              { status: 500 }
            )
          }
          // Delay before welcome email to stay under Resend rate limit (2 req/s)
          if (websiteConfig.mail?.fromEmail) {
            await new Promise((r) => setTimeout(r, 3000))
            try {
              await sendEmail({
                to: email,
                template: 'subscribeNewsletter',
                context: { email },
              })
            } catch (e) {
              console.error('Newsletter welcome email error:', e)
            }
          }
          return Response.json({ success: true })
        } catch (error) {
          console.error('Subscribe newsletter error:', error)
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
