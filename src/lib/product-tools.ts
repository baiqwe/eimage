export type ProductTool = {
  slug: string;
  aliases?: string[];
  category: string;
  title: string;
  titleZh: string;
  navTitle: string;
  navTitleZh: string;
  navDescription: string;
  navDescriptionZh: string;
  description: string;
  descriptionZh: string;
  h1: string;
  h1Zh: string;
  imageAlt: string;
  imageAltZh: string;
  visual:
    | 'studio'
    | 'jewelry'
    | 'shoe'
    | 'set'
    | 'white'
    | 'marketplace'
    | 'cosmetic';
  navGroup: 'core' | 'background' | 'platform' | 'category';
  useCases: string[];
  useCasesZh: string[];
  styles: string[];
  painPoints: string[];
  painPointsZh: string[];
  faqs: Array<{ question: string; answer: string }>;
  faqsZh: Array<{ question: string; answer: string }>;
};

export type ProductToolCopy = {
  category: string;
  title: string;
  description: string;
  h1: string;
  imageAlt: string;
  useCases: string[];
  painPoints: string[];
  faqs: Array<{ question: string; answer: string }>;
  bestFor: string;
  whyTitle: string;
  faqTitle: string;
  styles: string;
  openGenerator: string;
  viewPricing: string;
  home: string;
  tools: string;
};

export const PRODUCT_TOOLS: ProductTool[] = [
  {
    slug: 'batch-product-photo-generator',
    category: 'Batch Generation',
    title: 'Batch Product Photo Generator',
    titleZh: '批量商品图生成器',
    navTitle: 'Batch product photo generator',
    navTitleZh: '批量生成',
    navDescription: 'Run multiple product photo tasks from one upload.',
    navDescriptionZh: '一张商品图并行生成多张主图和详情图。',
    description:
      'Upload one source product photo and create multiple ecommerce-ready images in parallel for launches, ads, and product pages.',
    descriptionZh:
      '上传一张商品素材图，并行生成多张适合上新、广告和详情页的电商商品图。',
    h1: 'Batch product photo generator for ecommerce image sets',
    h1Zh: '面向电商套图的批量商品图生成器',
    imageAlt:
      'Batch AI product photo generator creating main images, detail scenes, and ad crops',
    imageAltZh: '批量生成主图、详情图和广告裁切的 AI 商品图工具样例',
    visual: 'set',
    navGroup: 'core',
    useCases: ['Launch image sets', 'Ad creative batches', 'Catalog refreshes'],
    useCasesZh: ['新品套图', '广告素材批量生成', '商品目录翻新'],
    styles: ['Marketplace Set', 'Campaign Set'],
    painPoints: [
      'Create several single-image generation tasks from the same source photo.',
      'Keep product shape consistent while changing scene, light, and crop.',
      'Prepare launch assets faster than editing every image one by one.',
    ],
    painPointsZh: [
      '基于同一张商品图创建多个单图生成任务。',
      '在改变场景、光影和裁切时保持商品形貌一致。',
      '比逐张修图更快准备上新素材。',
    ],
    faqs: [
      {
        question: 'Is batch generation one big task or multiple tasks?',
        answer:
          'It is organized as multiple single-image tasks that can run in parallel, so every output can keep its own prompt, ratio, and style.',
      },
      {
        question: 'Can I generate main images and detail scenes together?',
        answer:
          'Yes. The workbench is built for mixed queues with marketplace main images, lifestyle detail scenes, and ad crops.',
      },
    ],
    faqsZh: [
      {
        question: '批量生成是一个大任务还是多个任务？',
        answer:
          '它会被组织成多个单图任务并行执行，因此每张输出都能保留独立的提示词、比例和风格。',
      },
      {
        question: '可以同时生成主图和详情图吗？',
        answer:
          '可以。工作台支持混合任务队列，同时生成平台主图、生活方式详情图和广告裁切。',
      },
    ],
  },
  {
    slug: 'product-photo-set-generator',
    category: 'Photo Set Generator',
    title: 'Product Photo Set Generator',
    titleZh: '商品套图生成器',
    navTitle: 'Product photo set generator',
    navTitleZh: '套图生成',
    navDescription: 'Turn one product photo into a complete ecommerce set.',
    navDescriptionZh: '一张图生成完整电商商品套图。',
    description:
      'Generate a coordinated set of product photos including hero shots, lifestyle scenes, and detail-page visuals from one upload.',
    descriptionZh:
      '从一张上传图生成统一风格的主图、生活方式场景图和详情页视觉。',
    h1: 'Product photo set generator from one source image',
    h1Zh: '一张素材图生成完整商品套图',
    imageAlt:
      'AI product photo set generator showing coordinated ecommerce image outputs',
    imageAltZh: '展示统一电商套图输出的 AI 商品套图生成器样例',
    visual: 'set',
    navGroup: 'core',
    useCases: ['Main image sets', 'Detail page sets', 'Brand style refreshes'],
    useCasesZh: ['主图套组', '详情页套图', '品牌视觉翻新'],
    styles: ['Studio + Lifestyle Pack', 'Premium Listing Pack'],
    painPoints: [
      'Generate a consistent visual package instead of isolated images.',
      'Match lighting, surface, and scene direction across the set.',
      'Build product pages with enough variety from a single source asset.',
    ],
    painPointsZh: [
      '生成统一的视觉资产包，而不是零散图片。',
      '让整套图的光线、材质台面和场景方向保持一致。',
      '用一张素材图为商品页准备足够多的展示变化。',
    ],
    faqs: [
      {
        question: 'What is included in a product photo set?',
        answer:
          'A typical set includes a clean main image, one or more lifestyle scenes, detail-page visuals, and optional ad crops.',
      },
      {
        question: 'Can each image in the set use a different ratio?',
        answer:
          'Yes. Each task card can use its own ratio and resolution while sharing the same source product image.',
      },
    ],
    faqsZh: [
      {
        question: '商品套图通常包含哪些图片？',
        answer:
          '通常包含干净主图、一个或多个生活方式场景、详情页视觉，以及可选的广告裁切。',
      },
      {
        question: '套图里的每张图可以用不同尺寸吗？',
        answer:
          '可以。每张任务卡都可以独立设置比例和分辨率，同时共享同一张商品素材图。',
      },
    ],
  },
  {
    slug: 'product-background-generator',
    category: 'Background Generator',
    title: 'Product Background Generator for Ecommerce',
    titleZh: '电商商品背景生成器',
    navTitle: 'Product background generator',
    navTitleZh: '商品背景生成器',
    navDescription: 'Clean studio, marketplace, and lifestyle backgrounds.',
    navDescriptionZh: '生成白底、棚拍和生活方式商品背景。',
    description:
      'Create clean studio backgrounds and lifestyle scenes from one product image while preserving the original product shape.',
    descriptionZh:
      '上传一张商品图，生成白底、棚拍和生活方式场景背景，同时保持商品原始形貌。',
    h1: 'Product background generator for marketplace-ready images',
    h1Zh: '面向电商上新的商品背景生成器',
    imageAlt:
      'AI generated ecommerce product background examples with preserved product shape',
    imageAltZh: '保持商品原始形貌的 AI 电商商品背景生成样例',
    visual: 'studio',
    navGroup: 'background',
    useCases: [
      'Marketplace main images',
      'Shopify product pages',
      'Ad creative variations',
    ],
    useCasesZh: ['平台主图', '独立站商品页', '广告素材变体'],
    styles: ['Pure Studio Key Light', 'Soft Shadow Marketplace'],
    painPoints: [
      'Unify catalog backgrounds without re-shooting every SKU.',
      'Create marketplace-ready white and soft-shadow scenes from one upload.',
      'Keep the product silhouette and label placement stable across variants.',
    ],
    painPointsZh: [
      '不用重新拍摄每个 SKU，也能统一商品目录背景。',
      '基于一张上传图生成白底和柔和阴影的上架场景。',
      '在不同变体中尽量保持商品轮廓和标签位置稳定。',
    ],
    faqs: [
      {
        question: 'Can I create a white-background product photo?',
        answer:
          'Yes. Use a studio or marketplace preset to keep the product centered while replacing the background with a clean white or soft-shadow scene.',
      },
      {
        question: 'Will the product shape change?',
        answer:
          'The workflow is designed around preserving the uploaded product silhouette while changing background, lighting, and atmosphere.',
      },
    ],
    faqsZh: [
      {
        question: '可以生成白底商品图吗？',
        answer:
          '可以。选择棚拍或平台主图风格后，系统会尽量保持商品居中和轮廓稳定，同时替换为干净白底或柔和阴影背景。',
      },
      {
        question: '商品形状会被改掉吗？',
        answer:
          '整体流程围绕保留上传商品的主体轮廓设计，主要改变背景、光影和氛围。',
      },
    ],
  },
  {
    slug: 'white-background-product-photo',
    category: 'White Background',
    title: 'White Background Product Photo',
    titleZh: '白底商品图生成器',
    navTitle: 'White background product photo',
    navTitleZh: '白底图',
    navDescription: 'Create marketplace-ready white product photos.',
    navDescriptionZh: '生成适合平台上架的干净白底商品图。',
    description:
      'Create clean white-background product photos with soft shadows, centered composition, and marketplace-ready framing.',
    descriptionZh:
      '生成干净白底商品图，包含柔和阴影、居中构图和适合平台上架的画面边距。',
    h1: 'White background product photo generator for ecommerce listings',
    h1Zh: '适合电商上架的白底商品图生成器',
    imageAlt:
      'White background product photo generator with soft ecommerce shadow',
    imageAltZh: '带柔和电商阴影的白底商品图生成器样例',
    visual: 'white',
    navGroup: 'background',
    useCases: ['Marketplace listings', 'Catalog thumbnails', 'SKU refreshes'],
    useCasesZh: ['平台上架图', '目录缩略图', 'SKU 翻新'],
    styles: ['Pure White Studio', 'Soft Shadow Listing'],
    painPoints: [
      'Create clean white product photos without manual background removal.',
      'Keep the item centered with enough padding for marketplace listings.',
      'Add a subtle contact shadow so the product does not look pasted on.',
    ],
    painPointsZh: [
      '无需手动抠图也能生成干净白底商品图。',
      '保持商品居中并预留平台上架所需边距。',
      '加入轻微接触阴影，避免商品像被生硬贴上去。',
    ],
    faqs: [
      {
        question: 'Is this suitable for marketplace listing photos?',
        answer:
          'Yes. The page focuses on white-background listing visuals with centered composition and restrained shadows.',
      },
      {
        question: 'Can I use it for catalog thumbnails?',
        answer:
          'Yes. White-background outputs are useful for catalog grids, SKU pages, and comparison layouts.',
      },
    ],
    faqsZh: [
      {
        question: '适合平台上架主图吗？',
        answer: '适合。这个页面聚焦白底上架图，强调居中构图和克制阴影。',
      },
      {
        question: '可以用于商品目录缩略图吗？',
        answer: '可以。白底输出适合商品目录、SKU 页面和对比展示布局。',
      },
    ],
  },
  {
    slug: 'amazon-product-photo-generator',
    category: 'Amazon Product Photos',
    title: 'Amazon Product Photo Generator',
    titleZh: 'Amazon 商品图生成器',
    navTitle: 'Amazon product photo generator',
    navTitleZh: 'Amazon 商品图',
    navDescription: 'Generate Amazon-style main images and A+ scenes.',
    navDescriptionZh: '生成 Amazon 风格主图和 A+ 页面场景图。',
    description:
      'Generate Amazon-style product photos with clean main images, feature scenes, and A+ content visuals from one product photo.',
    descriptionZh:
      '从一张商品图生成 Amazon 风格主图、功能展示场景和 A+ 页面视觉。',
    h1: 'Amazon product photo generator for listing image sets',
    h1Zh: '面向 Listing 套图的 Amazon 商品图生成器',
    imageAlt:
      'Amazon product photo generator for white main images and A plus content scenes',
    imageAltZh: '用于白底主图和 A+ 场景的 Amazon 商品图生成器样例',
    visual: 'marketplace',
    navGroup: 'platform',
    useCases: ['Amazon main images', 'A+ content scenes', 'Feature callouts'],
    useCasesZh: ['Amazon 主图', 'A+ 页面场景', '功能卖点图'],
    styles: ['Amazon Listing White', 'A+ Lifestyle Scene'],
    painPoints: [
      'Prepare clean main images and supporting detail visuals from one source.',
      'Create feature-focused scenes that explain product benefits quickly.',
      'Keep a consistent listing look across SKU variations.',
    ],
    painPointsZh: [
      '用一张素材图准备主图和辅助详情视觉。',
      '生成更聚焦卖点表达的功能场景图。',
      '让多个 SKU 变体的 Listing 视觉更统一。',
    ],
    faqs: [
      {
        question: 'Can it make Amazon main images?',
        answer:
          'It is designed for clean marketplace-style main images, while final compliance checks should follow your active Amazon category rules.',
      },
      {
        question: 'Can it create A+ content images?',
        answer:
          'Yes. You can add lifestyle and feature-detail task cards for A+ content sections.',
      },
    ],
    faqsZh: [
      {
        question: '可以生成 Amazon 主图吗？',
        answer:
          '可以生成干净的平台风格主图，但最终合规仍需以你当前类目的 Amazon 规则为准。',
      },
      {
        question: '可以生成 A+ 页面图片吗？',
        answer: '可以。你可以添加生活方式和功能详情任务卡，用于 A+ 页面模块。',
      },
    ],
  },
  {
    slug: 'shopify-product-image-generator',
    category: 'Shopify Product Images',
    title: 'Shopify Product Image Generator',
    titleZh: 'Shopify 商品图生成器',
    navTitle: 'Shopify product image generator',
    navTitleZh: 'Shopify 商品图',
    navDescription: 'Create consistent product visuals for Shopify stores.',
    navDescriptionZh: '为 Shopify 店铺生成统一商品视觉。',
    description:
      'Create consistent Shopify product images, collection thumbnails, and campaign visuals that fit a branded storefront.',
    descriptionZh: '为 Shopify 店铺生成统一的商品图、集合页缩略图和活动视觉。',
    h1: 'Shopify product image generator for branded storefronts',
    h1Zh: '面向品牌独立站的 Shopify 商品图生成器',
    imageAlt:
      'Shopify product image generator with branded ecommerce storefront visuals',
    imageAltZh: '带品牌独立站视觉风格的 Shopify 商品图生成器样例',
    visual: 'marketplace',
    navGroup: 'platform',
    useCases: ['Product pages', 'Collection grids', 'Campaign banners'],
    useCasesZh: ['商品详情页', '集合页网格', '活动横幅'],
    styles: ['Brand Studio', 'Lifestyle Collection'],
    painPoints: [
      'Keep product images visually consistent across your storefront.',
      'Create collection-friendly crops and detail scenes from the same product.',
      'Match image style to a brand mood instead of marketplace sameness.',
    ],
    painPointsZh: [
      '让独立站内的商品图保持一致视觉语言。',
      '从同一商品生成适合集合页和详情页的裁切。',
      '让图片风格贴合品牌氛围，而不是千篇一律的平台图。',
    ],
    faqs: [
      {
        question: 'Can it create images for Shopify collections?',
        answer:
          'Yes. Use square or portrait ratios for collection grids and keep style presets consistent across products.',
      },
      {
        question: 'Can I match my brand style?',
        answer:
          'Yes. The prompt can describe brand surfaces, lighting, and mood so outputs fit your storefront direction.',
      },
    ],
    faqsZh: [
      {
        question: '可以生成 Shopify 集合页图片吗？',
        answer:
          '可以。集合页通常适合方图或竖图比例，并在多个商品间保持相同风格预设。',
      },
      {
        question: '可以匹配我的品牌风格吗？',
        answer:
          '可以。提示词可以描述品牌材质、光线和氛围，让输出贴合独立站视觉方向。',
      },
    ],
  },
  {
    slug: 'jewelry-product-photography-ai',
    category: 'Jewelry Photography',
    aliases: ['jewelry-background-generator'],
    title: 'Jewelry Product Photography AI',
    titleZh: 'AI 珠宝商品摄影生成器',
    navTitle: 'Jewelry product photography AI',
    navTitleZh: '珠宝商品摄影',
    navDescription: 'Premium scenes for rings, necklaces, metal, and gems.',
    navDescriptionZh: '面向戒指、项链、金属和宝石的高级场景。',
    description:
      'Generate refined jewelry product photography with controlled reflections, premium shadows, and close-up detail composition.',
    descriptionZh:
      '为珠宝首饰生成高级背景、可控反射和细节页场景，突出金属、宝石和材质质感。',
    h1: 'Jewelry product photography AI with premium light control',
    h1Zh: '突出光泽和材质的 AI 珠宝商品摄影',
    imageAlt:
      'AI jewelry background generator with premium reflections and ecommerce detail scene',
    imageAltZh: '带高级反射和详情页场景的 AI 珠宝背景生成器样例',
    visual: 'jewelry',
    navGroup: 'category',
    useCases: ['Ring hero images', 'Necklace detail scenes', 'Luxury ad sets'],
    useCasesZh: ['戒指主图', '项链详情图', '高端广告套图'],
    styles: ['Minimal Reflection Plinth', 'Premium Dark Editorial'],
    painPoints: [
      'Control reflections so metal, gems, and polished surfaces feel premium.',
      'Create close-up detail scenes that highlight scale and material.',
      'Avoid generic lifestyle backgrounds that make jewelry look low value.',
    ],
    painPointsZh: [
      '控制反射效果，让金属、宝石和抛光表面更显高级。',
      '生成突出尺寸和材质的近景详情页场景。',
      '避免廉价感生活方式背景削弱珠宝价值感。',
    ],
    faqs: [
      {
        question: 'Can AI generate realistic reflections for rings?',
        answer:
          'The jewelry workflow uses darker editorial scenes, plinths, and controlled highlights to make reflections feel intentional rather than noisy.',
      },
      {
        question: 'What backgrounds work best for necklaces?',
        answer:
          'Minimal plinths, soft marble, dark editorial gradients, and warm side-light scenes usually work better than busy lifestyle backgrounds.',
      },
    ],
    faqsZh: [
      {
        question: 'AI 可以生成更真实的戒指反光吗？',
        answer:
          '珠宝场景会优先使用暗调编辑风、展台和受控高光，让反射看起来更克制、更有设计感。',
      },
      {
        question: '项链适合什么背景？',
        answer:
          '简洁展台、柔和大理石、暗调渐变和暖色侧光通常比复杂生活方式背景更适合项链展示。',
      },
    ],
  },
  {
    slug: 'cosmetic-product-photo-generator',
    category: 'Cosmetic Product Photos',
    title: 'Cosmetic Product Photo Generator',
    titleZh: '美妆商品图生成器',
    navTitle: 'Cosmetic product photo generator',
    navTitleZh: '美妆商品图',
    navDescription: 'Premium skincare, makeup, and beauty product scenes.',
    navDescriptionZh: '生成护肤、彩妆和美妆产品高级场景。',
    description:
      'Generate premium cosmetic product photos with clean reflections, water textures, soft gradients, and beauty campaign scenes.',
    descriptionZh:
      '生成带干净反射、水纹质感、柔和渐变和美妆广告氛围的高级商品图。',
    h1: 'Cosmetic product photo generator for beauty ecommerce',
    h1Zh: '面向美妆电商的商品图生成器',
    imageAlt:
      'Cosmetic product photo generator for skincare and beauty ecommerce scenes',
    imageAltZh: '用于护肤和彩妆电商场景的美妆商品图生成器样例',
    visual: 'cosmetic',
    navGroup: 'category',
    useCases: ['Skincare hero shots', 'Makeup detail scenes', 'Beauty ads'],
    useCasesZh: ['护肤品主图', '彩妆详情场景', '美妆广告图'],
    styles: ['Fresh Water Glow', 'Premium Vanity Studio'],
    painPoints: [
      'Create premium beauty visuals without arranging a full studio shoot.',
      'Use water, glass, and soft gradient scenes to highlight freshness.',
      'Keep packaging shape and label placement stable across variants.',
    ],
    painPointsZh: [
      '无需完整影棚拍摄，也能生成高级美妆视觉。',
      '用水纹、玻璃和柔和渐变突出清透感。',
      '在多种变体中保持包装形状和标签位置稳定。',
    ],
    faqs: [
      {
        question: 'Can it create skincare campaign visuals?',
        answer:
          'Yes. Cosmetic presets can use water textures, clean reflections, and soft gradients for skincare launches.',
      },
      {
        question: 'Will labels remain readable?',
        answer:
          'The workflow is designed to preserve packaging structure, but final text readability should still be reviewed before publishing.',
      },
    ],
    faqsZh: [
      {
        question: '可以生成护肤品广告视觉吗？',
        answer:
          '可以。美妆预设可以使用水纹、干净反射和柔和渐变来服务护肤品上新。',
      },
      {
        question: '包装文字会保持清晰吗？',
        answer: '流程会尽量保留包装结构，但发布前仍建议人工检查文字可读性。',
      },
    ],
  },
  {
    slug: 'shoe-photography-ai',
    aliases: ['shoe-product-photography'],
    category: 'Shoe Photography',
    title: 'AI Shoe Product Photography Generator',
    titleZh: 'AI 鞋类商品摄影生成器',
    navTitle: 'Shoe product photography',
    navTitleZh: '鞋类商品摄影',
    navDescription: 'Sneaker hero shots, outdoor scenes, and ad crops.',
    navDescriptionZh: '生成运动鞋主图、户外场景和广告裁切。',
    description:
      'Produce shoe hero shots and lifestyle detail scenes for ecommerce launches without changing the silhouette or material.',
    descriptionZh:
      '为鞋类商品生成主图和生活方式详情图，不改变鞋型轮廓、材质和品牌细节。',
    h1: 'AI shoe product photography for faster ecommerce launches',
    h1Zh: '更快上新的 AI 鞋类商品摄影',
    imageAlt:
      'AI shoe product photography examples for ecommerce main images and lifestyle scenes',
    imageAltZh: '用于电商主图和详情场景的 AI 鞋类商品摄影样例',
    visual: 'shoe',
    navGroup: 'category',
    useCases: ['Sneaker launches', 'Lifestyle scenes', 'Multi-size ad crops'],
    useCasesZh: ['运动鞋上新', '生活方式场景', '多尺寸广告裁切'],
    styles: ['Outdoor Natural Tabletop', 'Neon Retail Showcase'],
    painPoints: [
      'Create launch visuals without changing the shoe silhouette or sole shape.',
      'Generate both clean marketplace shots and campaign-ready lifestyle scenes.',
      'Produce multiple crop directions for social ads and store banners.',
    ],
    painPointsZh: [
      '生成上新视觉时尽量不改变鞋型轮廓和鞋底结构。',
      '同时生成干净平台主图和适合活动投放的生活方式场景。',
      '为社媒广告和店铺横幅准备多个裁切方向。',
    ],
    faqs: [
      {
        question: 'Can it create floating sneaker shots?',
        answer:
          'Yes. Use a retail showcase or outdoor tabletop style to create dynamic shadows while keeping the shoe structure recognizable.',
      },
      {
        question: 'Can I create different ad sizes from one shoe photo?',
        answer:
          'The workbench is built around multiple single-image tasks, so each output can use a different ratio, scene, and prompt direction.',
      },
    ],
    faqsZh: [
      {
        question: '可以生成运动鞋悬浮主图吗？',
        answer:
          '可以。选择零售展示或户外桌面风格，可以生成更有动感的阴影，同时保留鞋子的识别度。',
      },
      {
        question: '一张鞋图可以生成不同广告尺寸吗？',
        answer:
          '工作台按多个单图任务并行规划，每张输出都可以使用不同尺寸比例、场景和提示词方向。',
      },
    ],
  },
];

export const PRODUCT_TOOL_NAV_GROUPS: Array<{
  id: ProductTool['navGroup'];
  title: string;
  titleZh: string;
}> = [
  { id: 'core', title: 'Core workflows', titleZh: '核心工具' },
  { id: 'background', title: 'Background tools', titleZh: '背景工具' },
  { id: 'platform', title: 'Platform tools', titleZh: '平台词' },
  { id: 'category', title: 'Category tools', titleZh: '类目词' },
];

export function getProductTool(slug: string) {
  return PRODUCT_TOOLS.find(
    (tool) => tool.slug === slug || tool.aliases?.includes(slug)
  );
}

export function getProductToolCopy(
  tool: ProductTool,
  locale: 'zh' | 'en' | 'ja' | 'ko' | 'es'
): ProductToolCopy {
  if (locale === 'zh') {
    return {
      category: tool.titleZh,
      title: tool.titleZh,
      description: tool.descriptionZh,
      h1: tool.h1Zh,
      imageAlt: tool.imageAltZh,
      useCases: tool.useCasesZh,
      painPoints: tool.painPointsZh,
      faqs: tool.faqsZh,
      bestFor: '适合场景',
      whyTitle: '为什么适合这个场景',
      faqTitle: '常见问题',
      styles: '推荐风格',
      openGenerator: '进入生成器',
      viewPricing: '查看定价',
      home: '首页',
      tools: '工具',
    };
  }

  const translated =
    locale === 'en' ? undefined : TOOL_TRANSLATIONS[locale]?.[tool.slug];
  return {
    category: translated?.category ?? tool.category,
    title: translated?.title ?? tool.title,
    description: translated?.description ?? tool.description,
    h1: translated?.h1 ?? tool.h1,
    imageAlt: translated?.imageAlt ?? tool.imageAlt,
    useCases: translated?.useCases ?? tool.useCases,
    painPoints: translated?.painPoints ?? tool.painPoints,
    faqs: translated?.faqs ?? tool.faqs,
    bestFor:
      locale === 'ja'
        ? '最適な用途'
        : locale === 'ko'
          ? '적합한 용도'
          : locale === 'es'
            ? 'Ideal para'
            : 'Best for',
    whyTitle:
      locale === 'ja'
        ? 'この用途に向いている理由'
        : locale === 'ko'
          ? '이 용도에 적합한 이유'
          : locale === 'es'
            ? 'Por qué funciona para este caso'
            : 'Why it fits this workflow',
    faqTitle:
      locale === 'ja'
        ? 'よくある質問'
        : locale === 'ko'
          ? '자주 묻는 질문'
          : locale === 'es'
            ? 'Preguntas frecuentes'
            : 'FAQ',
    styles:
      locale === 'ja'
        ? 'おすすめスタイル'
        : locale === 'ko'
          ? '추천 스타일'
          : locale === 'es'
            ? 'Estilos recomendados'
            : 'Recommended styles',
    openGenerator:
      locale === 'ja'
        ? '生成ツールを開く'
        : locale === 'ko'
          ? '생성기 열기'
          : locale === 'es'
            ? 'Abrir generador'
            : 'Open generator',
    viewPricing:
      locale === 'ja'
        ? '料金を見る'
        : locale === 'ko'
          ? '요금 보기'
          : locale === 'es'
            ? 'Ver precios'
            : 'View pricing',
    home:
      locale === 'ja'
        ? 'ホーム'
        : locale === 'ko'
          ? '홈'
          : locale === 'es'
            ? 'Inicio'
            : 'Home',
    tools:
      locale === 'ja'
        ? 'ツール'
        : locale === 'ko'
          ? '도구'
          : locale === 'es'
            ? 'Herramientas'
            : 'Tools',
  };
}

const TOOL_TRANSLATIONS: Partial<
  Record<
    'ja' | 'ko' | 'es',
    Record<
      string,
      {
        category: string;
        title: string;
        description: string;
        h1: string;
        imageAlt: string;
        useCases: string[];
        painPoints?: string[];
        faqs?: Array<{ question: string; answer: string }>;
      }
    >
  >
> = {
  ja: {
    'batch-product-photo-generator': {
      category: '一括生成',
      title: '商品写真一括生成ツール',
      description:
        '1 枚の商品写真から、発売、広告、商品ページ向けの複数画像を並列で生成します。',
      h1: 'EC 商品画像セット向けの商品写真一括生成ツール',
      imageAlt:
        '主画像、詳細シーン、広告クロップを作る AI 一括商品写真生成サンプル',
      useCases: ['発売画像セット', '広告素材の一括生成', 'カタログ更新'],
      painPoints: [
        '同じ商品写真から複数の単画像生成タスクを作れます。',
        'シーン、光、クロップを変えながら商品形状を保ちます。',
        '1 枚ずつ編集するより速く発売素材を準備できます。',
      ],
      faqs: [
        {
          question: '一括生成は 1 つの大きなタスクですか？',
          answer:
            '複数の単画像タスクとして管理され、各出力に独自の Prompt、比率、スタイルを設定できます。',
        },
        {
          question: '主画像と詳細シーンを同時に作れますか？',
          answer:
            'はい。マーケットプレイス主画像、ライフスタイル詳細シーン、広告クロップを同じキューで扱えます。',
        },
      ],
    },
    'product-photo-set-generator': {
      category: '写真セット生成',
      title: '商品写真セット生成ツール',
      description:
        '1 枚のアップロード画像から、主画像、ライフスタイルシーン、詳細ページ用ビジュアルを統一感のあるセットで生成します。',
      h1: '1 枚の元画像から作る商品写真セット生成ツール',
      imageAlt: '統一された EC 商品写真セットを示す AI 生成サンプル',
      useCases: ['主画像セット', '詳細ページセット', 'ブランド表現の更新'],
      painPoints: [
        '単発画像ではなく統一されたビジュアルパッケージを作れます。',
        'セット全体で照明、面、シーン方向を合わせられます。',
        '1 つの素材から商品ページに必要なバリエーションを増やせます。',
      ],
      faqs: [
        {
          question: '商品写真セットには何が含まれますか？',
          answer:
            '通常は清潔な主画像、ライフスタイルシーン、詳細ページ用ビジュアル、必要に応じて広告クロップを含みます。',
        },
        {
          question: 'セット内で異なる比率を使えますか？',
          answer:
            'はい。各タスクカードは同じ商品画像を共有しながら、独自の比率と解像度を設定できます。',
        },
      ],
    },
    'product-background-generator': {
      category: '背景生成',
      title: 'EC 商品背景生成器',
      description:
        '1 枚の商品画像から、商品形状を保ったままスタジオ背景とライフスタイルシーンを作成します。',
      h1: 'マーケットプレイス向けの商品背景生成器',
      imageAlt: '商品形状を保った AI EC 商品背景生成サンプル',
      useCases: [
        'マーケットプレイス主画像',
        'Shopify 商品ページ',
        '広告素材バリエーション',
      ],
      painPoints: [
        'SKU ごとに再撮影せず、商品一覧の背景を統一できます。',
        '白背景とソフトシャドウの上架向けシーンを作れます。',
        '輪郭やラベル位置の変化を抑えながら複数案を作れます。',
      ],
      faqs: [
        {
          question: '白背景の商品画像を作れますか？',
          answer:
            'はい。スタジオやマーケットプレイス向けプリセットで、商品を中央に保ちながら白背景や柔らかい影のシーンを生成できます。',
        },
        {
          question: '商品形状は変わりますか？',
          answer:
            '背景、照明、雰囲気を変えつつ、アップロードされた商品のシルエットを保つ方向で設計しています。',
        },
      ],
    },
    'white-background-product-photo': {
      category: '白背景',
      title: '白背景商品写真生成ツール',
      description:
        '柔らかい影、中央構図、マーケットプレイス向け余白を備えた白背景の商品写真を作成します。',
      h1: 'EC 出品向け白背景商品写真生成ツール',
      imageAlt: '柔らかい影付きの白背景商品写真生成サンプル',
      useCases: ['マーケットプレイス出品', 'カタログサムネイル', 'SKU 更新'],
      painPoints: [
        '手作業の背景除去なしで清潔な白背景写真を作れます。',
        '出品に必要な余白を保ちながら商品を中央に配置します。',
        '自然な接地影で貼り付け感を減らします。',
      ],
      faqs: [
        {
          question: 'マーケットプレイス出品写真に使えますか？',
          answer:
            'はい。中央構図と控えめな影を持つ白背景の出品ビジュアルに適しています。',
        },
        {
          question: 'カタログサムネイルにも使えますか？',
          answer:
            'はい。白背景出力はカタログ一覧、SKU ページ、比較レイアウトに向いています。',
        },
      ],
    },
    'amazon-product-photo-generator': {
      category: 'Amazon 商品写真',
      title: 'Amazon 商品写真生成ツール',
      description:
        '1 枚の商品写真から、Amazon 風の主画像、機能シーン、A+ コンテンツ用ビジュアルを生成します。',
      h1: 'Listing 画像セット向け Amazon 商品写真生成ツール',
      imageAlt: '白背景主画像と A+ コンテンツ向け Amazon 商品写真生成サンプル',
      useCases: ['Amazon 主画像', 'A+ コンテンツシーン', '機能訴求画像'],
      painPoints: [
        '1 つの素材から主画像と補助詳細ビジュアルを準備できます。',
        '商品の利点をすばやく伝える機能重視のシーンを作れます。',
        'SKU バリエーション全体で Listing の見た目を揃えられます。',
      ],
      faqs: [
        {
          question: 'Amazon の主画像を作れますか？',
          answer:
            '清潔なマーケットプレイス風主画像を作れますが、最終的な適合性は最新のカテゴリルールで確認してください。',
        },
        {
          question: 'A+ コンテンツ画像も作れますか？',
          answer:
            'はい。ライフスタイルや機能詳細のタスクカードを追加して A+ セクションに使えます。',
        },
      ],
    },
    'shopify-product-image-generator': {
      category: 'Shopify 商品画像',
      title: 'Shopify 商品画像生成ツール',
      description:
        'ブランドストアに合う Shopify 商品画像、コレクションサムネイル、キャンペーンビジュアルを作成します。',
      h1: 'ブランドストア向け Shopify 商品画像生成ツール',
      imageAlt: 'ブランド EC ストア向け Shopify 商品画像生成サンプル',
      useCases: ['商品ページ', 'コレクション一覧', 'キャンペーンバナー'],
      painPoints: [
        'ストア全体の商品画像に一貫性を持たせます。',
        '同じ商品からコレクション向けクロップと詳細シーンを作れます。',
        'マーケットプレイス風ではなくブランドのムードに合わせられます。',
      ],
      faqs: [
        {
          question: 'Shopify コレクション画像を作れますか？',
          answer:
            'はい。コレクション一覧には正方形や縦長比率が使いやすく、商品間でスタイルを揃えられます。',
        },
        {
          question: 'ブランドスタイルに合わせられますか？',
          answer:
            'Prompt にブランドの面、照明、ムードを入れることでストアの方向性に寄せられます。',
        },
      ],
    },
    'jewelry-product-photography-ai': {
      category: 'ジュエリー撮影',
      title: 'AI ジュエリー商品撮影',
      description:
        '反射、影、接写構図を制御した高級感のあるジュエリー商品シーンを生成します。',
      h1: '光沢と素材感を引き出す AI ジュエリー商品撮影',
      imageAlt: '高級反射と詳細シーンを持つ AI ジュエリー背景生成サンプル',
      useCases: ['リング主画像', 'ネックレス詳細シーン', '高級広告セット'],
      painPoints: [
        '金属や宝石の反射を制御し、高級感を出せます。',
        '素材感とサイズ感を伝える接写シーンを作れます。',
        'ジュエリーの価値を下げる雑多な背景を避けられます。',
      ],
      faqs: [
        {
          question: 'リングの反射をリアルにできますか？',
          answer:
            '暗めの編集風シーン、台座、制御されたハイライトを使い、反射が意図的に見える構成を目指します。',
        },
        {
          question: 'ネックレスに合う背景は何ですか？',
          answer:
            'シンプルな台座、ソフトな大理石、暗いグラデーション、暖色のサイドライトが相性よく使えます。',
        },
      ],
    },
    'cosmetic-product-photo-generator': {
      category: 'コスメ商品写真',
      title: 'コスメ商品写真生成ツール',
      description:
        '水、ガラス、柔らかなグラデーションを使ったスキンケアやビューティ商品の高級感あるシーンを生成します。',
      h1: 'ビューティ EC 向けコスメ商品写真生成ツール',
      imageAlt: 'スキンケアとビューティ EC 向けコスメ商品写真生成サンプル',
      useCases: ['スキンケア主画像', 'メイク詳細シーン', 'ビューティ広告'],
      painPoints: [
        '大規模な撮影なしで高級感のあるビューティビジュアルを作れます。',
        '水、ガラス、柔らかなグラデーションでみずみずしさを表現できます。',
        'パッケージ形状とラベル位置をできるだけ安定させます。',
      ],
      faqs: [
        {
          question: 'スキンケアの広告ビジュアルを作れますか？',
          answer:
            'はい。水の質感、清潔な反射、柔らかなグラデーションを使った発売向け表現に適しています。',
        },
        {
          question: 'ラベルは読めますか？',
          answer:
            'パッケージ構造は保つ設計ですが、公開前に文字の可読性を確認してください。',
        },
      ],
    },
    'shoe-photography-ai': {
      category: 'シューズ撮影',
      title: 'AI シューズ商品撮影生成器',
      description:
        'シルエットや素材を変えずに、シューズの主画像とライフスタイル詳細シーンを生成します。',
      h1: 'EC 上新を速くする AI シューズ商品撮影',
      imageAlt: 'EC 主画像とライフスタイル向け AI シューズ商品撮影サンプル',
      useCases: [
        'スニーカー発売',
        'ライフスタイルシーン',
        '広告用マルチサイズ',
      ],
      painPoints: [
        '靴型やソール形状を保ちながら発売用ビジュアルを作れます。',
        '清潔な商品画像とキャンペーン用シーンを両方作れます。',
        '広告やストアバナー向けの複数クロップを作れます。',
      ],
      faqs: [
        {
          question: '浮遊感のあるスニーカー画像を作れますか？',
          answer:
            'はい。リテールショーケースや屋外テーブルトップ風で、構造を保ちながら動きのある影を作れます。',
        },
        {
          question: '1 枚の靴写真から複数サイズを作れますか？',
          answer:
            '複数の単画像タスクとして、比率、シーン、Prompt を分けて生成する設計です。',
        },
      ],
    },
  },
  ko: {
    'batch-product-photo-generator': {
      category: '일괄 생성',
      title: '상품 사진 일괄 생성기',
      description:
        '상품 사진 한 장으로 출시, 광고, 상품 페이지용 여러 이미지를 병렬로 생성합니다.',
      h1: '이커머스 이미지 세트를 위한 상품 사진 일괄 생성기',
      imageAlt:
        '메인 이미지, 상세 장면, 광고 크롭을 만드는 AI 상품 사진 일괄 생성 예시',
      useCases: ['출시 이미지 세트', '광고 소재 배치', '카탈로그 업데이트'],
      painPoints: [
        '같은 상품 사진에서 여러 단일 이미지 생성 작업을 만들 수 있습니다.',
        '장면, 조명, 크롭을 바꾸면서 상품 형태를 유지합니다.',
        '이미지를 하나씩 편집하는 것보다 빠르게 출시 소재를 준비합니다.',
      ],
      faqs: [
        {
          question: '일괄 생성은 하나의 큰 작업인가요?',
          answer:
            '여러 단일 이미지 작업으로 관리되며 각 출력마다 Prompt, 비율, 스타일을 따로 둘 수 있습니다.',
        },
        {
          question: '메인 이미지와 상세 장면을 함께 만들 수 있나요?',
          answer:
            '네. 마켓플레이스 메인 이미지, 라이프스타일 상세 장면, 광고 크롭을 같은 큐에서 다룰 수 있습니다.',
        },
      ],
    },
    'product-photo-set-generator': {
      category: '사진 세트 생성',
      title: '상품 사진 세트 생성기',
      description:
        '업로드 한 장으로 메인 이미지, 라이프스타일 장면, 상세 페이지 비주얼을 일관된 세트로 생성합니다.',
      h1: '원본 이미지 한 장으로 만드는 상품 사진 세트 생성기',
      imageAlt: '일관된 이커머스 상품 사진 세트를 보여주는 AI 생성 예시',
      useCases: [
        '메인 이미지 세트',
        '상세 페이지 세트',
        '브랜드 스타일 업데이트',
      ],
      painPoints: [
        '개별 이미지가 아니라 일관된 비주얼 패키지를 만듭니다.',
        '세트 전체의 조명, 표면, 장면 방향을 맞춥니다.',
        '하나의 소재로 상품 페이지에 필요한 변형을 늘립니다.',
      ],
      faqs: [
        {
          question: '상품 사진 세트에는 무엇이 포함되나요?',
          answer:
            '보통 깨끗한 메인 이미지, 라이프스타일 장면, 상세 페이지 비주얼, 선택적 광고 크롭을 포함합니다.',
        },
        {
          question: '세트 안에서 다른 비율을 사용할 수 있나요?',
          answer:
            '네. 각 작업 카드는 같은 상품 이미지를 공유하면서 고유한 비율과 해상도를 사용할 수 있습니다.',
        },
      ],
    },
    'product-background-generator': {
      category: '배경 생성',
      title: '이커머스 상품 배경 생성기',
      description:
        '상품 형태를 유지하면서 스튜디오 배경과 라이프스타일 장면을 생성합니다.',
      h1: '마켓플레이스용 상품 배경 생성기',
      imageAlt: '상품 형태를 유지한 AI 이커머스 상품 배경 생성 예시',
      useCases: [
        '마켓플레이스 메인 이미지',
        'Shopify 상품 페이지',
        '광고 소재 변형',
      ],
      painPoints: [
        'SKU마다 재촬영하지 않고 카탈로그 배경을 통일합니다.',
        '흰 배경과 부드러운 그림자 장면을 빠르게 만듭니다.',
        '상품 실루엣과 라벨 위치 변경을 줄입니다.',
      ],
      faqs: [
        {
          question: '흰 배경 상품 사진을 만들 수 있나요?',
          answer:
            '네. 스튜디오 또는 마켓플레이스 프리셋으로 상품을 중앙에 유지하면서 흰 배경이나 부드러운 그림자 장면을 만들 수 있습니다.',
        },
        {
          question: '상품 형태가 바뀌나요?',
          answer:
            '배경과 조명은 바꾸되 업로드한 상품의 실루엣을 유지하는 방향으로 설계되어 있습니다.',
        },
      ],
    },
    'white-background-product-photo': {
      category: '흰 배경',
      title: '흰 배경 상품 사진 생성기',
      description:
        '부드러운 그림자, 중앙 구도, 마켓플레이스용 여백을 갖춘 흰 배경 상품 사진을 만듭니다.',
      h1: '이커머스 리스팅용 흰 배경 상품 사진 생성기',
      imageAlt: '부드러운 이커머스 그림자가 있는 흰 배경 상품 사진 생성 예시',
      useCases: ['마켓플레이스 리스팅', '카탈로그 썸네일', 'SKU 업데이트'],
      painPoints: [
        '수동 배경 제거 없이 깨끗한 흰 배경 상품 사진을 만듭니다.',
        '리스팅에 필요한 여백을 두고 상품을 중앙에 배치합니다.',
        '자연스러운 접지 그림자로 붙여 넣은 느낌을 줄입니다.',
      ],
      faqs: [
        {
          question: '마켓플레이스 리스팅 사진에 적합한가요?',
          answer:
            '네. 중앙 구도와 절제된 그림자를 가진 흰 배경 리스팅 비주얼에 맞습니다.',
        },
        {
          question: '카탈로그 썸네일에도 사용할 수 있나요?',
          answer:
            '네. 흰 배경 출력은 카탈로그 그리드, SKU 페이지, 비교 레이아웃에 유용합니다.',
        },
      ],
    },
    'amazon-product-photo-generator': {
      category: 'Amazon 상품 사진',
      title: 'Amazon 상품 사진 생성기',
      description:
        '상품 사진 한 장으로 Amazon 스타일 메인 이미지, 기능 장면, A+ 콘텐츠 비주얼을 생성합니다.',
      h1: '리스팅 이미지 세트를 위한 Amazon 상품 사진 생성기',
      imageAlt: '흰 메인 이미지와 A+ 콘텐츠 장면용 Amazon 상품 사진 생성 예시',
      useCases: ['Amazon 메인 이미지', 'A+ 콘텐츠 장면', '기능 콜아웃'],
      painPoints: [
        '하나의 원본에서 메인 이미지와 보조 상세 비주얼을 준비합니다.',
        '상품 장점을 빠르게 설명하는 기능 중심 장면을 만듭니다.',
        'SKU 변형 전체의 리스팅 느낌을 일관되게 유지합니다.',
      ],
      faqs: [
        {
          question: 'Amazon 메인 이미지를 만들 수 있나요?',
          answer:
            '깨끗한 마켓플레이스 스타일 메인 이미지를 만들 수 있지만 최종 준수 여부는 최신 카테고리 규칙을 확인해야 합니다.',
        },
        {
          question: 'A+ 콘텐츠 이미지도 만들 수 있나요?',
          answer:
            '네. 라이프스타일과 기능 상세 작업 카드를 추가해 A+ 섹션에 사용할 수 있습니다.',
        },
      ],
    },
    'shopify-product-image-generator': {
      category: 'Shopify 상품 이미지',
      title: 'Shopify 상품 이미지 생성기',
      description:
        '브랜드 스토어에 맞는 Shopify 상품 이미지, 컬렉션 썸네일, 캠페인 비주얼을 만듭니다.',
      h1: '브랜드 스토어를 위한 Shopify 상품 이미지 생성기',
      imageAlt: '브랜드 이커머스 스토어용 Shopify 상품 이미지 생성 예시',
      useCases: ['상품 페이지', '컬렉션 그리드', '캠페인 배너'],
      painPoints: [
        '스토어 전체의 상품 이미지 일관성을 유지합니다.',
        '같은 상품에서 컬렉션용 크롭과 상세 장면을 만듭니다.',
        '마켓플레이스식 획일성보다 브랜드 분위기에 맞춥니다.',
      ],
      faqs: [
        {
          question: 'Shopify 컬렉션 이미지를 만들 수 있나요?',
          answer:
            '네. 컬렉션 그리드에는 정사각형 또는 세로 비율이 유용하며 제품 간 스타일을 맞출 수 있습니다.',
        },
        {
          question: '브랜드 스타일에 맞출 수 있나요?',
          answer:
            'Prompt에 브랜드 표면, 조명, 분위기를 설명하면 스토어 방향에 맞는 출력을 만들 수 있습니다.',
        },
      ],
    },
    'jewelry-product-photography-ai': {
      category: '주얼리 촬영',
      title: 'AI 주얼리 상품 촬영',
      description:
        '반사, 그림자, 클로즈업 구도를 제어한 프리미엄 주얼리 장면을 생성합니다.',
      h1: '광택과 소재감을 살리는 AI 주얼리 상품 촬영',
      imageAlt: '프리미엄 반사와 상세 장면의 AI 주얼리 배경 생성 예시',
      useCases: ['반지 메인 이미지', '목걸이 상세 장면', '럭셔리 광고 세트'],
      painPoints: [
        '금속과 보석 반사를 제어해 고급스럽게 보이도록 합니다.',
        '소재와 크기를 보여주는 클로즈업 상세 장면을 만듭니다.',
        '주얼리 가치를 낮추는 산만한 배경을 피합니다.',
      ],
      faqs: [
        {
          question: '반지 반사를 현실적으로 만들 수 있나요?',
          answer:
            '어두운 에디토리얼 장면, 받침대, 제어된 하이라이트를 사용해 반사가 의도적으로 보이도록 합니다.',
        },
        {
          question: '목걸이에 좋은 배경은 무엇인가요?',
          answer:
            '미니멀 받침대, 부드러운 마블, 어두운 그라데이션, 따뜻한 측면 조명이 잘 어울립니다.',
        },
      ],
    },
    'cosmetic-product-photo-generator': {
      category: '화장품 상품 사진',
      title: '화장품 상품 사진 생성기',
      description:
        '물, 유리, 부드러운 그라데이션으로 스킨케어와 뷰티 제품의 프리미엄 장면을 생성합니다.',
      h1: '뷰티 이커머스를 위한 화장품 상품 사진 생성기',
      imageAlt: '스킨케어와 뷰티 이커머스 장면용 화장품 상품 사진 생성 예시',
      useCases: ['스킨케어 메인 이미지', '메이크업 상세 장면', '뷰티 광고'],
      painPoints: [
        '전체 스튜디오 촬영 없이 프리미엄 뷰티 비주얼을 만듭니다.',
        '물, 유리, 부드러운 그라데이션으로 신선함을 강조합니다.',
        '패키지 형태와 라벨 위치를 안정적으로 유지합니다.',
      ],
      faqs: [
        {
          question: '스킨케어 캠페인 비주얼을 만들 수 있나요?',
          answer:
            '네. 물 질감, 깨끗한 반사, 부드러운 그라데이션을 사용한 스킨케어 출시 장면에 적합합니다.',
        },
        {
          question: '라벨이 읽히나요?',
          answer:
            '패키지 구조를 보존하도록 설계되어 있지만 게시 전 텍스트 가독성은 확인해야 합니다.',
        },
      ],
    },
    'shoe-photography-ai': {
      category: '신발 촬영',
      title: 'AI 신발 상품 촬영 생성기',
      description:
        '실루엣과 소재를 바꾸지 않고 신발 메인 이미지와 라이프스타일 상세 장면을 만듭니다.',
      h1: '이커머스 출시를 빠르게 하는 AI 신발 상품 촬영',
      imageAlt: '이커머스 메인 및 라이프스타일용 AI 신발 상품 촬영 예시',
      useCases: ['스니커즈 출시', '라이프스타일 장면', '멀티 사이즈 광고 크롭'],
      painPoints: [
        '신발 실루엣과 밑창 구조를 유지하며 출시 이미지를 만듭니다.',
        '깨끗한 마켓플레이스 이미지와 캠페인 장면을 함께 만듭니다.',
        '광고와 스토어 배너용 다양한 크롭 방향을 준비합니다.',
      ],
      faqs: [
        {
          question: '떠 있는 스니커즈 샷을 만들 수 있나요?',
          answer:
            '네. 리테일 쇼케이스나 야외 테이블탑 스타일로 신발 구조를 유지하면서 역동적인 그림자를 만들 수 있습니다.',
        },
        {
          question: '한 장의 신발 사진으로 여러 광고 사이즈를 만들 수 있나요?',
          answer:
            '여러 단일 이미지 작업으로 비율, 장면, Prompt 방향을 나누어 생성하도록 설계되어 있습니다.',
        },
      ],
    },
  },
  es: {
    'batch-product-photo-generator': {
      category: 'Generación por lotes',
      title: 'Generador por lotes de fotos de producto',
      description:
        'Sube una foto de producto y crea en paralelo varias imágenes listas para lanzamientos, anuncios y páginas ecommerce.',
      h1: 'Generador por lotes de fotos de producto para sets ecommerce',
      imageAlt:
        'Generador IA por lotes creando imágenes principales, escenas de detalle y recortes publicitarios',
      useCases: [
        'Sets de lanzamiento',
        'Lotes de anuncios',
        'Actualización de catálogo',
      ],
      painPoints: [
        'Crea varias tareas de imagen única desde la misma foto fuente.',
        'Mantiene la forma del producto mientras cambia escena, luz y recorte.',
        'Prepara assets de lanzamiento más rápido que editando imagen por imagen.',
      ],
      faqs: [
        {
          question: '¿La generación por lotes es una sola tarea grande?',
          answer:
            'Se organiza como varias tareas de imagen única en paralelo, con prompt, proporción y estilo propios para cada salida.',
        },
        {
          question: '¿Puedo generar imágenes principales y detalles juntas?',
          answer:
            'Sí. El workbench admite colas mixtas con imágenes principales, escenas lifestyle y recortes de anuncios.',
        },
      ],
    },
    'product-photo-set-generator': {
      category: 'Generador de sets',
      title: 'Generador de sets de fotos de producto',
      description:
        'Genera un set coordinado con imagen principal, escenas lifestyle y visuales de detalle desde una sola subida.',
      h1: 'Generador de sets de fotos de producto desde una imagen fuente',
      imageAlt:
        'Generador IA de sets de fotos de producto con salidas ecommerce coordinadas',
      useCases: [
        'Sets de imagen principal',
        'Sets de página de detalle',
        'Renovación visual de marca',
      ],
      painPoints: [
        'Genera un paquete visual consistente en lugar de imágenes aisladas.',
        'Alinea iluminación, superficie y dirección de escena en todo el set.',
        'Crea variedad suficiente para una página de producto desde una sola foto.',
      ],
      faqs: [
        {
          question: '¿Qué incluye un set de fotos de producto?',
          answer:
            'Normalmente incluye imagen principal limpia, escenas lifestyle, visuales de detalle y recortes opcionales para anuncios.',
        },
        {
          question: '¿Cada imagen del set puede tener otra proporción?',
          answer:
            'Sí. Cada tarjeta de tarea puede usar su propia proporción y resolución compartiendo la misma foto fuente.',
        },
      ],
    },
    'product-background-generator': {
      category: 'Generador de fondos',
      title: 'Generador de fondos para ecommerce',
      description:
        'Crea fondos de estudio y escenas lifestyle desde una imagen sin cambiar la forma del producto.',
      h1: 'Generador de fondos para imágenes listas para marketplace',
      imageAlt:
        'Ejemplos IA de fondos ecommerce con forma de producto preservada',
      useCases: [
        'Imágenes principales',
        'Páginas Shopify',
        'Variaciones publicitarias',
      ],
      painPoints: [
        'Unifica fondos de catálogo sin volver a fotografiar cada SKU.',
        'Crea fondo blanco y escenas con sombra suave desde una subida.',
        'Mantiene silueta y etiquetas más estables entre variantes.',
      ],
      faqs: [
        {
          question: '¿Puedo crear una foto con fondo blanco?',
          answer:
            'Sí. Usa un preset de estudio o marketplace para mantener el producto centrado y reemplazar el fondo por blanco o sombra suave.',
        },
        {
          question: '¿Cambiará la forma del producto?',
          answer:
            'El flujo prioriza conservar la silueta del producto mientras cambia fondo, luz y atmósfera.',
        },
      ],
    },
    'white-background-product-photo': {
      category: 'Fondo blanco',
      title: 'Foto de producto con fondo blanco',
      description:
        'Crea fotos de producto con fondo blanco, sombras suaves, composición centrada y encuadre listo para marketplace.',
      h1: 'Generador de fotos de producto con fondo blanco para ecommerce',
      imageAlt:
        'Generador de foto de producto con fondo blanco y sombra ecommerce suave',
      useCases: [
        'Listings marketplace',
        'Miniaturas de catálogo',
        'Actualización de SKU',
      ],
      painPoints: [
        'Crea fotos limpias sin eliminar fondos manualmente.',
        'Mantiene el producto centrado con margen suficiente para listings.',
        'Añade una sombra sutil para evitar que parezca pegado.',
      ],
      faqs: [
        {
          question: '¿Sirve para fotos de listing?',
          answer:
            'Sí. Está centrado en visuales de fondo blanco con composición centrada y sombras contenidas.',
        },
        {
          question: '¿Puedo usarlo para miniaturas de catálogo?',
          answer:
            'Sí. Las salidas con fondo blanco funcionan bien en grids, páginas SKU y comparativas.',
        },
      ],
    },
    'amazon-product-photo-generator': {
      category: 'Fotos para Amazon',
      title: 'Generador de fotos de producto para Amazon',
      description:
        'Genera fotos estilo Amazon con imagen principal limpia, escenas de beneficios y visuales para contenido A+.',
      h1: 'Generador de fotos Amazon para sets de listing',
      imageAlt:
        'Generador de fotos Amazon para imágenes principales blancas y escenas A+',
      useCases: [
        'Imagen principal Amazon',
        'Escenas A+',
        'Callouts de función',
      ],
      painPoints: [
        'Prepara imagen principal y visuales de detalle desde una fuente.',
        'Crea escenas centradas en beneficios que explican rápido el producto.',
        'Mantiene un estilo de listing consistente entre variaciones SKU.',
      ],
      faqs: [
        {
          question: '¿Puede crear imágenes principales de Amazon?',
          answer:
            'Está pensado para imágenes principales limpias estilo marketplace; revisa siempre las reglas activas de tu categoría.',
        },
        {
          question: '¿Puede crear imágenes A+?',
          answer:
            'Sí. Puedes añadir tareas lifestyle y de detalle funcional para secciones A+.',
        },
      ],
    },
    'shopify-product-image-generator': {
      category: 'Imágenes Shopify',
      title: 'Generador de imágenes de producto para Shopify',
      description:
        'Crea imágenes de producto, miniaturas de colección y visuales de campaña coherentes con una tienda de marca.',
      h1: 'Generador de imágenes Shopify para tiendas de marca',
      imageAlt:
        'Generador de imágenes Shopify con visuales de ecommerce de marca',
      useCases: [
        'Páginas de producto',
        'Grids de colección',
        'Banners de campaña',
      ],
      painPoints: [
        'Mantiene consistencia visual en toda la tienda.',
        'Crea recortes para colecciones y escenas de detalle desde el mismo producto.',
        'Adapta el estilo a una marca, no a una estética marketplace genérica.',
      ],
      faqs: [
        {
          question: '¿Puede crear imágenes para colecciones Shopify?',
          answer:
            'Sí. Usa proporciones cuadradas o verticales para grids y presets consistentes entre productos.',
        },
        {
          question: '¿Puedo igualar mi estilo de marca?',
          answer:
            'Sí. El prompt puede describir superficies, iluminación y mood de marca para encajar con tu tienda.',
        },
      ],
    },
    'jewelry-product-photography-ai': {
      category: 'Fotografía de joyería',
      title: 'Fotografía IA de producto para joyería',
      description:
        'Genera escenas refinadas de joyería con reflejos, sombras premium y composición cercana.',
      h1: 'Fotografía IA de joyería con control de luz premium',
      imageAlt: 'Generador IA de fondos de joyería con reflejos premium',
      useCases: [
        'Hero de anillos',
        'Detalles de collares',
        'Sets de anuncios lujo',
      ],
      painPoints: [
        'Controla reflejos para que metal y gemas se vean premium.',
        'Crea escenas cercanas que muestran escala y material.',
        'Evita fondos lifestyle genéricos que reducen valor percibido.',
      ],
      faqs: [
        {
          question: '¿Puede crear reflejos realistas para anillos?',
          answer:
            'Usa escenas editoriales oscuras, pedestales y luces controladas para que los reflejos parezcan intencionales.',
        },
        {
          question: '¿Qué fondo funciona para collares?',
          answer:
            'Pedestales mínimos, mármol suave, gradientes oscuros y luz lateral cálida suelen funcionar mejor.',
        },
      ],
    },
    'cosmetic-product-photo-generator': {
      category: 'Fotos de cosmética',
      title: 'Generador de fotos de producto cosmético',
      description:
        'Genera fotos premium de cosmética con reflejos limpios, texturas de agua, gradientes suaves y escenas de belleza.',
      h1: 'Generador de fotos cosméticas para ecommerce beauty',
      imageAlt:
        'Generador de fotos cosméticas para escenas de skincare y beauty ecommerce',
      useCases: [
        'Hero de skincare',
        'Detalles de maquillaje',
        'Anuncios beauty',
      ],
      painPoints: [
        'Crea visuales beauty premium sin montar una sesión completa.',
        'Usa agua, cristal y gradientes suaves para destacar frescura.',
        'Mantiene forma del envase y posición de etiquetas entre variantes.',
      ],
      faqs: [
        {
          question: '¿Puede crear visuales de campaña skincare?',
          answer:
            'Sí. Los presets cosméticos usan agua, reflejos limpios y gradientes suaves para lanzamientos skincare.',
        },
        {
          question: '¿Las etiquetas siguen legibles?',
          answer:
            'El flujo conserva la estructura del envase, pero conviene revisar la legibilidad antes de publicar.',
        },
      ],
    },
    'shoe-photography-ai': {
      category: 'Fotografía de calzado',
      title: 'Generador IA de fotografía de calzado',
      description:
        'Produce imágenes hero y escenas lifestyle sin cambiar silueta ni material.',
      h1: 'Fotografía IA de calzado para lanzamientos ecommerce rápidos',
      imageAlt: 'Ejemplos IA de calzado para imágenes principales y lifestyle',
      useCases: [
        'Lanzamientos sneaker',
        'Escenas lifestyle',
        'Recortes publicitarios',
      ],
      painPoints: [
        'Crea visuales de lanzamiento sin cambiar silueta ni suela.',
        'Genera tomas limpias y escenas lifestyle para campañas.',
        'Produce varias direcciones de recorte para anuncios y banners.',
      ],
      faqs: [
        {
          question: '¿Puede crear zapatillas flotantes?',
          answer:
            'Sí. Usa estilos de showcase retail o exterior para crear sombras dinámicas manteniendo la estructura reconocible.',
        },
        {
          question: '¿Puedo crear varios tamaños desde una foto?',
          answer:
            'El workbench usa varias tareas de imagen única, cada una con proporción, escena y prompt propios.',
        },
      ],
    },
  },
};
