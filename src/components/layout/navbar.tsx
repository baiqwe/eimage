import { getNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { authClient } from '@/auth/client';
import { isLinkActive } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Container from '@/components/layout/container';
import { Logo } from '@/components/shared/logo';
import { ModeSwitcher } from '@/components/theme/mode-switcher';
import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { UserButton } from '@/components/shared/user-button';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { IconArrowUpRight } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { websiteConfig } from '@/config/website';
import { messages } from '@/messages';
import {
  ProductLanguageSelect,
  useProductLocale,
} from '@/components/product/product-locale';

interface NavbarProps {
  scroll?: boolean;
}

export function Navbar({ scroll = true }: NavbarProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const scrolled = useScroll(50);
  const { locale, setLocale } = useProductLocale();
  const menuLinks = getNavbarLinks(locale);
  const [mounted, setMounted] = useState(false);
  const [menuValue, setMenuValue] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const showBarBg = scroll && scrolled;
  const handleLocaleChange = (next: typeof locale) => {
    setLocale(next);
    const nextPath = getLocalizedPublicPath(pathname, next);
    if (nextPath !== pathname) {
      navigate({ to: nextPath });
    }
  };

  // Sync mount (avoid auth hydration mismatch) and close menu on route change
  useEffect(() => {
    setMounted(true);
    setMenuValue(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky inset-x-0 top-0 z-40 h-14 transition-all duration-300',
        'bg-background/95 backdrop-blur-md',
        showBarBg && 'border-b'
      )}
    >
      {showBarBg && (
        <div
          className="absolute inset-0 z-0 bg-muted/50 backdrop-blur-md"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 flex h-full items-center">
        <Container className="px-4">
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4"
          >
            <Link
              to="/"
              aria-label="Home"
              className="flex items-center gap-2 shrink-0"
            >
              <Logo />
              <span className="text-xl font-semibold">
                {websiteConfig.metadata?.name}
              </span>
            </Link>

            <NavigationMenu
              value={menuValue}
              onValueChange={setMenuValue}
              className="flex-1 justify-center"
            >
              <NavigationMenuList aria-orientation={undefined}>
                {menuLinks?.map((item) =>
                  item.items ? (
                    <NavigationMenuItem key={item.title} value={item.title}>
                      <NavigationMenuTrigger
                        className={cn(
                          'bg-transparent',
                          item.items.some((sub) =>
                            isLinkActive(sub.href, pathname)
                          ) && 'font-semibold text-foreground'
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-100 gap-3 p-3 md:w-125 md:grid-cols-2 lg:w-150">
                          {item.items.map((sub) => (
                            <li
                              className={sub.groupLabel ? 'col-span-full' : ''}
                              key={sub.title}
                            >
                              {sub.groupLabel ? (
                                <div className="px-2 pt-2 pb-1 font-semibold text-[11px] text-muted-foreground uppercase tracking-wide">
                                  {sub.title}
                                </div>
                              ) : (
                                <NavigationMenuLink
                                  closeOnClick
                                  className={cn(
                                    'group flex select-none flex-row items-center gap-4 rounded-md',
                                    'p-2 leading-none no-underline outline-hidden transition-colors',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    'focus:bg-accent focus:text-accent-foreground',
                                    isLinkActive(sub.href, pathname) &&
                                      'bg-accent text-accent-foreground'
                                  )}
                                  render={
                                    <Link
                                      to={sub.href ?? '#'}
                                      target={
                                        sub.external ? '_blank' : undefined
                                      }
                                      rel={
                                        sub.external
                                          ? 'noopener noreferrer'
                                          : undefined
                                      }
                                    />
                                  }
                                >
                                  {sub.icon ? (
                                    <sub.icon className="size-4 shrink-0" />
                                  ) : null}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">
                                      {sub.title}
                                    </div>
                                    {sub.description ? (
                                      <p className="text-xs text-muted-foreground">
                                        {sub.description}
                                      </p>
                                    ) : null}
                                  </div>
                                  {sub.external ? (
                                    <IconArrowUpRight className="size-4 shrink-0" />
                                  ) : null}
                                </NavigationMenuLink>
                              )}
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        render={<Link to={item.href ?? '#'} />}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'bg-transparent',
                          isLinkActive(item.href, pathname) &&
                            'font-semibold text-primary'
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4 shrink-0">
              <ProductLanguageSelect
                locale={locale}
                onLocaleChange={handleLocaleChange}
                compact
              />
              <ModeSwitcher />
              {websiteConfig.auth?.enable &&
                (!mounted || isPending ? (
                  <Skeleton className="size-8 rounded-full" />
                ) : user ? (
                  <UserButton user={user} />
                ) : (
                  <>
                    <LoginWrapper mode="modal" asChild>
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                          }),
                          'cursor-pointer'
                        )}
                      >
                        {messages.auth.common.login}
                      </button>
                    </LoginWrapper>
                    <Link
                      to={Routes.Register}
                      className={buttonVariants({ size: 'sm' })}
                    >
                      {messages.auth.common.signup}
                    </Link>
                  </>
                ))}
            </div>
          </nav>

          <NavbarMobile className="lg:hidden" />
        </Container>
      </div>
    </header>
  );
}

function getLocalizedPublicPath(pathname: string, locale: string) {
  const slug = pathname.match(/^\/(?:zh\/)?tools\/([^/]+)\/?$/)?.[1];
  if (locale === 'zh') {
    if (slug) return `/zh/tools/${slug}`;
    if (pathname === '/tools' || pathname === '/tools/') return '/zh/tools';
    if (pathname === '/gallery') return '/zh/gallery';
    if (['/', '/en', '/ja', '/ko', '/es'].includes(pathname)) return '/zh';
    return pathname;
  }

  if (slug) return `/tools/${slug}`;
  if (pathname === '/zh/tools' || pathname === '/zh/tools/') return '/tools';
  if (pathname === '/zh/gallery') return '/gallery';
  if (['/zh', '/en', '/ja', '/ko', '/es', '/'].includes(pathname)) {
    return locale === 'en' ? '/' : `/${locale}`;
  }
  return pathname;
}
