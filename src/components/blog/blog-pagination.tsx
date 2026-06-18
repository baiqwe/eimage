import { Link } from '@tanstack/react-router';
import type { ProductLocale } from '@/components/product/product-locale';
import { PUBLIC_PAGE_COPY } from '@/lib/product-i18n';

export function BlogPagination({
  currentPage,
  totalPages,
  locale,
}: {
  currentPage: number;
  totalPages: number;
  locale: ProductLocale;
}) {
  if (totalPages <= 1) return null;

  const copy = PUBLIC_PAGE_COPY[locale].blog;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          to="/blog"
          search={prevPage <= 1 ? { page: undefined } : { page: prevPage }}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {copy.previous}
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm">
          {copy.previous}
        </span>
      )}
      <span className="px-2 text-muted-foreground text-sm">
        {copy.page} {currentPage} {copy.of} {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          to="/blog"
          search={{ page: nextPage }}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {copy.next}
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center rounded-lg border border-border px-4 py-2 text-muted-foreground text-sm">
          {copy.next}
        </span>
      )}
    </nav>
  );
}
