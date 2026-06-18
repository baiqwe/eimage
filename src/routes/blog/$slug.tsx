import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { Markdown } from '@/components/markdown/markdown';
import {
  PRODUCT_LOCALE_META,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { getPostBySlug } from '@/lib/blog';
import { websiteConfig } from '@/config/website';
import { PUBLIC_LABELS } from '@/lib/product-i18n';
import { getCanonicalUrl, getImageUrl } from '@/lib/urls';
import { breadcrumbJsonLd, seo } from '@/lib/seo';
import { IconArrowLeft } from '@tabler/icons-react';

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const post = loaderData;
    if (!post) return {};
    const path = `/blog/${params.slug}`;
    const title = `${post.title} | ${websiteConfig.metadata?.name}`;
    const description =
      post.description ?? websiteConfig.metadata?.description ?? '';
    const image = post.image ? getImageUrl(post.image) : undefined;
    const metadata = seo(path, {
      title,
      description,
      image,
      type: 'article',
    });
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description,
      ...(image && { image }),
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.date).toISOString(),
      url: getCanonicalUrl(path),
      author: {
        '@type': 'Organization',
        name: websiteConfig.metadata?.name ?? '',
      },
      publisher: {
        '@type': 'Organization',
        name: websiteConfig.metadata?.name ?? '',
      },
    };
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify([
            articleJsonLd,
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path },
            ]),
          ]),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const { locale } = useProductLocale();
  const labels = PUBLIC_LABELS[locale];
  const formattedDate = new Intl.DateTimeFormat(
    PRODUCT_LOCALE_META[locale].dateLocale,
    { dateStyle: 'medium' }
  ).format(new Date(post.date));
  if (!post || !websiteConfig.blog?.enable) throw notFound();

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <PublicBreadcrumb
          items={[
            { label: labels.home, href: '/' },
            { label: labels.blog, href: '/blog' },
            { label: post.title },
          ]}
        />
        <Link
          to="/blog"
          search={{ page: 1 }}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        >
          <IconArrowLeft className="size-4" />
          {labels.allPosts}
        </Link>

        <article>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium capitalize">
              {post.category}
            </span>
            <span>{formattedDate}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

          {post.description && (
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {post.description}
            </p>
          )}

          <div className="mt-6 pt-10 border-t border-border">
            <Markdown
              content={post.content}
              className="prose prose-neutral dark:prose-invert max-w-none"
            />
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              {labels.allPosts}
            </Link>
          </div>
        </article>
      </div>
    </Container>
  );
}
