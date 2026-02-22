import type { BlogPost } from '@/lib/blog';
import { Link } from '@tanstack/react-router';
import { formatDate } from '@/lib/formatter';

export function BlogCard({ post }: { post: BlogPost }) {
  const { slug } = post;

  return (
    <Link
      to="/blog/$slug"
      params={{ slug }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-colors hover:border-primary/30 dark:hover:border-primary/60 hover:shadow-md"
    >
      {/* Featured image (Achromatic / Mixus style card image) */}
      {post.image && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={post.image}
            alt=""
            className="object-cover transition-transform hover:scale-[1.05]"
          />
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* Category and date row */}
        <div className="flex shrink-0 items-center justify-between gap-2">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground text-xs font-medium capitalize">
            {post.category}
          </span>
          <span className="text-muted-foreground text-xs">
            {formatDate(new Date(post.date))}
          </span>
        </div>
        {/* Title + description */}
        <div className="mt-3 flex min-h-18 flex-1 flex-col">
          <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
          {post.description && (
            <p className="mt-2 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
              {post.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
