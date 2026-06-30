import { getAvatarLinks } from '@/config/avatar-config';
import { IconLoader2, IconLogout } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from './user-avatar';
import { messages } from '@/messages';
import { useState } from 'react';
import type { SessionUser } from '@/auth/types';
import { useReliableSignOut } from '@/hooks/use-reliable-sign-out';

interface UserButtonProps {
  user: SessionUser;
}

export function UserButton({ user }: UserButtonProps) {
  const avatarLinks = getAvatarLinks();
  const [open, setOpen] = useState(false);
  const { isSigningOut, signOut } = useReliableSignOut();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger aria-label="User menu">
        <UserAvatar
          name={user.name ?? null}
          image={user.image ?? null}
          className="size-8 border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {avatarLinks.map((item) =>
          item.href ? (
            <Link key={item.title} to={item.href} className="block">
              <DropdownMenuItem>
                {item.icon ? <item.icon className="mr-2 size-4" /> : null}
                {item.title}
              </DropdownMenuItem>
            </Link>
          ) : null
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={async (event) => {
            event.preventDefault();
            setOpen(false);
            await signOut();
          }}
        >
          {isSigningOut ? (
            <IconLoader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <IconLogout className="mr-2 size-4" />
          )}
          {messages.auth.common.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
