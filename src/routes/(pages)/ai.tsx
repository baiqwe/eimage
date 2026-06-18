import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { AiCaptionCard } from '@/components/ai/ai-caption-card';
import { AiCfImageCard } from '@/components/ai/ai-cf-image-card';
import { AiImageCard } from '@/components/ai/ai-image-card';
import { AiImageEditCard } from '@/components/ai/ai-image-edit-card';
import { AiSummarizationCard } from '@/components/ai/ai-summarization-card';
import { AiTaglineCard } from '@/components/ai/ai-tagline-card';
import { AiTranslationCard } from '@/components/ai/ai-translation-card';
import { AiTtsCard } from '@/components/ai/ai-tts-card';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { PublicBreadcrumb } from '@/components/seo/public-breadcrumb';
import { websiteConfig } from '@/config/website';
import { PUBLIC_LABELS, PUBLIC_PAGE_COPY } from '@/lib/product-i18n';
import { breadcrumbJsonLd, seo } from '@/lib/seo';

export const Route = createFileRoute('/(pages)/ai')({
  head: () => {
    const copy = PUBLIC_PAGE_COPY.en.ai;
    const metadata = seo('/ai', {
      title: `${copy.title} | ${websiteConfig.metadata?.name}`,
      description: copy.description,
      robots: 'noindex,follow',
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: copy.title, path: '/ai' },
            ])
          ),
        },
      ],
    };
  },
  component: AiPage,
});

function AiPage() {
  const { locale, setLocale } = useProductLocale();
  const labels = PUBLIC_LABELS[locale];
  const copy = PUBLIC_PAGE_COPY[locale].ai;

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-5xl space-y-10 pb-16">
        <PublicBreadcrumb
          items={[{ label: labels.home, href: '/' }, { label: labels.ai }]}
        />
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <ProductLanguageSelect locale={locale} onLocaleChange={setLocale} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
          <p className="text-lg text-muted-foreground">{copy.description}</p>
          <p className="mx-auto max-w-2xl text-muted-foreground text-sm">
            {copy.note}
          </p>
        </div>

        <section id="text-summarization" className="scroll-mt-20">
          <AiSummarizationCard />
        </section>
        <section id="translation" className="scroll-mt-20">
          <AiTranslationCard />
        </section>
        <section id="tagline-generator" className="scroll-mt-20">
          <AiTaglineCard />
        </section>
        <section id="text-to-speech" className="scroll-mt-20">
          <AiTtsCard />
        </section>
        <section id="image-captioning" className="scroll-mt-20">
          <AiCaptionCard />
        </section>
        <section id="image-generator-cloudflare" className="scroll-mt-20">
          <AiCfImageCard />
        </section>
        <section id="image-generator-fal" className="scroll-mt-20">
          <AiImageCard />
        </section>
        <section id="image-editing" className="scroll-mt-20">
          <AiImageEditCard />
        </section>
      </div>
    </Container>
  );
}
