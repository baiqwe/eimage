import { createFileRoute } from '@tanstack/react-router';
import { websiteConfig } from '@/config/website';
import { sendEmail } from '@/mail';

const NAME_MIN = 3;
const NAME_MAX = 30;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supportEmail = websiteConfig.mail?.supportEmail;
        if (!supportEmail) {
          return Response.json(
            { success: false, error: 'Contact form is not configured' },
            { status: 503 }
          );
        }
        let body: { name?: string; email?: string; message?: string };
        try {
          body = (await request.json()) as {
            name?: string;
            email?: string;
            message?: string;
          };
        } catch {
          return Response.json(
            { success: false, error: 'Invalid JSON body' },
            { status: 400 }
          );
        }
        const name = typeof body?.name === 'string' ? body.name.trim() : '';
        const email = typeof body?.email === 'string' ? body.email.trim() : '';
        const message =
          typeof body?.message === 'string' ? body.message.trim() : '';

        if (name.length < NAME_MIN || name.length > NAME_MAX) {
          return Response.json(
            {
              success: false,
              error: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`,
            },
            { status: 400 }
          );
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json(
            { success: false, error: 'Please enter a valid email address' },
            { status: 400 }
          );
        }
        if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
          return Response.json(
            {
              success: false,
              error: `Message must be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters`,
            },
            { status: 400 }
          );
        }

        try {
          const ok = await sendEmail({
            to: supportEmail,
            template: 'contactMessage',
            context: { name, email, message },
          });
          if (!ok) {
            return Response.json(
              { success: false, error: 'Failed to send the message' },
              { status: 500 }
            );
          }
          return Response.json({ success: true });
        } catch (error) {
          console.error('Contact form error:', error);
          return Response.json(
            {
              success: false,
              error:
                error instanceof Error ? error.message : 'Something went wrong',
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
