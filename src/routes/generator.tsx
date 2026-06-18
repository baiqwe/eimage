import { SuiteWorkbench } from '@/components/suite-workbench/suite-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/generator')({
  head: () =>
    seo('/generator', {
      title: 'ProdList AI Generator',
      description:
        'Generate main product images and detail-page scenes from one source product photo.',
      robots: 'noindex,nofollow',
    }),
  component: SuiteWorkbench,
});
