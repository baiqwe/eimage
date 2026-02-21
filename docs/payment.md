# Payment (Stripe)

Subscription and one-time payment support. No credits.

## Setup

1. **Env**: Copy `.env.local.example` and set:
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `VITE_STRIPE_PRICE_PRO_MONTHLY`, `VITE_STRIPE_PRICE_PRO_YEARLY`, `VITE_STRIPE_PRICE_LIFETIME` (Stripe Price IDs)

2. **DB**: Schema adds `user.customerId` and `payment` table. Generate and apply migrations:
   - `pnpm db:generate`
   - Then apply with your D1 workflow (e.g. `pnpm db:migrate:remote` or `pnpm db:migrate:local`)

3. **Stripe Dashboard**:
   - Create Products/Prices for Pro (monthly/yearly) and Lifetime.
   - Webhook: `https://your-domain.com/api/webhooks/stripe`  
     Events: `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.paid`.

## Routes

- **Pricing**: `/pricing` — plans and checkout buttons.
- **Payment callback**: `/payment?session_id=...&callback=/settings/billing` — polls until paid, then redirects.
- **Billing**: `/settings/billing` — current plan and “Manage subscription” (Stripe Customer Portal).

## Server API (Server Functions)

- `createCheckoutSession` — create Stripe Checkout, redirect URL returned.
- `createCustomerPortalSession` — create Stripe Billing Portal session.
- `getCurrentPlan` — current plan and subscription for a user.
- `checkPaymentCompletion` — whether a session is paid (for polling).

## Module layout

- `src/payment/` — types, provider interface, Stripe provider (no credits).
- `src/api/payment.ts` — server functions.
- `src/routes/api/webhooks/stripe.ts` — webhook POST handler.
- `src/lib/price-plan.ts` — plan/price helpers from config.
- `src/config/website.ts` — `price.plans` and env-based price IDs.
