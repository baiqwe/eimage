import {
  IconBolt,
  IconCameraSpark,
  IconHistory,
  IconPhotoScan,
  IconShieldCheck,
  IconWand,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';
import { Routes } from '@/lib/routes';

const COPY = {
  zh: {
    badge: '专为电商卖家的 AI 商品摄影工作台',
    title: '一张商品图，生成一整套高质感视觉资产',
    description:
      'SuiteWorkbench 帮你保留商品原始形貌，批量生成主图、详情页场景图和可追溯的 Prompt，让独立站、Amazon、Shopify 卖家更快完成上新。',
    start: '进入生成器',
    pricing: '查看定价',
    trust: '支持登录、订阅、点数扣费、生成历史与资产复用',
    previewTitle: '从素材到套图',
    previewText:
      '上传商品图与基础描述，系统自动规划风格、Prompt、光影和场景，后续可接入真实生图 API。',
    sections: [
      {
        title: '锁定商品结构',
        text: '围绕原始商品图做背景和光影重制，避免 AI 乱改角度、形状和品牌细节。',
      },
      {
        title: '多任务资产包',
        text: '一次配置多张主图和详情图，按风格、比例、分辨率独立生成。',
      },
      {
        title: '生成历史可复用',
        text: '保留原图、Prompt、风格、结果图和扣点记录，方便复用与迭代。',
      },
    ],
    workflowTitle: '真实 SaaS 流程已就位',
    workflow: [
      '登录账户',
      '选择订阅或点数包',
      '上传商品素材',
      '生成并保存历史',
    ],
  },
  en: {
    badge: 'AI product photography workbench for commerce teams',
    title: 'Turn one product photo into a complete visual asset suite',
    description:
      'SuiteWorkbench preserves the original product shape while generating main images, detail-page scenes, traceable prompts, and reusable creative history for Shopify, Amazon, and DTC sellers.',
    start: 'Open generator',
    pricing: 'View pricing',
    trust:
      'Built for login, subscriptions, credits, generation history, and asset reuse',
    previewTitle: 'From source image to asset pack',
    previewText:
      'Upload a product image and base description. The system plans styles, prompts, lighting, and scenes, ready for a real image-generation API.',
    sections: [
      {
        title: 'Preserve product structure',
        text: 'Redesign backgrounds and lighting around the source image without inventing new angles, shapes, or brand details.',
      },
      {
        title: 'Multi-task asset packs',
        text: 'Configure several main and detail images with independent styles, ratios, and resolutions.',
      },
      {
        title: 'Reusable generation history',
        text: 'Keep source images, prompts, styles, results, and credit records for iteration.',
      },
    ],
    workflowTitle: 'SaaS-ready product flow',
    workflow: [
      'Sign in',
      'Choose plan or credits',
      'Upload product source',
      'Generate and save history',
    ],
  },
} as const;

const featureIcons = [IconPhotoScan, IconWand, IconHistory];

export function ProductHome() {
  const { locale, setLocale } = useProductLocale();
  const t = COPY[locale];

  return (
    <div className="bg-[#f7f8f4] text-[#20231e]">
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-[#dfe3d8] bg-white px-3 py-1.5 font-medium text-sm shadow-sm">
                <IconCameraSpark className="size-4 text-[#2f5f4f]" />
                {t.badge}
              </span>
              <ProductLanguageSelect
                locale={locale}
                onLocaleChange={setLocale}
              />
            </div>
            <h1 className="max-w-3xl text-balance font-bold text-4xl tracking-tight md:text-6xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[#5f6759] text-lg leading-8">
              {t.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                render={<Link to={Routes.Generator} />}
                className="h-10 bg-[#20231e] px-5 hover:bg-[#30352d]"
              >
                <IconWand className="size-4" />
                {t.start}
              </Button>
              <Button
                render={<Link to={Routes.Pricing} />}
                variant="outline"
                className="h-10 px-5"
              >
                {t.pricing}
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-[#74796d] text-sm">
              <IconShieldCheck className="size-4 text-[#2f5f4f]" />
              {t.trust}
            </p>
          </div>

          <div className="rounded-lg border border-[#dfe3d8] bg-white p-4 shadow-sm">
            <div className="rounded-lg bg-[#20231e] p-5 text-[#f7f8f4]">
              <div className="mb-12 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.previewTitle}</p>
                  <p className="text-[#c8cec0] text-sm">SuiteWorkbench</p>
                </div>
                <IconBolt className="size-5 text-[#e1a95f]" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="aspect-[4/5] rounded-lg bg-[#eef1e8]" />
                <div className="space-y-3">
                  <div className="h-20 rounded-lg bg-[#2f5f4f]" />
                  <div className="h-20 rounded-lg bg-[#c9822f]" />
                  <div className="h-20 rounded-lg bg-[#dfe3d8]" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[#5f6759] text-sm leading-6">
              {t.previewText}
            </p>
          </div>
        </div>
      </section>

      <section className="border-[#dfe3d8] border-t bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {t.sections.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-[#dfe3d8] bg-[#fbfcf7] p-5"
              >
                <Icon className="mb-5 size-6 text-[#2f5f4f]" />
                <h2 className="font-semibold text-lg">{feature.title}</h2>
                <p className="mt-2 text-[#5f6759] text-sm leading-6">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl rounded-lg border border-[#dfe3d8] bg-[#eef6f0] p-6">
          <h2 className="font-bold text-2xl">{t.workflowTitle}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {t.workflow.map((step, index) => (
              <div
                key={step}
                className="rounded-lg border border-[#cbdcd2] bg-white p-4"
              >
                <span className="text-[#2f5f4f] text-sm">0{index + 1}</span>
                <p className="mt-2 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
