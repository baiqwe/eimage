import { IconArrowRight, IconSparkles } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PRODUCT_GALLERY,
  getGalleryCopy,
  getGalleryItemCopy,
  type GalleryLocale,
  type ProductGalleryItem,
} from '@/lib/product-gallery';
import { Routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function ProductGallerySection({
  locale,
  limit,
  showActions = true,
}: {
  locale: GalleryLocale;
  limit?: number;
  showActions?: boolean;
}) {
  const copy = getGalleryCopy(locale);
  const items = limit ? PRODUCT_GALLERY.slice(0, limit) : PRODUCT_GALLERY;

  return (
    <section
      id="gallery"
      className="border-[#dfe3d8] border-t bg-white px-4 py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="outline" className="mb-4">
              <IconSparkles className="size-3.5" />
              {copy.badge}
            </Badge>
            <h2 className="max-w-3xl text-balance font-bold text-3xl tracking-tight md:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-3 max-w-3xl text-[#5f6759] text-base leading-7">
              {copy.description}
            </p>
          </div>
          {showActions ? (
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="outline" render={<Link to={Routes.Gallery} />}>
                {copy.viewAll}
                <IconArrowRight className="size-4" />
              </Button>
              <Button render={<Link to={Routes.Generator} />}>
                <IconSparkles className="size-4" />
                {copy.openGenerator}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              locale={locale}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  item,
  locale,
  featured,
}: {
  item: ProductGalleryItem;
  locale: GalleryLocale;
  featured?: boolean;
}) {
  const copy = getGalleryCopy(locale);
  const itemCopy = getGalleryItemCopy(item, locale);

  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border border-[#dfe3d8] bg-[#fbfcf7] shadow-sm',
        featured && 'md:col-span-2 xl:col-span-1'
      )}
    >
      <div
        role="img"
        aria-label={itemCopy.alt}
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: item.palette[0] }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: item.palette[1] }}
        />
        <div
          className="absolute top-0 right-0 h-full w-1/3 opacity-80"
          style={{ background: item.palette[2] }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div
              className="absolute inset-x-4 bottom-[-18px] h-8 rounded-full blur-lg"
              style={{ background: 'rgba(24, 28, 22, 0.28)' }}
            />
            <div className="relative h-28 w-24 rounded-[28px] border-8 border-white bg-[#d9ded1] shadow-2xl">
              <div className="mx-auto mt-4 h-10 w-12 rounded-full border-4 border-[#9aa48d]" />
              <div className="mx-auto mt-3 h-6 w-14 rounded-full bg-white/55" />
            </div>
          </div>
        </div>
        <Badge className="absolute top-3 left-3 bg-white/90 text-[#20231e]">
          {copy.labels[item.kind]}
        </Badge>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-semibold">{itemCopy.title}</h3>
          <span className="rounded-md border border-[#dfe3d8] bg-white px-2 py-1 text-[#74796d] text-xs">
            {item.ratio}
          </span>
        </div>
        <p className="text-[#5f6759] text-sm">{itemCopy.product}</p>
        <p className="mt-2 text-[#74796d] text-xs">{item.style}</p>
      </div>
    </article>
  );
}
