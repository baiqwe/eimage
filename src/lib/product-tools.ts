export type ProductTool = {
  slug: string;
  category: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  h1: string;
  h1Zh: string;
  imageAlt: string;
  imageAltZh: string;
  useCases: string[];
  useCasesZh: string[];
  styles: string[];
};

export type ProductToolCopy = {
  category: string;
  title: string;
  description: string;
  h1: string;
  imageAlt: string;
  useCases: string[];
  bestFor: string;
  styles: string;
  openGenerator: string;
  viewPricing: string;
  home: string;
  tools: string;
};

export const PRODUCT_TOOLS: ProductTool[] = [
  {
    slug: 'product-background-generator',
    category: 'Background Generator',
    title: 'Product Background Generator for Ecommerce',
    titleZh: '电商商品背景生成器',
    description:
      'Create clean studio backgrounds and lifestyle scenes from one product image while preserving the original product shape.',
    descriptionZh:
      '上传一张商品图，生成白底、棚拍和生活方式场景背景，同时保持商品原始形貌。',
    h1: 'Product background generator for marketplace-ready images',
    h1Zh: '面向电商上新的商品背景生成器',
    imageAlt:
      'AI generated ecommerce product background examples with preserved product shape',
    imageAltZh: '保持商品原始形貌的 AI 电商商品背景生成样例',
    useCases: [
      'Marketplace main images',
      'Shopify product pages',
      'Ad creative variations',
    ],
    useCasesZh: ['平台主图', '独立站商品页', '广告素材变体'],
    styles: ['Pure Studio Key Light', 'Soft Shadow Marketplace'],
  },
  {
    slug: 'jewelry-background-generator',
    category: 'Jewelry Photography',
    title: 'Jewelry Background Generator',
    titleZh: '珠宝首饰背景生成器',
    description:
      'Generate refined jewelry product scenes with controlled reflections, premium shadows, and close-up detail composition.',
    descriptionZh:
      '为珠宝首饰生成高级背景、可控反射和细节页场景，突出金属、宝石和材质质感。',
    h1: 'Jewelry background generator with premium light control',
    h1Zh: '突出光泽和材质的珠宝背景生成器',
    imageAlt:
      'AI jewelry background generator with premium reflections and ecommerce detail scene',
    imageAltZh: '带高级反射和详情页场景的 AI 珠宝背景生成器样例',
    useCases: ['Ring hero images', 'Necklace detail scenes', 'Luxury ad sets'],
    useCasesZh: ['戒指主图', '项链详情图', '高端广告套图'],
    styles: ['Minimal Reflection Plinth', 'Premium Dark Editorial'],
  },
  {
    slug: 'shoe-product-photography',
    category: 'Shoe Photography',
    title: 'AI Shoe Product Photography Generator',
    titleZh: 'AI 鞋类商品摄影生成器',
    description:
      'Produce shoe hero shots and lifestyle detail scenes for ecommerce launches without changing the silhouette or material.',
    descriptionZh:
      '为鞋类商品生成主图和生活方式详情图，不改变鞋型轮廓、材质和品牌细节。',
    h1: 'AI shoe product photography for faster ecommerce launches',
    h1Zh: '更快上新的 AI 鞋类商品摄影',
    imageAlt:
      'AI shoe product photography examples for ecommerce main images and lifestyle scenes',
    imageAltZh: '用于电商主图和详情场景的 AI 鞋类商品摄影样例',
    useCases: ['Sneaker launches', 'Lifestyle scenes', 'Multi-size ad crops'],
    useCasesZh: ['运动鞋上新', '生活方式场景', '多尺寸广告裁切'],
    styles: ['Outdoor Natural Tabletop', 'Neon Retail Showcase'],
  },
];

export function getProductTool(slug: string) {
  return PRODUCT_TOOLS.find((tool) => tool.slug === slug);
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
      bestFor: '适合场景',
      styles: '推荐风格',
      openGenerator: '进入生成器',
      viewPricing: '查看定价',
      home: '首页',
      tools: '工具',
    };
  }

  const translated = TOOL_TRANSLATIONS[locale]?.[tool.slug];
  return {
    category: translated?.category ?? tool.category,
    title: translated?.title ?? tool.title,
    description: translated?.description ?? tool.description,
    h1: translated?.h1 ?? tool.h1,
    imageAlt: translated?.imageAlt ?? tool.imageAlt,
    useCases: translated?.useCases ?? tool.useCases,
    bestFor:
      locale === 'ja'
        ? '最適な用途'
        : locale === 'ko'
          ? '적합한 용도'
          : locale === 'es'
            ? 'Ideal para'
            : 'Best for',
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
      }
    >
  >
> = {
  ja: {
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
    },
    'jewelry-background-generator': {
      category: 'ジュエリー撮影',
      title: 'ジュエリー背景生成器',
      description:
        '反射、影、接写構図を制御した高級感のあるジュエリー商品シーンを生成します。',
      h1: '光沢と素材感を引き出すジュエリー背景生成器',
      imageAlt: '高級反射と詳細シーンを持つ AI ジュエリー背景生成サンプル',
      useCases: ['リング主画像', 'ネックレス詳細シーン', '高級広告セット'],
    },
    'shoe-product-photography': {
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
    },
  },
  ko: {
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
    },
    'jewelry-background-generator': {
      category: '주얼리 촬영',
      title: '주얼리 배경 생성기',
      description:
        '반사, 그림자, 클로즈업 구도를 제어한 프리미엄 주얼리 장면을 생성합니다.',
      h1: '광택과 소재감을 살리는 주얼리 배경 생성기',
      imageAlt: '프리미엄 반사와 상세 장면의 AI 주얼리 배경 생성 예시',
      useCases: ['반지 메인 이미지', '목걸이 상세 장면', '럭셔리 광고 세트'],
    },
    'shoe-product-photography': {
      category: '신발 촬영',
      title: 'AI 신발 상품 촬영 생성기',
      description:
        '실루엣과 소재를 바꾸지 않고 신발 메인 이미지와 라이프스타일 상세 장면을 만듭니다.',
      h1: '이커머스 출시를 빠르게 하는 AI 신발 상품 촬영',
      imageAlt: '이커머스 메인 및 라이프스타일용 AI 신발 상품 촬영 예시',
      useCases: ['스니커즈 출시', '라이프스타일 장면', '멀티 사이즈 광고 크롭'],
    },
  },
  es: {
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
    },
    'jewelry-background-generator': {
      category: 'Fotografía de joyería',
      title: 'Generador de fondos para joyería',
      description:
        'Genera escenas refinadas de joyería con reflejos, sombras premium y composición cercana.',
      h1: 'Fondos para joyería con control de luz premium',
      imageAlt: 'Generador IA de fondos de joyería con reflejos premium',
      useCases: [
        'Hero de anillos',
        'Detalles de collares',
        'Sets de anuncios lujo',
      ],
    },
    'shoe-product-photography': {
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
    },
  },
};
