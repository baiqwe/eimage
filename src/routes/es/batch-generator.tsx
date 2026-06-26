import { BatchGeneratorWorkbench } from '@/components/batch-generator/batch-generator-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/es/batch-generator')({
  head: () =>
    seo('/es/batch-generator', {
      title: 'Generador de imagenes por lotes | ProdList AI',
      description:
        'Sube muchas imagenes de producto, aplica una instruccion compartida y procesa cada imagen como tarea AI independiente.',
      locale: 'es',
      robots: 'noindex,nofollow',
    }),
  component: () => <BatchGeneratorWorkbench locale="es" />,
});
