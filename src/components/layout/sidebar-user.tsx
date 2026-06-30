import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { websiteConfig } from '@/config/website';
import type { SessionUser } from '@/auth/types';
import {
  IconDeviceDesktop,
  IconLoader2,
  IconLogout,
  IconMoon,
  IconSelector,
  IconSun,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTheme } from '@/components/theme/theme-provider';
import { UserAvatar } from '@/components/shared/user-avatar';
import { messages } from '@/messages';
import { useReliableSignOut } from '@/hooks/use-reliable-sign-out';

const m = messages.common;

interface SidebarUserProps {
  user: SessionUser;
  className?: string;
}

export function SidebarUser({ user }: SidebarUserProps) {
  const { setTheme, theme } = useTheme();
  const { isMobile } = useSidebar();
  const showModeSwitch = websiteConfig.ui?.mode?.enableSwitch ?? false;
  const [open, setOpen] = useState(false);
  const { isSigningOut, signOut } = useReliableSignOut();

  const ThemeIcon =
    theme === 'system'
      ? IconDeviceDesktop
      : theme === 'dark'
        ? IconMoon
        : IconSun;

  return (
    <SidebarMenu className="border-t pt-4">
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="bg-sidebar-accent/60 text-sidebar-accent-foreground hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserAvatar
                  name={user.name ?? null}
                  image={user.image ?? null}
                  className="size-8 border"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <IconSelector className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar
                    name={user.name ?? null}
                    image={user.image ?? null}
                    className="size-8 border"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              {showModeSwitch && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ThemeIcon className="mr-2 size-4" />
                      {m.mode.theme}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        <IconSun className="mr-2 size-4" />
                        {m.mode.light}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        <IconMoon className="mr-2 size-4" />
                        {m.mode.dark}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
                        <IconDeviceDesktop className="mr-2 size-4" />
                        {m.mode.system}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
