import type { ProductLocale } from '@/components/product/product-locale';

export type GalleryLocale = ProductLocale;

export type ProductGalleryItem = {
  id: string;
  kind: 'main' | 'detail' | 'ad';
  title: string;
  titleZh: string;
  product: string;
  productZh: string;
  style: string;
  ratio: string;
  alt: string;
  altZh: string;
  palette: [string, string, string];
};

const ITEM_TRANSLATIONS: Record<
  ProductLocale,
  Record<string, { title: string; product: string; alt: string }>
> = {
  zh: {},
  en: {},
  ja: {
    'ceramic-cup-studio': {
      title: '柔らかな影のマーケットプレイス主画像',
      product: 'マットな陶器コーヒーカップ',
      alt: '柔らかな影を使った陶器コーヒーカップの AI EC 主画像',
    },
    'jewelry-dark-editorial': {
      title: '高級感のある暗調ジュエリー詳細画像',
      product: '宝石付きゴールドリング',
      alt: 'リング構造を保った暗調エディトリアル照明の AI ジュエリー詳細画像',
    },
    'shoe-outdoor-lifestyle': {
      title: '自然光のシューズライフスタイル画像',
      product: '白いランニングシューズ',
      alt: '自然な屋外光を使った EC 向け AI シューズライフスタイル画像',
    },
    'skincare-color-block': {
      title: 'カラーブロックのスキンケア広告セット',
      product: 'ミニマルなスキンケアボトル',
      alt: '高級感のあるカラーブロック背景の AI スキンケア広告画像',
    },
    'coffee-window-lifestyle': {
      title: '朝の窓辺ライフスタイルシーン',
      product: '陶器コーヒーカップセット',
      alt: '朝の窓辺の光を使った陶器カップセットの AI 詳細画像',
    },
    'retail-neon-pack': {
      title: 'ネオン小売ショーケース',
      product: 'テックアクセサリー',
      alt: 'ネオンの小売照明を使ったテックアクセサリーの AI EC 広告画像',
    },
  },
  ko: {
    'ceramic-cup-studio': {
      title: '부드러운 그림자의 마켓플레이스 메인 이미지',
      product: '무광 세라믹 커피컵',
      alt: '부드러운 그림자가 적용된 무광 세라믹 커피컵 AI 이커머스 메인 이미지',
    },
    'jewelry-dark-editorial': {
      title: '프리미엄 다크 주얼리 상세 이미지',
      product: '보석 골드 링',
      alt: '반지 구조를 유지한 다크 에디토리얼 조명의 AI 주얼리 상세 이미지',
    },
    'shoe-outdoor-lifestyle': {
      title: '자연광 슈즈 라이프스타일 이미지',
      product: '화이트 러닝화',
      alt: '자연 야외 조명의 이커머스용 AI 신발 라이프스타일 이미지',
    },
    'skincare-color-block': {
      title: '컬러 블록 스킨케어 광고 세트',
      product: '미니멀 스킨케어 보틀',
      alt: '프리미엄 컬러 블록 배경의 AI 스킨케어 광고 이미지',
    },
    'coffee-window-lifestyle': {
      title: '아침 창가 라이프스타일 장면',
      product: '세라믹 커피컵 세트',
      alt: '아침 창가 빛을 활용한 세라믹 커피컵 세트 AI 상세 이미지',
    },
    'retail-neon-pack': {
      title: '네온 리테일 쇼케이스',
      product: '테크 액세서리',
      alt: '네온 리테일 조명의 테크 액세서리 AI 이커머스 광고 이미지',
    },
  },
  es: {
    'ceramic-cup-studio': {
      title: 'Imagen principal con sombra suave',
      product: 'Taza de café cerámica mate',
      alt: 'Imagen principal ecommerce IA de una taza cerámica mate con sombras suaves',
    },
    'jewelry-dark-editorial': {
      title: 'Detalle premium de joyería oscura',
      product: 'Anillo de oro con gema',
      alt: 'Imagen IA de joyería con iluminación editorial oscura y estructura preservada',
    },
    'shoe-outdoor-lifestyle': {
      title: 'Escena lifestyle natural para calzado',
      product: 'Zapatilla blanca de running',
      alt: 'Imagen lifestyle IA para calzado ecommerce con luz natural exterior',
    },
    'skincare-color-block': {
      title: 'Set publicitario de skincare con bloques de color',
      product: 'Botella minimalista de skincare',
      alt: 'Creatividad publicitaria IA para skincare con fondo premium de bloques de color',
    },
    'coffee-window-lifestyle': {
      title: 'Escena lifestyle de ventana matutina',
      product: 'Set de tazas cerámicas',
      alt: 'Imagen de detalle IA con luz de ventana matutina para set de tazas cerámicas',
    },
    'retail-neon-pack': {
      title: 'Showcase retail con neón',
      product: 'Accesorio tecnológico',
      alt: 'Imagen publicitaria ecommerce IA con iluminación neón para accesorio tecnológico',
    },
  },
};

export const PRODUCT_GALLERY: ProductGalleryItem[] = [
  {
    id: 'ceramic-cup-studio',
    kind: 'main',
    title: 'Soft shadow marketplace hero',
    titleZh: '柔光平台主图',
    product: 'Matte ceramic coffee cup',
    productZh: '哑光陶瓷咖啡杯',
    style: 'Soft Shadow Marketplace',
    ratio: '3:4',
    alt: 'AI ecommerce main image for a matte ceramic coffee cup with soft marketplace shadows',
    altZh: '带柔和平台阴影的哑光陶瓷咖啡杯 AI 电商主图',
    palette: ['#f8faf2', '#d9ded1', '#2f5f4f'],
  },
  {
    id: 'jewelry-dark-editorial',
    kind: 'detail',
    title: 'Premium dark jewelry detail',
    titleZh: '高级暗调珠宝详情图',
    product: 'Gold ring with gemstone',
    productZh: '宝石金戒指',
    style: 'Premium Dark Editorial',
    ratio: '1:1',
    alt: 'AI jewelry detail image with dark editorial lighting and preserved ring structure',
    altZh: '保留戒指结构的暗调高级珠宝 AI 详情图',
    palette: ['#141712', '#3c4236', '#c9822f'],
  },
  {
    id: 'shoe-outdoor-lifestyle',
    kind: 'detail',
    title: 'Outdoor natural shoe lifestyle',
    titleZh: '自然户外鞋类场景图',
    product: 'White running shoe',
    productZh: '白色跑鞋',
    style: 'Outdoor Natural Tabletop',
    ratio: '4:5',
    alt: 'AI shoe product lifestyle image for ecommerce with outdoor natural lighting',
    altZh: '自然户外光线下的 AI 鞋类电商生活方式场景图',
    palette: ['#e2d4b8', '#fbfcf7', '#2f5f4f'],
  },
  {
    id: 'skincare-color-block',
    kind: 'ad',
    title: 'Color block skincare ad set',
    titleZh: '彩色块护肤品广告图',
    product: 'Minimal skincare bottle',
    productZh: '极简护肤瓶',
    style: 'Color Block Premium',
    ratio: '1:1',
    alt: 'AI skincare product ad creative with premium color block background',
    altZh: '高级彩色块背景的 AI 护肤品广告创意图',
    palette: ['#b8d5cd', '#f8f4ea', '#c9822f'],
  },
  {
    id: 'coffee-window-lifestyle',
    kind: 'detail',
    title: 'Morning window lifestyle scene',
    titleZh: '清晨窗台生活方式图',
    product: 'Ceramic coffee cup set',
    productZh: '陶瓷咖啡杯套装',
    style: 'Morning Window Lifestyle',
    ratio: '3:4',
    alt: 'AI product detail image with morning window light for a ceramic coffee cup set',
    altZh: '清晨窗边光线下的陶瓷咖啡杯套装 AI 详情图',
    palette: ['#f1e6cf', '#fbfcf7', '#d7e2d7'],
  },
  {
    id: 'retail-neon-pack',
    kind: 'ad',
    title: 'Neon retail showcase',
    titleZh: '霓虹零售展示图',
    product: 'Tech accessory',
    productZh: '科技配件',
    style: 'Neon Retail Showcase',
    ratio: '16:9',
    alt: 'AI ecommerce ad image with neon retail lighting for a tech accessory',
    altZh: '霓虹零售灯光下的科技配件 AI 电商广告图',
    palette: ['#132235', '#2f5f4f', '#c9822f'],
  },
];

export function getGalleryItemCopy(
  item: ProductGalleryItem,
  locale: GalleryLocale
) {
  if (locale === 'zh') {
    return { title: item.titleZh, product: item.productZh, alt: item.altZh };
  }
  if (locale === 'en') {
    return { title: item.title, product: item.product, alt: item.alt };
  }
  return ITEM_TRANSLATIONS[locale][item.id];
}

export function getGalleryCopy(locale: GalleryLocale) {
  return {
    zh: {
      badge: '生成样例画廊',
      title: '从主图到详情页，预览不同品类的商品视觉资产',
      description:
        '这些样例展示工作台后续接入真实生图 API 后的目标结果：保留商品形貌，重制背景、光影、场景和广告氛围。',
      viewAll: '查看完整画廊',
      openGenerator: '进入生成器',
      labels: {
        main: '主图',
        detail: '详情图',
        ad: '广告图',
      },
    },
    en: {
      badge: 'Generated Gallery',
      title: 'Preview ecommerce assets across hero, detail, and ad scenes',
      description:
        'These examples show the target output for the real generation API: preserve product shape while redesigning backgrounds, lighting, scenes, and campaign mood.',
      viewAll: 'View full gallery',
      openGenerator: 'Open generator',
      labels: {
        main: 'Main',
        detail: 'Detail',
        ad: 'Ad',
      },
    },
    ja: {
      badge: '生成サンプルギャラリー',
      title: '主画像、詳細シーン、広告素材の生成例を確認',
      description:
        '商品の形状を保ちながら、背景、光、シーン、広告の雰囲気を再設計する生成結果の方向性を示します。',
      viewAll: 'ギャラリーを見る',
      openGenerator: '生成ツールを開く',
      labels: { main: '主画像', detail: '詳細画像', ad: '広告画像' },
    },
    ko: {
      badge: '생성 샘플 갤러리',
      title: '메인 이미지, 상세 장면, 광고 소재 예시 보기',
      description:
        '상품 형태를 유지하면서 배경, 조명, 장면, 캠페인 분위기를 재설계하는 목표 결과를 보여줍니다.',
      viewAll: '전체 갤러리 보기',
      openGenerator: '생성기 열기',
      labels: { main: '메인', detail: '상세', ad: '광고' },
    },
    es: {
      badge: 'Galería generada',
      title: 'Explora imágenes principales, escenas de detalle y anuncios',
      description:
        'Estos ejemplos muestran el resultado objetivo: conservar la forma del producto y rediseñar fondo, luz, escena y estilo de campaña.',
      viewAll: 'Ver galería completa',
      openGenerator: 'Abrir generador',
      labels: { main: 'Principal', detail: 'Detalle', ad: 'Anuncio' },
    },
  }[locale];
}
