import { env } from 'cloudflare:workers';
import { websiteConfig } from '@/config/website';
import { getTemplate } from '../render';
import type {
  MailProvider,
  SendEmailResult,
  SendRawEmailParams,
  SendTemplateParams,
} from '@/mail/types';

/**
 * Cloudflare Email Service provider implementation.
 * Uses the Workers send_email binding (EMAIL) to send emails.
 * https://developers.cloudflare.com/email-service/get-started/send-emails/
 * https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
 */
export class CloudflareProvider implements MailProvider {
  private from: string;

  constructor() {
    const from = websiteConfig.mail?.fromEmail;
    if (!from) throw new Error('mail.fromEmail is required.');
    if (!env.EMAIL) {
      throw new Error(
        'EMAIL binding is not available. Make sure send_email is configured in wrangler.jsonc.'
      );
    }
    this.from = from;
  }

  getProviderName(): string {
    return 'cloudflare';
  }

  async sendTemplate(params: SendTemplateParams): Promise<SendEmailResult> {
    const { to, template, context } = params;
    try {
      const mailTemplate = await getTemplate({ template, context });
      return this.sendRawEmail({
        to,
        subject: mailTemplate.subject,
        html: mailTemplate.html,
        text: mailTemplate.text,
      });
    } catch (error) {
      console.error('Error sending template email:', error);
      return { success: false, error };
    }
  }

  async sendRawEmail(params: SendRawEmailParams): Promise<SendEmailResult> {
    const { to, subject, html, text } = params;
    if (!this.from || !to || !subject || !html) {
      console.warn('Missing required fields for email send', {
        from: this.from,
        to,
        subject,
        html,
      });
      return { success: false, error: 'Missing required fields' };
    }
    try {
      const result = await env.EMAIL.send({
        from: this.from,
        to,
        subject,
        html,
        text,
      });
      return { success: true, messageId: result?.messageId };
    } catch (error) {
      console.error('Error sending email via Cloudflare:', error);
      return { success: false, error };
    }
  }
}
