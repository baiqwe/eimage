import { createFileRoute } from '@tanstack/react-router';
import { isSubscribed } from '@/newsletter';
import { websiteConfig } from '@/config/website';

export const Route = createFileRoute('/api/newsletter/status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!websiteConfig.newsletter?.enable) {
          return Response.json(
            {
              success: false,
              subscribed: false,
              error: 'Newsletter is not enabled',
            },
            { status: 400 }
          );
        }
        const url = new URL(request.url);
        const email = url.searchParams.get('email')?.trim() ?? '';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json(
            {
              success: false,
              subscribed: false,
              error: 'Valid email required',
            },
            { status: 400 }
          );
        }
        try {
          const subscribed = await isSubscribed(email);
          return Response.json({ success: true, subscribed });
        } catch (error) {
          console.error('Check newsletter status error:', error);
          return Response.json(
            {
              success: false,
              subscribed: false,
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
