import {
  IconArrowRight,
  IconBolt,
  IconCameraSpark,
  IconHistory,
  IconPhotoScan,
  IconShieldCheck,
  IconWand,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ProductGallerySection } from '@/components/product/product-gallery';
import {
  ProductLanguageSelect,
  type ProductLocale,
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
    source: '原始商品图',
    output: '生成资产包',
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
    linksTitle: '继续探索 SuiteWorkbench',
    links: [
      {
        title: '查看生成画廊',
        text: '浏览主图、详情图和不同品类的场景样例。',
        href: Routes.Gallery,
      },
      {
        title: '商品背景生成器',
        text: '为平台主图和独立站商品页生成干净背景。',
        href: '/tools/product-background-generator',
      },
      {
        title: '珠宝背景生成器',
        text: '查看珠宝、金属、宝石材质的光影方案。',
        href: '/tools/jewelry-background-generator',
      },
      {
        title: '定价与点数',
        text: '了解订阅、点数包和批量生成成本。',
        href: Routes.Pricing,
      },
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
    source: 'Source photo',
    output: 'Generated pack',
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
    linksTitle: 'Keep exploring SuiteWorkbench',
    links: [
      {
        title: 'Browse the gallery',
        text: 'See main images, detail scenes, and category examples.',
        href: Routes.Gallery,
      },
      {
        title: 'Product background generator',
        text: 'Create clean scenes for marketplaces and product pages.',
        href: '/tools/product-background-generator',
      },
      {
        title: 'Jewelry background generator',
        text: 'Explore lighting ideas for metal, gems, and close-up detail.',
        href: '/tools/jewelry-background-generator',
      },
      {
        title: 'Pricing and credits',
        text: 'Compare subscriptions, credit packs, and batch generation costs.',
        href: Routes.Pricing,
      },
    ],
  },
  ja: {
    badge: 'EC チーム向け AI 商品撮影ワークベンチ',
    title: '1 枚の商品写真から、高品質なビジュアル一式を生成',
    description:
      'SuiteWorkbench は商品の形状を保ちながら、主画像、詳細ページ用シーン、追跡可能な Prompt、再利用できる制作履歴を生成します。',
    start: '生成ツールを開く',
    pricing: '料金を見る',
    trust: 'ログイン、サブスク、クレジット、生成履歴、素材再利用に対応',
    previewTitle: '素材から画像セットへ',
    source: '元の商品写真',
    output: '生成された素材セット',
    previewText:
      '商品画像と説明をアップロードすると、スタイル、Prompt、照明、シーンを自動で設計します。',
    sections: [
      {
        title: '商品構造を維持',
        text: '元画像の形状やブランド細部を変えずに、背景と光だけを作り直します。',
      },
      {
        title: '複数タスクの素材パック',
        text: '主画像と詳細画像を、スタイル、比率、解像度ごとに個別生成できます。',
      },
      {
        title: '生成履歴を再利用',
        text: '元画像、Prompt、スタイル、結果画像、クレジット記録を保存します。',
      },
    ],
    workflowTitle: 'SaaS の基本フローに対応',
    workflow: [
      'ログイン',
      'プランまたはクレジットを選択',
      '商品素材をアップロード',
      '生成して履歴保存',
    ],
    linksTitle: 'SuiteWorkbench をさらに見る',
    links: [
      {
        title: 'ギャラリーを見る',
        text: '主画像、詳細シーン、カテゴリ別サンプルを確認できます。',
        href: Routes.Gallery,
      },
      {
        title: '商品背景生成器',
        text: 'モールや商品ページ向けのクリーンな背景を作成します。',
        href: '/tools/product-background-generator',
      },
      {
        title: 'ジュエリー背景生成器',
        text: '金属、宝石、接写ディテールの照明例を見られます。',
        href: '/tools/jewelry-background-generator',
      },
      {
        title: '料金とクレジット',
        text: 'サブスク、クレジット、バッチ生成コストを確認します。',
        href: Routes.Pricing,
      },
    ],
  },
  ko: {
    badge: '이커머스 팀을 위한 AI 상품 촬영 워크벤치',
    title: '상품 사진 한 장으로 고품질 비주얼 세트를 생성',
    description:
      'SuiteWorkbench는 상품 형태를 유지하면서 메인 이미지, 상세 페이지 장면, 추적 가능한 Prompt, 재사용 가능한 제작 기록을 생성합니다.',
    start: '생성기 열기',
    pricing: '요금 보기',
    trust: '로그인, 구독, 크레딧, 생성 기록, 에셋 재사용 지원',
    previewTitle: '소스 이미지에서 에셋 팩까지',
    source: '원본 상품 사진',
    output: '생성된 에셋 팩',
    previewText:
      '상품 이미지와 기본 설명을 업로드하면 스타일, Prompt, 조명, 장면을 자동으로 설계합니다.',
    sections: [
      {
        title: '상품 구조 유지',
        text: '원본 상품의 형태, 각도, 브랜드 디테일을 유지하며 배경과 조명을 재구성합니다.',
      },
      {
        title: '멀티태스크 에셋 팩',
        text: '메인 이미지와 상세 이미지를 스타일, 비율, 해상도별로 독립 생성합니다.',
      },
      {
        title: '생성 기록 재사용',
        text: '원본 이미지, Prompt, 스타일, 결과 이미지, 크레딧 기록을 저장합니다.',
      },
    ],
    workflowTitle: 'SaaS 흐름 준비 완료',
    workflow: [
      '계정 로그인',
      '플랜 또는 크레딧 선택',
      '상품 소재 업로드',
      '생성 후 기록 저장',
    ],
    linksTitle: 'SuiteWorkbench 더 살펴보기',
    links: [
      {
        title: '갤러리 보기',
        text: '메인 이미지, 상세 장면, 카테고리별 예시를 확인합니다.',
        href: Routes.Gallery,
      },
      {
        title: '상품 배경 생성기',
        text: '마켓플레이스와 상품 페이지용 깔끔한 배경을 만듭니다.',
        href: '/tools/product-background-generator',
      },
      {
        title: '주얼리 배경 생성기',
        text: '금속, 보석, 클로즈업 디테일 조명 아이디어를 봅니다.',
        href: '/tools/jewelry-background-generator',
      },
      {
        title: '요금 및 크레딧',
        text: '구독, 크레딧 팩, 배치 생성 비용을 비교합니다.',
        href: Routes.Pricing,
      },
    ],
  },
  es: {
    badge: 'Mesa de fotografía IA para equipos ecommerce',
    title: 'Convierte una foto de producto en un paquete visual completo',
    description:
      'SuiteWorkbench conserva la forma original del producto y genera imágenes principales, escenas de detalle, Prompts trazables e historial creativo reutilizable.',
    start: 'Abrir generador',
    pricing: 'Ver precios',
    trust:
      'Compatible con login, suscripciones, créditos, historial y reutilización de assets',
    previewTitle: 'De imagen fuente a paquete visual',
    source: 'Foto original',
    output: 'Paquete generado',
    previewText:
      'Sube una imagen y una descripción; el sistema planifica estilos, Prompt, iluminación y escenas.',
    sections: [
      {
        title: 'Conserva la estructura',
        text: 'Rediseña fondo e iluminación sin inventar nuevos ángulos, formas ni detalles de marca.',
      },
      {
        title: 'Paquetes multitarea',
        text: 'Configura imágenes principales y de detalle con estilos, proporciones y resoluciones independientes.',
      },
      {
        title: 'Historial reutilizable',
        text: 'Guarda imagen fuente, Prompt, estilo, resultado y consumo de créditos para iterar.',
      },
    ],
    workflowTitle: 'Flujo SaaS listo',
    workflow: [
      'Iniciar sesión',
      'Elegir plan o créditos',
      'Subir producto',
      'Generar y guardar historial',
    ],
    linksTitle: 'Explora más SuiteWorkbench',
    links: [
      {
        title: 'Ver la galería',
        text: 'Revisa imágenes principales, escenas de detalle y ejemplos por categoría.',
        href: Routes.Gallery,
      },
      {
        title: 'Generador de fondos',
        text: 'Crea fondos limpios para marketplaces y páginas de producto.',
        href: '/tools/product-background-generator',
      },
      {
        title: 'Fondos para joyería',
        text: 'Explora iluminación para metal, gemas y detalles cercanos.',
        href: '/tools/jewelry-background-generator',
      },
      {
        title: 'Precios y créditos',
        text: 'Compara suscripciones, créditos y costes por lote.',
        href: Routes.Pricing,
      },
    ],
  },
} as const;

const featureIcons = [IconPhotoScan, IconWand, IconHistory];

export function ProductHome({
  locale: fixedLocale,
}: {
  locale?: ProductLocale;
}) {
  const { locale, setLocale } = useProductLocale(fixedLocale);
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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.previewTitle}</p>
                  <p className="text-[#c8cec0] text-sm">SuiteWorkbench</p>
                </div>
                <IconBolt className="size-5 text-[#e1a95f]" />
              </div>
              <div className="grid gap-4 md:grid-cols-[0.82fr_1.18fr]">
                <div>
                  <p className="mb-2 text-[#c8cec0] text-xs">{t.source}</p>
                  <div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-[#eef1e8] p-5">
                    <div className="h-24 w-20 rounded-[28px] border-8 border-[#f7f8f4] bg-[#d9ded1] shadow-2xl">
                      <div className="mx-auto mt-3 h-8 w-10 rounded-full border-4 border-[#9aa48d]" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[#c8cec0] text-xs">{t.output}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-square rounded-lg bg-[#f8faf2] p-4">
                      <div className="mx-auto mt-6 h-16 w-14 rounded-[20px] border-6 border-white bg-[#d9ded1] shadow-xl" />
                    </div>
                    <div className="aspect-square rounded-lg bg-[#2f5f4f] p-4">
                      <div className="mx-auto mt-7 h-14 w-12 rounded-[18px] border-6 border-[#f7f8f4] bg-[#d9ded1] shadow-xl" />
                    </div>
                    <div className="aspect-square rounded-lg bg-[#c9822f] p-4">
                      <div className="mx-auto mt-7 h-14 w-12 rounded-[18px] border-6 border-[#fff8e8] bg-[#d9ded1] shadow-xl" />
                    </div>
                    <div className="aspect-square rounded-lg bg-[#dfe3d8] p-4">
                      <div className="mx-auto mt-7 h-14 w-12 rounded-[18px] border-6 border-white bg-[#cbd1c4] shadow-xl" />
                    </div>
                  </div>
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

      <ProductGallerySection locale={locale} limit={3} />

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

      <section className="border-[#dfe3d8] border-t bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-bold text-2xl">{t.linksTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.links.map((item) => (
              <Link
                className="group rounded-lg border border-[#dfe3d8] bg-[#fbfcf7] p-5 transition hover:-translate-y-0.5 hover:border-[#2f5f4f] hover:shadow-sm"
                key={item.href}
                to={item.href}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <IconArrowRight className="size-4 shrink-0 text-[#2f5f4f] transition group-hover:translate-x-0.5" />
                </div>
                <p className="mt-3 text-[#5f6759] text-sm leading-6">
                  {item.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
