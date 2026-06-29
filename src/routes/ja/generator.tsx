import { SuiteWorkbench } from '@/components/suite-workbench/suite-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ja/generator')({
  head: () =>
    seo('/ja/generator', {
      title: 'ProdList AI Generator',
      description:
        'Upload one product image and generate main images plus detail-page scenes.',
      locale: 'ja',
      robots: 'noindex,nofollow',
    }),
  component: () => <SuiteWorkbench initialLocale="ja" />,
});
