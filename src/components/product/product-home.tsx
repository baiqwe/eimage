import {
  IconArrowRight,
  IconBolt,
  IconCameraSpark,
  IconChecklist,
  IconHistory,
  IconPhotoScan,
  IconShieldCheck,
  IconShoppingBag,
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
    badge: 'AI Ecommerce Product Photo Generator',
    title: '面向电商卖家的 AI 商品套图生成器',
    description:
      '上传一张商品图，批量生成平台主图、白底图、详情页场景图和广告素材。SuiteWorkbench 会尽量保留商品原始形貌，把背景、光影和场景重新设计成可上架的电商视觉资产。',
    start: '进入生成器',
    pricing: '查看定价',
    trust: '为 Amazon、Shopify、Etsy、独立站和高频上新团队设计',
    previewTitle: '一张图生成一套电商图',
    source: '原始商品图',
    output: '电商套图',
    previewText:
      '首页专注承接 AI Ecommerce Product Photo Generator 这个核心意图：不是单张玩具图，而是可用于电商上新的完整商品图资产包。',
    metrics: [
      ['1 张', '商品素材输入'],
      ['4 类', '主图、白底、场景、广告'],
      ['并发', '多任务套图生成'],
    ],
    setTitle: '为什么是电商套图，而不是单张图片',
    setBadge: '电商商品套图',
    setDescription:
      '电商上新需要的不只是一张漂亮图，而是一组用途明确、风格统一、能覆盖平台主图、详情页和投放素材的视觉资产。',
    setTypes: ['平台主图', '白底商品图', '生活方式详情图', '广告创意图'],
    sections: [
      {
        title: '为电商平台生成',
        text: '围绕 Amazon、Shopify、Etsy、独立站等平台的商品页场景设计图片用途和比例。',
      },
      {
        title: '批量生成商品套图',
        text: '一个商品素材可以同时规划多张主图、详情图和广告图，按单图任务并发执行。',
      },
      {
        title: '尽量保留商品形貌',
        text: '生成逻辑围绕原图主体重制背景和光影，减少商品结构、颜色、标签被 AI 改乱的风险。',
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
    badge: 'AI Ecommerce Product Photo Generator',
    title: 'AI Ecommerce Product Photo Generator',
    description:
      'Upload one product photo and generate a complete ecommerce photo set with AI: marketplace hero images, white-background product photos, lifestyle detail scenes, and ad creatives while preserving the original product shape.',
    start: 'Open generator',
    pricing: 'View pricing',
    trust:
      'Built for Amazon, Shopify, Etsy, DTC stores, and high-frequency ecommerce launches',
    previewTitle: 'One product photo to a full ecommerce set',
    source: 'Source photo',
    output: 'Ecommerce photo set',
    previewText:
      'This homepage focuses on one search intent: an AI ecommerce product photo generator that creates practical product photo sets, not one-off experimental images.',
    metrics: [
      ['1 input', 'Source product photo'],
      ['4 outputs', 'Hero, white background, lifestyle, ads'],
      ['Parallel', 'Batch photo-set generation'],
    ],
    setTitle: 'Built for ecommerce photo sets, not single images',
    setBadge: 'Ecommerce photo sets',
    setDescription:
      'A real product launch needs a consistent set of visuals for listings, product detail pages, campaigns, and store merchandising.',
    setTypes: [
      'Marketplace hero images',
      'White-background product photos',
      'Lifestyle detail scenes',
      'Ad creative crops',
    ],
    sections: [
      {
        title: 'Made for ecommerce platforms',
        text: 'Plan product visuals around Amazon, Shopify, Etsy, and DTC listing needs instead of generic image generation.',
      },
      {
        title: 'Batch product photo sets',
        text: 'Turn one source image into multiple single-image tasks that can run in parallel with separate styles, ratios, and prompts.',
      },
      {
        title: 'Preserve product structure',
        text: 'Redesign background, lighting, and scene mood around the uploaded product without randomly changing shape, color, labels, or silhouette.',
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
    badge: 'AI Ecommerce Product Photo Generator',
    title: 'EC 向け AI 商品フォト生成ツール',
    description:
      '1 枚の商品写真から、EC の主画像、白背景画像、ライフスタイル詳細シーン、広告素材をまとめて生成します。商品の形状を保ちながら、背景と光を再設計します。',
    start: '生成ツールを開く',
    pricing: '料金を見る',
    trust: 'Amazon、Shopify、Etsy、DTC ストア、高頻度の商品投入向け',
    previewTitle: '1 枚の商品写真から EC 画像セットへ',
    source: '元の商品写真',
    output: 'EC 画像セット',
    previewText:
      '単発の画像生成ではなく、商品ページと広告に使える一貫した EC 商品画像セットを作ることに特化しています。',
    metrics: [
      ['1 枚', '商品素材'],
      ['4 種類', '主画像、白背景、詳細、広告'],
      ['並列', '複数タスク生成'],
    ],
    setTitle: '単画像ではなく、EC 商品画像セットを生成',
    setBadge: 'EC 商品画像セット',
    setDescription:
      '商品投入には、リスティング、詳細ページ、広告、ストア表示に使える統一感のある画像セットが必要です。',
    setTypes: [
      'マーケットプレイス主画像',
      '白背景商品画像',
      'ライフスタイル詳細シーン',
      '広告クリエイティブ',
    ],
    sections: [
      {
        title: 'EC プラットフォーム向け',
        text: 'Amazon、Shopify、Etsy、DTC の商品ページ用途に合わせて構図と比率を設計します。',
      },
      {
        title: '商品画像セットを一括生成',
        text: '1 つの素材から複数の単画像タスクを作成し、スタイル、比率、Prompt ごとに並列実行できます。',
      },
      {
        title: '商品構造を維持',
        text: '背景、照明、シーンを再設計しながら、形状、色、ラベル、シルエットの変化を抑えます。',
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
    badge: 'AI Ecommerce Product Photo Generator',
    title: '이커머스용 AI 상품 사진 생성기',
    description:
      '상품 사진 한 장으로 마켓플레이스 메인 이미지, 흰 배경 상품 사진, 라이프스타일 상세 장면, 광고 소재를 한 번에 생성합니다. 상품 형태를 유지하면서 배경과 조명을 재설계합니다.',
    start: '생성기 열기',
    pricing: '요금 보기',
    trust: 'Amazon, Shopify, Etsy, DTC 스토어와 빠른 상품 출시 팀을 위해 설계',
    previewTitle: '상품 사진 한 장에서 이커머스 이미지 세트로',
    source: '원본 상품 사진',
    output: '이커머스 사진 세트',
    previewText:
      '단일 실험 이미지가 아니라 상품 페이지와 광고에 쓸 수 있는 일관된 이커머스 상품 사진 세트를 만드는 데 집중합니다.',
    metrics: [
      ['1장', '상품 원본'],
      ['4종', '메인, 흰 배경, 상세, 광고'],
      ['병렬', '배치 사진 세트 생성'],
    ],
    setTitle: '단일 이미지가 아닌 이커머스 사진 세트',
    setBadge: '이커머스 사진 세트',
    setDescription:
      '상품 출시는 리스팅, 상세 페이지, 캠페인, 스토어 머천다이징에 맞는 일관된 이미지 세트를 필요로 합니다.',
    setTypes: [
      '마켓플레이스 메인 이미지',
      '흰 배경 상품 사진',
      '라이프스타일 상세 장면',
      '광고 소재 크롭',
    ],
    sections: [
      {
        title: '이커머스 플랫폼용',
        text: 'Amazon, Shopify, Etsy, DTC 상품 페이지 요구에 맞춰 상품 이미지를 설계합니다.',
      },
      {
        title: '상품 사진 세트 일괄 생성',
        text: '하나의 소스 이미지에서 여러 단일 이미지 작업을 만들고 스타일, 비율, Prompt별로 병렬 실행합니다.',
      },
      {
        title: '상품 구조 유지',
        text: '배경, 조명, 장면 분위기를 재설계하면서 형태, 색상, 라벨, 실루엣 변경을 줄입니다.',
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
    badge: 'AI Ecommerce Product Photo Generator',
    title: 'Generador IA de fotos de producto para ecommerce',
    description:
      'Sube una foto de producto y genera un set completo para ecommerce: imágenes principales, fondo blanco, escenas lifestyle y creatividades publicitarias, manteniendo la forma original del producto.',
    start: 'Abrir generador',
    pricing: 'Ver precios',
    trust:
      'Diseñado para Amazon, Shopify, Etsy, tiendas DTC y equipos con lanzamientos frecuentes',
    previewTitle: 'De una foto a un set ecommerce completo',
    source: 'Foto original',
    output: 'Set de fotos ecommerce',
    previewText:
      'La página se centra en una intención: un generador IA de fotos de producto para ecommerce que crea sets útiles, no imágenes sueltas.',
    metrics: [
      ['1 entrada', 'Foto de producto'],
      ['4 salidas', 'Hero, fondo blanco, lifestyle, anuncios'],
      ['Paralelo', 'Generación por lote'],
    ],
    setTitle: 'Pensado para sets ecommerce, no imágenes sueltas',
    setBadge: 'Sets de fotos ecommerce',
    setDescription:
      'Un lanzamiento real necesita imágenes consistentes para listings, páginas de detalle, campañas y merchandising.',
    setTypes: [
      'Imágenes principales',
      'Fotos con fondo blanco',
      'Escenas lifestyle',
      'Recortes para anuncios',
    ],
    sections: [
      {
        title: 'Para plataformas ecommerce',
        text: 'Planifica imágenes para Amazon, Shopify, Etsy y tiendas DTC en lugar de generar imágenes genéricas.',
      },
      {
        title: 'Sets de producto por lote',
        text: 'Convierte una imagen fuente en varias tareas independientes con estilos, proporciones y Prompts específicos.',
      },
      {
        title: 'Conserva la estructura',
        text: 'Rediseña fondo, luz y escena sin cambiar aleatoriamente forma, color, etiquetas o silueta.',
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
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {t.metrics.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#dfe3d8] bg-white px-4 py-3 shadow-sm"
                >
                  <p className="font-bold text-[#20231e] text-xl">{value}</p>
                  <p className="mt-1 text-[#74796d] text-xs leading-5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
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

      <section className="border-[#dfe3d8] border-t bg-[#fbfcf7] px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[#dfe3d8] bg-white px-3 py-1.5 font-medium text-[#2f5f4f] text-sm shadow-sm">
              <IconShoppingBag className="size-4" />
              {t.setBadge}
            </div>
            <h2 className="max-w-2xl text-balance font-bold text-3xl tracking-tight md:text-4xl">
              {t.setTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[#5f6759] leading-7">
              {t.setDescription}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.setTypes.map((item, index) => (
              <div
                key={item}
                className="rounded-lg border border-[#dfe3d8] bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-[#eef6f0] text-[#2f5f4f]">
                  <IconChecklist className="size-5" />
                </div>
                <p className="font-semibold">{item}</p>
                <p className="mt-2 text-[#74796d] text-sm">
                  0{index + 1} / {t.output}
                </p>
              </div>
            ))}
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
