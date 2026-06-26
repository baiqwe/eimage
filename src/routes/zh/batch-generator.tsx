import { BatchGeneratorWorkbench } from '@/components/batch-generator/batch-generator-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/zh/batch-generator')({
  head: () =>
    seo('/zh/batch-generator', {
      title: '批量图片生成器 | ProdList AI',
      description:
        '批量上传商品图，统一填写一套指令，并把每张图片作为独立 AI 任务分别处理。',
      locale: 'zh',
      robots: 'noindex,nofollow',
    }),
  component: () => <BatchGeneratorWorkbench locale="zh" />,
});
