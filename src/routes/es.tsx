import { ProductHome } from '@/components/product/product-home';
import { websiteConfig } from '@/config/website';
import { localizedAlternates, seo, softwareApplicationJsonLd } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/es')({
  head: () => {
    const title =
      'Generador IA de fotos de producto para ecommerce | Crea sets completos';
    const description =
      'Sube una foto de producto y genera con IA un set ecommerce completo: imágenes principales, fondo blanco, escenas lifestyle y anuncios.';
    const metadata = seo('/es', {
      title,
      description,
      locale: 'es',
      keywords:
        'generador IA de fotos de producto ecommerce, generador de sets de fotos de producto, fotos ecommerce con IA',
      alternates: localizedAlternates({
        en: '/',
        zh: '/zh',
        ja: '/ja',
        ko: '/ko',
        es: '/es',
      }),
    });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            softwareApplicationJsonLd({
              name: websiteConfig.metadata?.name ?? 'SuiteWorkbench',
              description,
              path: '/es',
              locale: 'es',
            })
          ),
        },
      ],
    };
  },
  component: () => <ProductHome locale="es" />,
});
