import { WhiteBackgroundWorkbench } from '@/components/white-background-generator/white-background-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/zh/white-background-generator')({
  head: () =>
    seo('/zh/white-background-generator', {
      title: '白底图生成器 | ProdList AI',
      description: '生成干净白底、自然阴影和平台可用留白的商品主图。',
      locale: 'zh',
      robots: 'noindex,nofollow',
    }),
  component: () => <WhiteBackgroundWorkbench locale="zh" />,
});
