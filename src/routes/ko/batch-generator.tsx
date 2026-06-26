import { BatchGeneratorWorkbench } from '@/components/batch-generator/batch-generator-workbench';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ko/batch-generator')({
  head: () =>
    seo('/ko/batch-generator', {
      title: '배치 이미지 생성기 | ProdList AI',
      description:
        '여러 상품 이미지를 업로드하고 하나의 공유 지시로 이미지별 독립 AI 작업을 실행합니다.',
      locale: 'ko',
      robots: 'noindex,nofollow',
    }),
  component: () => <BatchGeneratorWorkbench locale="ko" />,
});
