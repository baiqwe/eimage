import { BatchGeneratorWorkbench } from '@/components/batch-generator/batch-generator-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ja/batch-generator')({
  head: () =>
    seo('/ja/batch-generator', {
      title: '一括画像生成ツール | ProdList AI',
      description:
        '複数の商品画像をアップロードし、1 つの共有指示で画像ごとに独立した AI タスクとして処理します。',
      locale: 'ja',
      robots: 'noindex,nofollow',
    }),
  component: () => <BatchGeneratorWorkbench locale="ja" />,
});
