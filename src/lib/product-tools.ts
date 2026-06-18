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
