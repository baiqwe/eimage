import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ProductLocale } from '@/components/product/product-locale';

const FAQ_COPY: Record<
  ProductLocale,
  {
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  }
> = {
  zh: {
    title: '常见问题',
    subtitle: '关于点数、订阅和生成流程',
    items: [
      {
        question: '一次批量生成会怎么扣点？',
        answer:
          '批量生成本质上是多个单图任务并发执行，每张图会按分辨率、类型和后续真实 API 成本独立扣点。',
      },
      {
        question: '失败任务会扣点吗？',
        answer:
          '后续接入真实生图 API 后，失败任务会进入返还逻辑，避免用户为无结果任务付费。',
      },
      {
        question: '可以只生成主图或详情图吗？',
        answer:
          '可以。生成器里的每张任务卡片都可以独立配置、独立生成，也可以一起批量执行。',
      },
      {
        question: '会改变商品本身形状吗？',
        answer: '产品目标是保留原始商品结构，主要重制背景、光影和场景氛围。',
      },
    ],
  },
  en: {
    title: 'FAQs',
    subtitle: 'Credits, subscriptions, and generation workflow',
    items: [
      {
        question: 'How are credits charged for batch generation?',
        answer:
          'A batch is made of multiple single-image tasks running in parallel. Each output is charged independently based on type, resolution, and future API cost.',
      },
      {
        question: 'Are failed jobs charged?',
        answer:
          'When the real image API is connected, failed jobs will use a refund path so users do not pay for empty results.',
      },
      {
        question: 'Can I generate only main images or only detail scenes?',
        answer:
          'Yes. Each task card can be configured and rendered independently, or run together as a batch.',
      },
      {
        question: 'Will the product shape change?',
        answer:
          'The product goal is to preserve the source product structure while redesigning background, lighting, and scene mood.',
      },
    ],
  },
  ja: {
    title: 'FAQ',
    subtitle: 'クレジット、契約、生成フローについて',
    items: [
      {
        question: 'バッチ生成のクレジット消費は？',
        answer:
          'バッチは複数の単画像タスクを並列実行する仕組みです。各画像ごとに種類、解像度、API コストに基づいて消費します。',
      },
      {
        question: '失敗したタスクも課金されますか？',
        answer: '実生成 API 接続後は、失敗タスクに返還ロジックを用意します。',
      },
      {
        question: '主画像だけ、詳細画像だけ生成できますか？',
        answer:
          '可能です。各タスクカードは個別設定、個別生成、または一括実行できます。',
      },
      {
        question: '商品の形は変わりますか？',
        answer:
          '元の商品構造を保ち、背景、照明、シーンの雰囲気を再設計することを目標にしています。',
      },
    ],
  },
  ko: {
    title: 'FAQ',
    subtitle: '크레딧, 구독, 생성 흐름',
    items: [
      {
        question: '배치 생성은 어떻게 차감되나요?',
        answer:
          '배치는 여러 단일 이미지 작업을 병렬 실행합니다. 각 결과는 유형, 해상도, 향후 API 비용에 따라 개별 차감됩니다.',
      },
      {
        question: '실패한 작업도 차감되나요?',
        answer: '실제 이미지 API 연결 후 실패 작업은 환불 흐름을 사용합니다.',
      },
      {
        question: '메인 이미지만 또는 상세 이미지만 생성할 수 있나요?',
        answer:
          '가능합니다. 각 작업 카드는 개별 설정 및 생성이 가능하며 일괄 실행도 가능합니다.',
      },
      {
        question: '상품 형태가 바뀌나요?',
        answer:
          '원본 상품 구조를 유지하면서 배경, 조명, 장면 분위기를 재설계하는 것이 목표입니다.',
      },
    ],
  },
  es: {
    title: 'Preguntas frecuentes',
    subtitle: 'Créditos, suscripciones y flujo de generación',
    items: [
      {
        question: '¿Cómo se cobran créditos en generación por lotes?',
        answer:
          'Un lote son varias tareas de una imagen ejecutadas en paralelo. Cada salida consume créditos según tipo, resolución y coste futuro de API.',
      },
      {
        question: '¿Se cobran las tareas fallidas?',
        answer:
          'Cuando se conecte la API real, las tareas fallidas tendrán lógica de reembolso.',
      },
      {
        question: '¿Puedo generar solo principales o solo detalles?',
        answer:
          'Sí. Cada tarjeta se configura y genera por separado, o se ejecuta junto con el lote.',
      },
      {
        question: '¿Cambiará la forma del producto?',
        answer:
          'El objetivo es preservar la estructura del producto y rediseñar fondo, iluminación y escena.',
      },
    ],
  },
};

export default function FaqSection({
  locale = 'en',
}: {
  locale?: ProductLocale;
}) {
  const m = FAQ_COPY[locale];

  return (
    <section id="faqs" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <HeaderSection title={m.title} subtitle={m.subtitle} />
        </ScrollReveal>

        <ScrollReveal delay={150} className="mx-auto mt-12 max-w-4xl">
          <Accordion className="ring-primary/10 w-full rounded-2xl border border-primary/15 px-4 py-3 shadow-sm ring-4 dark:ring-primary/5 dark:border-primary/10 sm:px-8">
            {m.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                className="border-dashed"
              >
                <AccordionTrigger className="text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
