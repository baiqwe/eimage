# Mail module

Transactional email (verification, password reset, contact form, subscription welcome). Runs in Cloudflare Worker; **Resend** is the built-in provider. Design allows adding other providers (e.g. Cloudflare Emails) via a provider registry without changing callers.

**Consumers:** Auth (`sendVerificationEmail`, `sendResetPassword`), contact form (`sendContactMessage` in `src/api/contact.ts`), newsletter subscribe — all use `sendEmail(...)` only.

---

## Directory structure

```
src/mail/
├── index.ts           # sendEmail, getMailProvider, getTemplate; providerRegistry
├── types.ts           # EmailTemplate, MailProviderName, Send*Params, MailProvider
├── render.ts          # getTemplate, renderEmailHtml, toPlainText; subjectByTemplate
├── provider/
│   └── resend.ts      # ResendProvider implements MailProvider
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
| `websiteConfig.mail` | `provider` | `'resend'`. Extend in `src/types/index.d.ts` when adding providers. |
| | `fromEmail` | Sender address (required for sending). |
| | `supportEmail` | Used by contact form target. |
| Env / Worker | `RESEND_API_KEY` | Required for Resend. `.dev.vars` or Wrangler secrets in production. |

---

## API

| Export | Description |
|--------|-------------|
| **sendEmail(params)** | `SendTemplateParams` → render template + send; `SendRawEmailParams` → send raw. Returns `Promise<boolean>`. |
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

The module uses a **provider registry** (`providerRegistry` in `index.ts`). To add e.g. Cloudflare Emails:

1. **Types** — In `src/mail/types.ts`, extend `MailProviderName` (e.g. `'resend' | 'cloudflare'`). In `src/types/index.d.ts`, extend `MailConfig.provider` with the same union.
2. **Implementation** — Add `src/mail/provider/cloudflare.ts` implementing `MailProvider` (`sendTemplate`, `sendRawEmail`, `getProviderName`). Use `getTemplate` from `../render` for template-based sends.
3. **Registration** — In `src/mail/index.ts`, add a factory to `providerRegistry`: `cloudflare: () => new CloudflareProvider(...)`, reading provider-specific env/bindings inside.

Callers continue using `sendEmail(...)` only.

---

## Dependencies

- **resend** — Resend SDK (when using Resend provider).
- **React / react-dom/server** — Template rendering (`renderToReadableStream` or `renderToStaticMarkup`).
