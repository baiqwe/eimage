import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { authRouteMiddleware } from '@/middlewares/auth-middleware';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  ssr: false,
  component: SettingsLayoutPage,
  server: {
    middleware: [authRouteMiddleware],
  },
});

function SettingsLayoutPage() {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
}
