import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BillingCard } from '@/components/settings/billing-card';
import { messages } from '@/messages';

const m = messages.settings.billing;

export const Route = createFileRoute('/settings/billing')({
  component: BillingPage,
});

function BillingPage() {
  const breadcrumbs = [
    { label: messages.common.settings, isCurrentPage: false },
    { label: m.breadcrumb, isCurrentPage: true },
  ];

  return (
    <DashboardLayout
      breadcrumbs={breadcrumbs}
      title={m.title}
      description={m.description}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <BillingCard />
      </div>
    </DashboardLayout>
  );
}
