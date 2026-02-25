import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { adminRouteMiddleware } from '@/middlewares/admin-middleware';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  ssr: false,
  component: AdminLayoutPage,
  server: {
    middleware: [adminRouteMiddleware],
  },
});

function AdminLayoutPage() {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
}
