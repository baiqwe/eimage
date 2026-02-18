import { createFileRoute, redirect } from '@tanstack/react-router';
import { Routes } from '@/routes';

export const Route = createFileRoute('/settings/')({
  beforeLoad: () => {
    throw redirect({ to: Routes.SettingsProfile });
  },
});
