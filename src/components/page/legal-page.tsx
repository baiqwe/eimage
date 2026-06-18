import {
  ProductLanguageSelect,
  type ProductLocale,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { PUBLIC_LABELS, LEGAL_PAGE_COPY } from '@/lib/product-i18n';

export function LegalPage({ page }: { page: 'privacy' | 'terms' | 'cookie' }) {
  const { locale, setLocale } = useProductLocale();
  const labels = PUBLIC_LABELS[locale];
  const copy = LEGAL_PAGE_COPY[locale][page];

  return (
    <div className="mx-auto max-w-4xl">
      <PublicBreadcrumb
        items={[{ label: labels.home, href: '/' }, { label: copy.title }]}
      />
      <div className="mb-8 flex justify-center">
        <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
      </div>
      <header className="mb-10 text-center">
        <h1 className="font-bold text-3xl tracking-tight">{copy.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {copy.description}
        </p>
      </header>
      <article className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-8">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-semibold text-xl">{section.title}</h2>
              <div className="mt-3 space-y-3 text-muted-foreground leading-7">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
