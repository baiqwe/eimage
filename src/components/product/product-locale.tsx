import { useEffect, useState } from 'react';
import { IconLanguage } from '@tabler/icons-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const PRODUCT_LOCALES = ['zh', 'en', 'ja', 'ko', 'es'] as const;
export type ProductLocale = (typeof PRODUCT_LOCALES)[number];

export const PRODUCT_LOCALE_KEY = 'suite-workbench-locale';
export const PRODUCT_LOCALE_EVENT = 'suite-workbench-locale-change';

export const PRODUCT_LOCALE_META: Record<
  ProductLocale,
  { label: string; shortLabel: string; htmlLang: string; dateLocale: string }
> = {
  zh: {
    label: '中文',
    shortLabel: '中',
    htmlLang: 'zh-CN',
    dateLocale: 'zh-CN',
  },
  en: {
    label: 'English',
    shortLabel: 'EN',
    htmlLang: 'en',
    dateLocale: 'en',
  },
  ja: {
    label: '日本語',
    shortLabel: '日',
    htmlLang: 'ja',
    dateLocale: 'ja-JP',
  },
  ko: {
    label: '한국어',
    shortLabel: '한',
    htmlLang: 'ko',
    dateLocale: 'ko-KR',
  },
  es: {
    label: 'Español',
    shortLabel: 'ES',
    htmlLang: 'es',
    dateLocale: 'es-ES',
  },
};

export function normalizeProductLocale(value?: string | null): ProductLocale {
  if (value && PRODUCT_LOCALES.includes(value as ProductLocale)) {
    return value as ProductLocale;
  }
  const language =
    typeof window === 'undefined'
      ? ''
      : window.navigator.language.toLowerCase();
  if (language.startsWith('zh')) return 'zh';
  if (language.startsWith('ja')) return 'ja';
  if (language.startsWith('ko')) return 'ko';
  if (language.startsWith('es')) return 'es';
  return 'en';
}

export function getProductLocaleFromPathname(pathname?: string | null) {
  if (!pathname) return undefined;
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return PRODUCT_LOCALES.includes(firstSegment as ProductLocale)
    ? (firstSegment as ProductLocale)
    : undefined;
}

export function getStoredProductLocale() {
  if (typeof window === 'undefined') return undefined;
  return normalizeProductLocale(
    window.localStorage.getItem(PRODUCT_LOCALE_KEY)
  );
}

export function getInitialProductLocale(initialLocale?: ProductLocale) {
  if (initialLocale) return initialLocale;
  if (typeof window === 'undefined') return 'zh';
  return (
    getProductLocaleFromPathname(window.location.pathname) ??
    getStoredProductLocale() ??
    'zh'
  );
}

export function setGlobalProductLocale(next: ProductLocale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PRODUCT_LOCALE_KEY, next);
  document.documentElement.lang = PRODUCT_LOCALE_META[next].htmlLang;
  window.dispatchEvent(
    new CustomEvent(PRODUCT_LOCALE_EVENT, { detail: { locale: next } })
  );
}

export function useProductLocale(initialLocale?: ProductLocale) {
  const [locale, setLocaleState] = useState<ProductLocale>(() =>
    getInitialProductLocale(initialLocale)
  );

  useEffect(() => {
    const next = getInitialProductLocale(initialLocale);
    setLocaleState(next);
    setGlobalProductLocale(next);

    function onLocaleChange(event: Event) {
      const customEvent = event as CustomEvent<{ locale?: ProductLocale }>;
      setLocaleState(normalizeProductLocale(customEvent.detail?.locale));
    }

    function onStorage(event: StorageEvent) {
      if (event.key === PRODUCT_LOCALE_KEY) {
        setLocaleState(normalizeProductLocale(event.newValue));
      }
    }

    window.addEventListener(PRODUCT_LOCALE_EVENT, onLocaleChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(PRODUCT_LOCALE_EVENT, onLocaleChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [initialLocale]);

  function setLocale(next: ProductLocale) {
    setLocaleState(next);
    setGlobalProductLocale(next);
  }

  return { locale, setLocale };
}

export function getLocalizedPublicPath(
  pathname: string,
  locale: ProductLocale
) {
  const cleanPathname = pathname === '' ? '/' : pathname;
  const normalized =
    cleanPathname.length > 1 ? cleanPathname.replace(/\/$/, '') : cleanPathname;
  const segments = normalized.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const hasLocalePrefix = PRODUCT_LOCALES.includes(
    firstSegment as ProductLocale
  );
  const pathWithoutLocale = hasLocalePrefix
    ? `/${segments.slice(1).join('/')}` || '/'
    : normalized;

  if (pathWithoutLocale === '/') {
    return locale === 'en' ? '/' : `/${locale}`;
  }

  const supportsAllLocales =
    pathWithoutLocale === '/generator' ||
    pathWithoutLocale === '/batch-generator' ||
    pathWithoutLocale === '/white-background-generator';
  const supportsZhOnly =
    pathWithoutLocale === '/gallery' ||
    pathWithoutLocale === '/tools' ||
    /^\/tools\/[^/]+$/.test(pathWithoutLocale);

  if (supportsAllLocales) {
    return locale === 'en'
      ? pathWithoutLocale
      : `/${locale}${pathWithoutLocale}`;
  }

  if (supportsZhOnly) {
    return locale === 'zh' ? `/zh${pathWithoutLocale}` : pathWithoutLocale;
  }

  return normalized;
}

export function getProductHomePath(locale: ProductLocale) {
  return locale === 'en' ? '/' : `/${locale}`;
}

export function getProductGeneratorPath(locale: ProductLocale) {
  return locale === 'en' ? '/generator' : `/${locale}/generator`;
}

export function getProductBatchGeneratorPath(locale: ProductLocale) {
  return locale === 'en' ? '/batch-generator' : `/${locale}/batch-generator`;
}

export function getWhiteBackgroundGeneratorPath(locale: ProductLocale) {
  return locale === 'en'
    ? '/white-background-generator'
    : `/${locale}/white-background-generator`;
}

export function ProductLanguageSelect({
  locale,
  onLocaleChange,
  compact = false,
}: {
  locale: ProductLocale;
  onLocaleChange: (locale: ProductLocale) => void;
  compact?: boolean;
}) {
  return (
    <Select
      value={locale}
      onValueChange={(value) => onLocaleChange(value as ProductLocale)}
    >
      <SelectTrigger
        className={compact ? 'w-24 bg-background' : 'w-36 bg-background'}
      >
        <IconLanguage className="size-4" />
        <SelectValue>{PRODUCT_LOCALE_META[locale].label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PRODUCT_LOCALES.map((item) => (
          <SelectItem key={item} value={item}>
            {PRODUCT_LOCALE_META[item].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
