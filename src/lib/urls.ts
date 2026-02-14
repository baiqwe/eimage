const DEFAULT_BASE_URL = 'http://localhost:3000';

/**
 * Get the base URL. Value comes from Vite at build/dev time:
 * - pnpm dev: .env.local (or .env.development)
 * - pnpm build: .env.production (mode is production)
 */
export function getBaseUrl(): string {
  return import.meta.env.VITE_BASE_URL ?? DEFAULT_BASE_URL;
}

/**
 * Get the URL of the image, if the image is a relative path, it will be prefixed with the base URL
 * @param image - The image URL
 * @returns The URL of the image
 */
export function getImageUrl(image: string): string {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  if (image.startsWith('/')) {
    return `${getBaseUrl()}${image}`;
  }
  return `${getBaseUrl()}/${image}`;
}

/**
 * Get the Stripe dashboard customer URL
 * @param customerId - The Stripe customer ID
 * @returns The Stripe dashboard customer URL
 */
export function getStripeDashboardCustomerUrl(customerId: string): string {
  if (import.meta.env.DEV) {
    return `https://dashboard.stripe.com/test/customers/${customerId}`;
  }
  return `https://dashboard.stripe.com/customers/${customerId}`;
}
