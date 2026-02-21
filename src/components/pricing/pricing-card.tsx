import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/auth/client';
import { formatPrice } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import type {
  PaymentType,
  PlanInterval,
  Price,
  PricePlan,
} from '@/payment/types';
import { PlanIntervals, PaymentTypes } from '@/payment/types';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { CheckoutButton } from './create-checkout-button';
import { Routes } from '@/lib/routes';
import { messages } from '@/messages';

function getPriceForPlan(
  plan: PricePlan,
  interval?: PlanInterval,
  paymentType?: PaymentType
): Price | undefined {
  if (plan.isFree) return undefined;
  return plan.prices.find((p) => {
    if (paymentType === PaymentTypes.ONE_TIME)
      return p.type === PaymentTypes.ONE_TIME;
    return p.type === PaymentTypes.SUBSCRIPTION && p.interval === interval;
  });
}

interface PricingCardProps {
  plan: PricePlan;
  interval?: PlanInterval;
  paymentType?: PaymentType;
  metadata?: Record<string, string>;
  className?: string;
  isCurrentPlan?: boolean;
}

export function PricingCard({
  plan,
  interval,
  paymentType,
  metadata,
  className,
  isCurrentPlan = false,
}: PricingCardProps) {
  const price = getPriceForPlan(plan, interval, paymentType);
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const card = messages.pricing.card;

  let formattedPrice = '';
  let priceLabel = '';
  if (plan.isFree) {
    formattedPrice = card.free;
  } else if (price && price.amount > 0) {
    formattedPrice = formatPrice(price.amount, price.currency);
    if (interval === PlanIntervals.MONTH) priceLabel = card.perMonth;
    else if (interval === PlanIntervals.YEAR) priceLabel = card.perYear;
  } else {
    formattedPrice = card.notAvailable;
  }

  const isPaidPlan = !plan.isFree && !!price;
  const hasValidPriceId = !!price?.priceId?.trim();
  const hasTrialPeriod =
    price?.trialPeriodDays != null && price.trialPeriodDays > 0;

  return (
    <Card
      className={cn(
        'flex h-full flex-col',
        plan.popular && 'relative overflow-visible',
        className
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            {card.popular}
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle>
          <h3 className="font-medium">{plan.name ?? plan.id}</h3>
        </CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="my-4 block text-4xl font-semibold">
            {formattedPrice}
          </span>
          {priceLabel && <span className="text-2xl">{priceLabel}</span>}
        </div>
        <CardDescription>
          <p className="text-sm">{plan.description ?? ''}</p>
        </CardDescription>

        {plan.isFree ? (
          currentUser ? (
            <Button variant="outline" className="mt-4 w-full" disabled>
              {card.getStartedForFree}
            </Button>
          ) : (
            <Link
              to={Routes.Login}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'mt-4 w-full cursor-pointer'
              )}
            >
              {card.getStartedForFree}
            </Link>
          )
        ) : isCurrentPlan ? (
          <Button
            disabled
            className="mt-4 w-full border border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-800"
          >
            {card.yourCurrentPlan}
          </Button>
        ) : isPaidPlan && price ? (
          currentUser && hasValidPriceId ? (
            <CheckoutButton
              planId={plan.id}
              priceId={price.priceId}
              metadata={metadata}
              className="mt-4 w-full cursor-pointer"
            >
              {plan.isLifetime ? card.getLifetimeAccess : card.getStarted}
            </CheckoutButton>
          ) : currentUser && !hasValidPriceId ? (
            <Button disabled className="mt-4 w-full">
              {card.notAvailable}
            </Button>
          ) : (
            <Link
              to={Routes.Login}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'mt-4 w-full cursor-pointer'
              )}
            >
              {card.getStarted}
            </Link>
          )
        ) : (
          <Button disabled className="mt-4 w-full">
            {card.notAvailable}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <hr className="border-dashed" />
        
        <ul className="list-outside space-y-4 text-sm">
          {plan.features?.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <IconCircleCheck className="size-4 text-green-500 dark:text-green-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <ul className="list-outside space-y-4 text-sm">
          {plan.limits?.map((limit, i) => (
            <li key={i} className="flex items-center gap-2">
              <IconCircleX className="size-4 text-gray-500 dark:text-gray-400" />
              <span>{limit}</span>
            </li>
          ))}
        </ul>

        {hasTrialPeriod && price && (
          <div className="my-4">
            <span className="inline-block rounded-md border border-blue-200 bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-800 shadow-sm dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {price.trialPeriodDays} {card.daysFreeTrial}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
