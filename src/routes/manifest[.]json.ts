import { createFileRoute } from '@tanstack/react-router';
import { websiteConfig } from '@/config/website';

/**
 * Dynamic Web App Manifest (PWA)
 * Serves /manifest.json with name/description from config instead of a static file
 * https://tanstack.dev/start/latest/docs/framework/react/guide/seo#dynamic-sitemap
 * https://web.dev/add-manifest/
 */
export const Route = createFileRoute('/manifest.json')({
  server: {
    handlers: {
      GET: async () => {
        const metadata = websiteConfig.metadata;
        const body = {
          name: metadata?.name ?? 'SuiteWorkbench',
          short_name: 'SuiteWorkbench',
          description:
            metadata?.description ??
            'AI product image generator for ecommerce teams.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          // Keep in sync with <meta name="theme-color"> in src/routes/__root.tsx
          background_color: '#f7f8f4',
          theme_color: '#20231e',
          icons: [
            { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        };
        return new Response(JSON.stringify(body), {
          headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
