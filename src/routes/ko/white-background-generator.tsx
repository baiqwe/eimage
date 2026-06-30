import { WhiteBackgroundWorkbench } from '@/components/white-background-generator/white-background-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ko/white-background-generator')({
  head: () =>
    seo('/ko/white-background-generator', {
      title: 'White Background Generator | ProdList AI',
      description:
        'Generate clean white-background ecommerce product photos with natural shadows and marketplace-ready spacing.',
      locale: 'ko',
      robots: 'noindex,nofollow',
    }),
  component: () => <WhiteBackgroundWorkbench locale="ko" />,
});
