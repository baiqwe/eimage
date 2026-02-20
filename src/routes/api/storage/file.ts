import { createFileRoute } from '@tanstack/react-router';
import { getFile } from '@/storage';
import { ConfigurationError } from '@/storage/types';

/**
 * Serves a file by key via the storage provider (same-origin proxy URL).
 */
export const Route = createFileRoute('/api/storage/file')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get('key');
        if (!key || key.includes('..')) {
          return new Response('Bad Request', { status: 400 });
        }

        try {
          const file = await getFile(key);
          if (!file) {
            return new Response('Not Found', { status: 404 });
          }
          return new Response(file.body, {
            headers: {
              'Content-Type': file.contentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        } catch (e) {
          if (e instanceof ConfigurationError) {
            return new Response('Storage not configured', { status: 503 });
          }
          throw e;
        }
      },
    },
  },
});
