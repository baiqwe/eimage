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
          alternates?: Record<string, string>;
        }[] = [
          {
            path: '/',
            changefreq: 'daily',
            priority: '1.0',
            alternates: localeAlternates({
              en: '/',
              zh: '/zh',
              ja: '/ja',
              ko: '/ko',
              es: '/es',
            }),
          },
          {
            path: '/en',
            changefreq: 'daily',
            priority: '0.9',
            alternates: localeAlternates({
              en: '/en',
              zh: '/zh',
              ja: '/ja',
              ko: '/ko',
              es: '/es',
            }),
          },
          {
            path: '/zh',
            changefreq: 'daily',
            priority: '0.95',
            alternates: localeAlternates({
              en: '/',
              zh: '/zh',
              ja: '/ja',
              ko: '/ko',
              es: '/es',
            }),
          },
          {
            path: '/ja',
            changefreq: 'weekly',
            priority: '0.85',
            alternates: localeAlternates({
              en: '/',
              zh: '/zh',
              ja: '/ja',
              ko: '/ko',
              es: '/es',
            }),
          },
          {
            path: '/ko',
            changefreq: 'weekly',
            priority: '0.85',
            alternates: localeAlternates({
              en: '/',
              zh: '/zh',
              ja: '/ja',
              ko: '/ko',
              es: '/es',
            }),
          },
          {
            path: '/es',
            changefreq: 'weekly',
            priority: '0.85',
            alternates: localeAlternates({
              en: '/',
              zh: '/zh',
              ja: '/ja',
              ko: '/ko',
              es: '/es',
            }),
          },
          {
            path: '/gallery',
            changefreq: 'weekly',
            priority: '0.85',
            alternates: localeAlternates({
              en: '/gallery',
              zh: '/zh/gallery',
            }),
          },
          {
            path: '/zh/gallery',
            changefreq: 'weekly',
            priority: '0.82',
            alternates: localeAlternates({
              en: '/gallery',
              zh: '/zh/gallery',
            }),
          },
          {
            path: '/tools',
            changefreq: 'weekly',
            priority: '0.9',
            alternates: localeAlternates({
              en: '/tools',
              zh: '/zh/tools',
            }),
          },
          {
            path: '/zh/tools',
            changefreq: 'weekly',
            priority: '0.85',
            alternates: localeAlternates({
              en: '/tools',
              zh: '/zh/tools',
            }),
          },
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
            alternates: localeAlternates({
              en: `/tools/${tool.slug}`,
              zh: `/zh/tools/${tool.slug}`,
            }),
          });
          staticUrls.push({
            path: `/zh/tools/${tool.slug}`,
            changefreq: 'weekly',
            priority: '0.8',
            alternates: localeAlternates({
              en: `/tools/${tool.slug}`,
              zh: `/zh/tools/${tool.slug}`,
            }),
          });
        }

        const urlEntry = (
          path: string,
          opts?: {
            changefreq?: string;
            priority?: string;
            lastmod?: string;
            alternates?: Record<string, string>;
          }
        ) => {
          const alternates = opts?.alternates
            ? Object.entries(opts.alternates)
                .map(
                  ([hreflang, href]) =>
                    `\n    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${base}${href}" />`
                )
                .join('')
            : '';
          const lastmod = opts?.lastmod
            ? `\n    <lastmod>${opts.lastmod}</lastmod>`
            : '';
          const changefreq = opts?.changefreq
            ? `\n    <changefreq>${opts.changefreq}</changefreq>`
            : '';
          const priority = opts?.priority
            ? `\n    <priority>${opts.priority}</priority>`
            : '';
          return `  <url>\n    <loc>${base}${path}</loc>${alternates}${lastmod}${changefreq}${priority}\n  </url>`;
        };

        const staticPart = staticUrls
          .map((u) =>
            urlEntry(u.path, {
              changefreq: u.changefreq,
              priority: u.priority,
              alternates: u.alternates,
            })
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
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

function localeAlternates(paths: Record<string, string>) {
  return {
    ...paths,
    'x-default': paths.en ?? paths.zh ?? '/',
  };
}
