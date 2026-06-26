import { BatchGeneratorWorkbench } from '@/components/batch-generator/batch-generator-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/batch-generator')({
  head: () =>
    seo('/batch-generator', {
      title: 'Batch Image Generator | ProdList AI',
      description:
        'Upload many product images, apply one shared instruction set, and process each image as an independent AI task.',
      robots: 'noindex,nofollow',
    }),
  component: () => <BatchGeneratorWorkbench locale="en" />,
});
