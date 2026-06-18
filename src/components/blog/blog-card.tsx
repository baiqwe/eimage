import type { BlogPost } from '@/lib/blog';
import { Link } from '@tanstack/react-router';
import {
  PRODUCT_LOCALE_META,
  type ProductLocale,
} from '@/components/product/product-locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function BlogCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: ProductLocale;
}) {
  const { slug } = post;
  const formattedDate = new Intl.DateTimeFormat(
    PRODUCT_LOCALE_META[locale].dateLocale,
    { dateStyle: 'medium' }
  ).format(new Date(post.date));

  return (
    <Link to="/blog/$slug" params={{ slug }} className="h-full">
      <Card className="h-full py-0 transition-[box-shadow,ring-color] hover:shadow-md dark:hover:ring-foreground/20">
        {post.image && (
          <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="size-full object-cover transition-transform hover:scale-[1.05]"
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between gap-2 pt-4 pb-0">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </CardHeader>
        <CardContent className="pb-4">
          <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
          {post.description && (
            <CardDescription className="mt-2 line-clamp-2">
              {post.description}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
