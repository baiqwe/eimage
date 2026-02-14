import { env } from 'cloudflare:workers';
import { websiteConfig } from '@/config/website';
import { BeehiivNewsletterProvider } from './provider/beehiiv';
import { ResendNewsletterProvider } from './provider/resend';
import type { NewsletterProvider } from './types';

export interface NewsletterEnv {
  RESEND_API_KEY?: string;
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUBLICATION_ID?: string;
}

function getEnv(): NewsletterEnv {
  if (typeof env !== 'undefined' && env) {
    return env as NewsletterEnv;
  }
  return {
    RESEND_API_KEY:
      typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined,
    BEEHIIV_API_KEY:
      typeof process !== 'undefined' ? process.env?.BEEHIIV_API_KEY : undefined,
    BEEHIIV_PUBLICATION_ID:
      typeof process !== 'undefined'
        ? process.env?.BEEHIIV_PUBLICATION_ID
        : undefined,
  };
}

function createProvider(): NewsletterProvider {
  const config = websiteConfig.newsletter;
  if (!config?.enable || !config?.provider) {
    throw new Error('Newsletter is not enabled or provider not set.');
  }
  const e = getEnv();
  switch (config.provider) {
    case 'resend': {
      const apiKey = e.RESEND_API_KEY;
      if (!apiKey)
        throw new Error('RESEND_API_KEY is required for newsletter.');
      return new ResendNewsletterProvider(apiKey);
    }
    case 'beehiiv': {
      const apiKey = e.BEEHIIV_API_KEY;
      const publicationId = e.BEEHIIV_PUBLICATION_ID;
      if (!apiKey || !publicationId) {
        throw new Error(
          'BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are required for newsletter.'
        );
      }
      return new BeehiivNewsletterProvider(apiKey, publicationId);
    }
    default:
      throw new Error(`Unsupported newsletter provider: ${config.provider}`);
  }
}

export function getNewsletterProvider(): NewsletterProvider {
  return createProvider();
}

export async function subscribe(email: string): Promise<boolean> {
  const provider = getNewsletterProvider();
  return provider.subscribe({ email });
}

export async function unsubscribe(email: string): Promise<boolean> {
  const provider = getNewsletterProvider();
  return provider.unsubscribe({ email });
}

export async function isSubscribed(email: string): Promise<boolean> {
  const provider = getNewsletterProvider();
  return provider.checkSubscribeStatus({ email });
}
