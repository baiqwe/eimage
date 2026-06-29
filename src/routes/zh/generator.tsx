import { SuiteWorkbench } from '@/components/suite-workbench/suite-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/zh/generator')({
  head: () =>
    seo('/zh/generator', {
      title: 'ProdList AI 生成器',
      description: '上传一张商品图，生成主图和详情页场景图。',
      locale: 'zh',
      robots: 'noindex,nofollow',
    }),
  component: () => <SuiteWorkbench initialLocale="zh" />,
});
