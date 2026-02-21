import { createFileRoute, useSearch } from '@tanstack/react-router';
import { PaymentCard } from '@/components/payment/payment-card';

export const Route = createFileRoute('/settings/payment')({
  validateSearch: (s): { session_id?: string; callback?: string } => ({
    session_id: typeof s?.session_id === 'string' ? s.session_id : undefined,
    callback: typeof s?.callback === 'string' ? s.callback : undefined,
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const search = useSearch({ from: '/settings/payment' });
  return (
    <PaymentCard
      sessionId={search.session_id}
      callback={search.callback ?? '/settings/billing'}
    />
  );
}
