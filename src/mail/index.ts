import { serverEnv } from '@/env/server';
import { websiteConfig } from '@/config/website';
import type {
  MailProvider,
  MailProviderName,
  SendRawEmailParams,
  SendTemplateParams,
} from './types';
import { ResendProvider } from './provider/resend';

let mailProvider: MailProvider | null = null;

type ProviderFactory = () => MailProvider;

/**
 * Registry of mail provider factories
 **/
const providerRegistry: Record<MailProviderName, ProviderFactory> = {
  resend: () => {
    const apiKey = serverEnv.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY is required.');
    const from = websiteConfig.mail?.fromEmail;
    if (!from) throw new Error('mail.fromEmail is required in websiteConfig.');
    return new ResendProvider({ apiKey, from });
  },
};

function createProvider(): MailProvider {
  const name = websiteConfig.mail?.provider;
  if (!name) throw new Error('mail.provider is required in websiteConfig.');
  const factory = providerRegistry[name as MailProviderName];
  if (!factory) {
    throw new Error(`Unsupported mail provider: ${name}.`);
  }
  return factory();
}

/**
 * Get the mail provider (lazy-initialized on first use)
 */
export function getMailProvider(): MailProvider {
  if (!mailProvider) mailProvider = createProvider();
  return mailProvider;
}

/**
 * Send email using the configured mail provider
 */
export async function sendEmail(
  params: SendTemplateParams | SendRawEmailParams
): Promise<boolean> {
  const provider = getMailProvider();
  const result =
    'template' in params
      ? await provider.sendTemplate(params)
      : await provider.sendRawEmail(params);
  return result.success;
}
