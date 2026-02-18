import { clientEnv } from '@/env/client';

/**
 * Site origin (build-time). Safe to call from both client and server:
 * Vite inlines import.meta.env at build time, so server bundle gets the same value.
 */
export function getBaseUrl(): string {
  return clientEnv.VITE_BASE_URL;
}

/** 
 * Build canonical URL for a path (e.g. /about -> https://example.com/about)
 * @param path - The path to build the canonical URL for
 * @returns The canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
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
