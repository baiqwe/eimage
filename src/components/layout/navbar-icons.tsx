import {
  IconArrowUpRight,
  IconBuilding,
  IconChevronDown,
  IconChevronRight,
  IconCookie,
  IconFileText,
  IconChecklist,
  IconMail,
  IconMailbox,
  IconLayout2,
  IconMenu2,
  IconShieldCheck,
  IconX,
} from '@tabler/icons-react';
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building: IconBuilding,
  Mail: IconMail,
  Mailbox: IconMailbox,
  SquareKanban: IconLayout2,
  ListChecks: IconChecklist,
  Cookie: IconCookie,
  ShieldCheck: IconShieldCheck,
  FileText: IconFileText,
  Menu2: IconMenu2,
  X: IconX,
  ChevronDown: IconChevronDown,
  ChevronRight: IconChevronRight,
  ArrowUpRight: IconArrowUpRight,
};

export function NavbarIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  if (!name) return null;
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
