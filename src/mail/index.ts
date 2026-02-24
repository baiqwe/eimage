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

const providerRegistry: Record<MailProviderName, ProviderFactory> = {
  resend: () => new ResendProvider(),
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
  if (!websiteConfig.mail?.enable) return false;
  const provider = getMailProvider();
  const result =
    'template' in params
      ? await provider.sendTemplate(params)
      : await provider.sendRawEmail(params);
  return result.success;
}
