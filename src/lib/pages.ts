import { allPages } from 'content-collections';
import type { Page } from 'content-collections';

type PageWithMeta = Page & { _meta: { path: string } };

export function getPageBySlug(slug: string): Page | undefined {
  return (allPages as PageWithMeta[]).find((p) => p._meta.path === slug);
}
