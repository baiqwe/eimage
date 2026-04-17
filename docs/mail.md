# Mail module

Transactional email (verification, password reset, contact form, subscription welcome). Runs in Cloudflare Worker; **Cloudflare Email Service** is the built-in provider. Design allows adding other providers via a provider registry without changing callers.

**Consumers:** Auth (`sendVerificationEmail`, `sendResetPassword`), contact form (`sendContactMessage` in `src/api/contact.ts`), newsletter subscribe — all use `sendEmail(...)` only.

---

## Directory structure

```
src/mail/
├── index.ts           # sendEmail, getMailProvider, getTemplate; providerRegistry
├── types.ts           # EmailTemplate, MailProviderName, Send*Params, MailProvider
├── render.ts          # getTemplate, renderEmailHtml, toPlainText; subjectByTemplate
├── provider/
│   └── cloudflare.ts  # CloudflareProvider implements MailProvider
├── templates/
│   ├── verify-email.tsx
│   ├── forgot-password.tsx
│   ├── subscribe-newsletter.tsx
│   └── contact-message.tsx
└── components/
    ├── email-layout.tsx
    └── email-button.tsx
```

---

## Configuration

| Source | Key | Description |
|--------|-----|-------------|
| `websiteConfig.mail` | `provider` | `'cloudflare'`. Extend in `src/types/index.d.ts` when adding providers. |
| | `fromEmail` | Sender address (required for sending). |
| | `supportEmail` | Used by contact form target. |
| Wrangler binding | `EMAIL` | Required when using the **Cloudflare** provider. Configured via `send_email` binding in `wrangler.jsonc`. |

---

## Providers

### Cloudflare Email Service

Uses the [Cloudflare Email Service Workers API](https://developers.cloudflare.com/email-service/get-started/send-emails/) via the `send_email` binding. No API key needed — authentication is handled by the Worker binding.

**Prerequisites:**
1. Your domain must be using Cloudflare DNS.
2. Onboard your domain in the Cloudflare dashboard under **Email Sending**.
3. Add the `send_email` binding in `wrangler.jsonc` (already included in the template):

```jsonc
// wrangler.jsonc
"send_email": [
  {
    "name": "EMAIL"
  }
]
```

4. Run `pnpm cf-typegen` to regenerate Worker types.

**Usage:**

```ts
// src/config/website.ts
mail: {
  enable: true,
  provider: 'cloudflare',
  fromEmail: 'MyApp <support@example.com>',
}
```

> **Note:** The `fromEmail` address must be on a verified domain in your Cloudflare account.

---

## API

| Export | Description |
|--------|-------------|
| **sendEmail(params)** | `SendTemplateParams` → render template + send; `SendRawEmailParams` → send raw. Returns `Promise<SendEmailResult>`. |
| **getMailProvider()** | Lazy-initialized provider from `websiteConfig.mail.provider`. |
| **getTemplate({ template, context })** | Returns `{ html, text, subject }`; used by providers internally. |

**Types (re-exported):** `EmailTemplate`, `MailProviderName`, `SendTemplateParams`, `SendRawEmailParams`.

---

## Templates

| Template | Context | Subject (in render.ts) |
|----------|---------|---------------------------|
| forgotPassword | `{ url, name }` | Reset your password |
| verifyEmail | `{ url, name }` | Verify your email |
| subscribeNewsletter | `{ email? }` | Thanks for subscribing |
| contactMessage | `{ name, email, message }` | Contact Message from Website |

**Adding a template:** extend `EmailTemplate` in `types.ts` → add to `EmailTemplates` and `subjectByTemplate` in `render.ts` → add React component under `templates/`.

---

## Adding a new mail provider

The module uses a **provider registry** (`providerRegistry` in `index.ts`). To add a new provider:

1. **Types** — In `src/types/index.d.ts`, extend `MailConfig.provider` union (e.g. `'cloudflare' | 'newprovider'`).
2. **Implementation** — Add `src/mail/provider/<name>.ts` implementing `MailProvider` (`sendTemplate`, `sendRawEmail`, `getProviderName`). Use `getTemplate` from `../render` for template-based sends.
3. **Registration** — In `src/mail/index.ts`, add a factory to `providerRegistry`: `newprovider: () => new NewProvider(...)`, reading provider-specific env/bindings inside.

Callers continue using `sendEmail(...)` only.

---

## Dependencies

- **cloudflare:workers** — Cloudflare Workers env binding (when using Cloudflare provider; no extra npm dependency).
- **React / react-dom/server** — Template rendering (`renderToReadableStream` or `renderToStaticMarkup`).
