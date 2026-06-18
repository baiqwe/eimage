import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ProductLocale = 'zh' | 'en';

export const PRODUCT_LOCALE_KEY = 'suite-workbench-locale';

export function useProductLocale() {
  const [locale, setLocaleState] = useState<ProductLocale>('zh');

  useEffect(() => {
    const stored = window.localStorage.getItem(PRODUCT_LOCALE_KEY);
    const next =
      stored === 'zh' || stored === 'en'
        ? stored
        : window.navigator.language.toLowerCase().startsWith('zh')
          ? 'zh'
          : 'en';
    setLocaleState(next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  }, []);

  function setLocale(next: ProductLocale) {
    setLocaleState(next);
    window.localStorage.setItem(PRODUCT_LOCALE_KEY, next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  }

  return { locale, setLocale };
}

export function ProductLanguageSelect({
  locale,
  onLocaleChange,
}: {
  locale: ProductLocale;
  onLocaleChange: (locale: ProductLocale) => void;
}) {
  return (
    <Select
      value={locale}
      onValueChange={(value) => onLocaleChange(value as ProductLocale)}
    >
      <SelectTrigger className="w-32 bg-background">
        <SelectValue>{locale === 'zh' ? '中文' : 'English'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">中文</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
