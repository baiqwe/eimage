import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/auth/auth-client';
import { Routes } from '@/routes';
import { authMiddleware } from '@/middleware/auth-middleware';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/dashboard')({
  ssr: false,
  component: DashboardLayout,
  server: {
    middleware: [authMiddleware],
  },
});

function DashboardLayout() {
  return (
    <DashboardLayoutWrapper>
      <Outlet />
    </DashboardLayoutWrapper>
  );
}

/** 
 * Wraps children with sidebar and enforces auth (redirect to login if no session)
 * @param children - The children to wrap
 * @returns A sidebar provider with the children wrapped in a sidebar inset
 */
function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      navigate({ to: Routes.Login });
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <SidebarProvider
      className="min-h-svh flex"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
