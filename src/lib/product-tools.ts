export type ProductTool = {
  slug: string;
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
  visual: 'studio' | 'jewelry' | 'shoe';
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
    slug: 'jewelry-background-generator',
    category: 'Jewelry Photography',
    title: 'Jewelry Background Generator',
    titleZh: '珠宝首饰背景生成器',
    navTitle: 'Jewelry background generator',
    navTitleZh: '珠宝背景生成器',
    navDescription: 'Premium scenes for rings, necklaces, metal, and gems.',
    navDescriptionZh: '面向戒指、项链、金属和宝石的高级场景。',
    description:
      'Generate refined jewelry product scenes with controlled reflections, premium shadows, and close-up detail composition.',
    descriptionZh:
      '为珠宝首饰生成高级背景、可控反射和细节页场景，突出金属、宝石和材质质感。',
    h1: 'Jewelry background generator with premium light control',
    h1Zh: '突出光泽和材质的珠宝背景生成器',
    imageAlt:
      'AI jewelry background generator with premium reflections and ecommerce detail scene',
    imageAltZh: '带高级反射和详情页场景的 AI 珠宝背景生成器样例',
    visual: 'jewelry',
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
    slug: 'shoe-product-photography',
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

  const translated = TOOL_TRANSLATIONS[locale]?.[tool.slug];
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
    'jewelry-background-generator': {
      category: 'ジュエリー撮影',
      title: 'ジュエリー背景生成器',
      description:
        '反射、影、接写構図を制御した高級感のあるジュエリー商品シーンを生成します。',
      h1: '光沢と素材感を引き出すジュエリー背景生成器',
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
    'jewelry-background-generator': {
      category: '주얼리 촬영',
      title: '주얼리 배경 생성기',
      description:
        '반사, 그림자, 클로즈업 구도를 제어한 프리미엄 주얼리 장면을 생성합니다.',
      h1: '광택과 소재감을 살리는 주얼리 배경 생성기',
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
    'shoe-product-photography': {
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
