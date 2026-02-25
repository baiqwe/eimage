import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { authRouteMiddleware } from '@/middlewares/auth-middleware';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  ssr: false,
  component: DashboardLayoutPage,
  server: {
    middleware: [authRouteMiddleware],
  },
});

function DashboardLayoutPage() {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
}
