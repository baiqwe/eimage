import { createFileRoute } from '@tanstack/react-router';
import { getSortedPosts } from '@/lib/blog';
import { PRODUCT_TOOLS } from '@/lib/product-tools';
import { getBaseUrl } from '@/lib/urls';
import { websiteConfig } from '@/config/website';

/**
 * Dynamic sitemap.xml
 * https://tanstack.dev/start/latest/docs/framework/react/guide/seo#dynamic-sitemap
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const staticUrls: {
          path: string;
          changefreq?: string;
          priority?: string;
        }[] = [
          { path: '/', changefreq: 'daily', priority: '1.0' },
          { path: '/en', changefreq: 'daily', priority: '0.9' },
          { path: '/zh', changefreq: 'daily', priority: '0.95' },
          { path: '/ja', changefreq: 'weekly', priority: '0.85' },
          { path: '/ko', changefreq: 'weekly', priority: '0.85' },
          { path: '/es', changefreq: 'weekly', priority: '0.85' },
          { path: '/generator', changefreq: 'weekly', priority: '0.9' },
          { path: '/gallery', changefreq: 'weekly', priority: '0.85' },
          { path: '/about', changefreq: 'monthly', priority: '0.7' },
          { path: '/contact', changefreq: 'monthly', priority: '0.6' },
          { path: '/terms', changefreq: 'monthly' },
          { path: '/privacy', changefreq: 'monthly' },
          { path: '/cookie', changefreq: 'monthly' },
        ];

        if (websiteConfig.blog?.enable) {
          staticUrls.push({
            path: '/blog',
            changefreq: 'weekly',
            priority: '0.7',
          });
        }
        if (websiteConfig.payment?.enable) {
          staticUrls.push({
            path: '/pricing',
            changefreq: 'weekly',
            priority: '0.8',
          });
        }

        for (const tool of PRODUCT_TOOLS) {
          staticUrls.push({
            path: `/tools/${tool.slug}`,
            changefreq: 'weekly',
            priority: '0.82',
          });
          staticUrls.push({
            path: `/zh/tools/${tool.slug}`,
            changefreq: 'weekly',
            priority: '0.8',
          });
        }

        const urlEntry = (
          path: string,
          opts?: { changefreq?: string; priority?: string; lastmod?: string }
        ) => {
          const lastmod = opts?.lastmod
            ? `\n    <lastmod>${opts.lastmod}</lastmod>`
            : '';
          const changefreq = opts?.changefreq
            ? `\n    <changefreq>${opts.changefreq}</changefreq>`
            : '';
          const priority = opts?.priority
            ? `\n    <priority>${opts.priority}</priority>`
            : '';
          return `  <url>\n    <loc>${base}${path}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
        };

        const staticPart = staticUrls
          .map((u) =>
            urlEntry(u.path, { changefreq: u.changefreq, priority: u.priority })
          )
          .join('\n');

        let blogPart = '';
        if (websiteConfig.blog?.enable) {
          const posts = getSortedPosts();
          blogPart = posts
            .map((p) =>
              urlEntry(`/blog/${p.slug}`, {
                changefreq: 'weekly',
                lastmod: new Date(p.date).toISOString().slice(0, 10),
              })
            )
            .join('\n');
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPart}
${blogPart ? `\n${blogPart}` : ''}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        });
      },
    },
  },
});
