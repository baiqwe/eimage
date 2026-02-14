# MkFast Template

A full-stack web template built with **TanStack Start**, **React 19**, and **Vite**, deployable to **Cloudflare**. It includes authentication (Better Auth), content-driven pages (Content Collections), newsletter, contact form, and marketing blocks—ready to customize and ship.

---

## Features

- **TanStack Start** – File-based routing, SSR, API routes, server functions
- **Better Auth** – Email/password and social login (Google, GitHub), session management
- **Content Collections** – Markdown-based blog and static pages (About, Terms, Privacy, Cookie Policy)
- **Newsletter** – Resend/Beehiiv integration with subscribe API and welcome emails
- **Contact** – Contact form with email delivery via Resend
- **Marketing UI** – Hero, features, pricing, FAQ, testimonials, CTA, footer (configurable via `src/config/website.ts`)
- **Shadcn UI** – Base UI + Radix primitives, Tailwind CSS, dark/light theme
- **Icons** – Tabler Icons (`@tabler/icons-react`)
- **Database** – Drizzle ORM with Cloudflare D1 (optional)
- **Deploy** – `pnpm deploy` for Cloudflare Workers/Pages

---

## Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Framework   | TanStack Start (React 19, Vite 7) |
| Styling     | Tailwind CSS v4, tw-animate   |
| UI          | Shadcn, Base UI, Radix UI     |
| Auth        | Better Auth                   |
| Content     | Content Collections (Markdown)|
| Mail        | Resend                        |
| Newsletter  | Resend or Beehiiv             |
| Database    | Drizzle ORM, Cloudflare D1    |
| Lint/Format | Biome                        |
| Deploy      | Cloudflare (Wrangler)         |

---

## Project Structure

```
├── content/                    # Markdown content (Content Collections)
│   ├── blog/                   # Blog posts
│   └── pages/                  # Static pages (about, terms, privacy, cookie)
├── content-collections.ts      # Content Collections config (blog + pages)
├── src/
│   ├── config/                 # App configuration
│   │   ├── website.ts          # Main site config (features, mail, newsletter, routes)
│   │   ├── navbar-config.ts    # Navbar links
│   │   ├── footer-config.ts    # Footer links
│   │   ├── price-config.ts     # Pricing plans
│   │   └── ...
│   ├── routes/                 # File-based routes (TanStack Router)
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Home
│   │   ├── about.tsx           # About (static layout)
│   │   ├── contact.tsx         # Contact form
│   │   ├── waitlist.tsx        # Waitlist / newsletter signup
│   │   ├── blog/               # Blog list + post by slug
│   │   ├── terms.tsx           # Terms of Service (Markdown)
│   │   ├── privacy.tsx         # Privacy Policy (Markdown)
│   │   ├── cookie.tsx          # Cookie Policy (Markdown)
│   │   ├── auth/               # Login, register, forgot/reset password
│   │   ├── api/                # API routes (contact, newsletter, auth)
│   │   └── demo/               # Demo pages (table, store, tanstack-query)
│   ├── components/
│   │   ├── layout/             # Navbar, footer, container, theme, user menu
│   │   ├── blocks/             # Marketing sections (hero, features, pricing, etc.)
│   │   ├── blog/               # BlogCard, BlogGrid, MarkdownBody, pagination
│   │   ├── page/               # PageMarkdown (legal/content pages)
│   │   ├── contact/            # ContactFormCard
│   │   ├── waitlist/           # WaitlistFormCard
│   │   ├── auth/               # Login/register forms, auth card
│   │   ├── ui/                 # Shadcn UI primitives
│   │   └── shared/             # FormError, FormSuccess, BackButtonSmall
│   ├── lib/                    # Utilities and data helpers
│   │   ├── blog.ts             # getPostBySlug, getPaginatedPosts
│   │   ├── pages.ts            # getPageBySlug
│   │   ├── auth.ts             # Better Auth server config
│   │   ├── auth-client.ts      # Better Auth client
│   │   └── utils.ts
│   ├── mail/                   # Email templates (Resend) and render
│   ├── newsletter/             # Newsletter providers (Resend, Beehiiv)
│   ├── db/                     # Drizzle schema and client
│   ├── routes.ts               # Central route constants
│   └── types/
├── public/
├── .env.local.example
├── .env.production.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Install and run

```bash
pnpm install
cp .env.local.example .env.local   # then set BETTER_AUTH_SECRET, etc.
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and preview

```bash
pnpm build
pnpm preview
```

### Deploy to Cloudflare

```bash
pnpm deploy
```

Uses `wrangler` and the Cloudflare Vite plugin; ensure Cloudflare account and `wrangler.toml` / env are set.

---

## Configuration

### Website config

Main config lives in `src/config/website.ts`. You can toggle:

- **Blog** – `blog.enable`, `blog.paginationSize`
- **Newsletter** – `newsletter.enable`, `newsletter.provider` (resend | beehiiv)
- **Mail** – `mail.provider`, `mail.fromEmail`, `mail.supportEmail`
- **Auth** – `auth.enableGoogleLogin`, `auth.enableCredentialLogin`
- **UI** – `ui.mode.defaultMode` (dark/light), theme switch
- **Metadata** – `metadata.images`, `metadata.social` (links for footer/navbar)

Navbar and footer links are driven by `src/config/navbar-config.ts` and `src/config/footer-config.ts` (they respect `blog.enable`, `docs.enable`, etc.).

### Environment variables

- Copy `.env.local.example` to `.env.local` and set:
  - `BETTER_AUTH_SECRET` – required for auth (e.g. `npx @better-auth/cli secret`)
  - `RESEND_API_KEY` – for mail and newsletter (if using Resend)
  - Database and other provider keys as needed (see examples).

Production: use `.env.production.example` as a reference and set vars in your Cloudflare project (e.g. Secrets).

---

## Content Collections

Content is defined in `content-collections.ts` and consumed via the generated `content-collections` module.

### Collections

- **blog** – `content/blog/*.md` (title, description, date, category, content, image, author, avatar)
- **pages** – `content/pages/*.md` (title, description, date?, content) for About and legal pages

### Usage in code

```ts
import { allBlogs } from 'content-collections';
import { getPostBySlug, getPaginatedPosts } from '@/lib/blog';
import { getPageBySlug } from '@/lib/pages';
```

Routes:

- `/blog` – list of posts (with pagination)
- `/blog/:slug` – single post
- `/about` – custom About layout (no Markdown)
- `/terms`, `/privacy`, `/cookie` – rendered from `content/pages/*.md` with `PageMarkdown`

### Adding a blog post

Create `content/blog/your-post.md` with frontmatter:

```yaml
---
title: Your Title
description: Short description
date: 2025-01-15
category: General
author: Your Name
avatar: https://...
image: https://...   # optional
---

Your markdown body...
```

### Adding or editing legal pages

Edit or add Markdown under `content/pages/` (e.g. `terms-of-service.md`, `privacy-policy.md`, `cookie-policy.md`). The route slug is derived from the filename (e.g. `terms-of-service` → `/terms`, `cookie-policy` → `/cookie` via `getPageBySlug('cookie-policy')`).

---

## Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start dev server (port 3000)   |
| `pnpm build`      | Production build               |
| `pnpm preview`    | Preview production build       |
| `pnpm deploy`     | Build and deploy (Cloudflare)  |
| `pnpm test`       | Run Vitest tests               |
| `pnpm check`      | Biome check                    |
| `pnpm lint`       | Biome check --write            |
| `pnpm format`     | Biome format --write           |
| `pnpm db:generate`| Drizzle: generate migrations   |
| `pnpm db:push`    | Drizzle: push schema            |
| `pnpm db:studio:local` | Drizzle Studio (local)    |
| `pnpm db:migrate:local` | D1 migrations (local)     |
| `pnpm db:migrate:remote`| D1 migrations (remote)   |
| `pnpm cf-typegen` | Wrangler types for Env         |

---

## Auth (Better Auth)

1. Set `BETTER_AUTH_SECRET` in `.env.local` (e.g. `npx @better-auth/cli secret`).
2. Optional: add a database (e.g. D1, PostgreSQL) in `src/lib/auth.ts` and run `npx @better-auth/cli migrate`.

Auth routes: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/error`.  
API proxy: `src/routes/api/auth/$.ts` (handles Better Auth API).

---

## Mail and contact

- **Mail** – Resend in `src/mail/` (templates: contact, newsletter welcome, forgot password, verify email).
- **Contact form** – POST `/api/contact` (body: name, email, message). Sends to `websiteConfig.mail.supportEmail` using the contact template.

---

## Newsletter

- **Subscribe** – POST `/api/newsletter/subscribe` with `{ email }`. Uses Resend or Beehiiv per `websiteConfig.newsletter`.
- **Unsubscribe / status** – `/api/newsletter/unsubscribe`, `/api/newsletter/status`.

Homepage and Waitlist page both use the same subscribe API.

---

## Shadcn UI

Add new components with:

```bash
pnpm dlx shadcn@latest add <component>
```

Config: `components.json`. Path alias: `@/*` → `src/*`.

---

## Linting and formatting

Biome is used for lint and format:

```bash
pnpm check    # check only
pnpm lint     # check and apply fixes
pnpm format   # format code
```

---

## Demo pages

The `src/routes/demo/` folder contains example pages (TanStack Table, Store, TanStack Query). They are optional; you can remove the demo route files and any references in your layout/nav if you don’t need them.

---

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Better Auth](https://www.better-auth.com)
- [Content Collections](https://content-collections.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
