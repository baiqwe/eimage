import type { BlogPost } from '@/lib/blog';
import type { ProductLocale } from '@/components/product/product-locale';
import { PUBLIC_PAGE_COPY } from '@/lib/product-i18n';
import { BlogCard } from './blog-card';

export function BlogGrid({
  posts,
  locale,
}: {
  posts: BlogPost[];
  locale: ProductLocale;
}) {
  const copy = PUBLIC_PAGE_COPY[locale].blog;

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {copy.noPosts}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  );
}
