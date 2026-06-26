import {
  getInitialProductLocale,
  type ProductLocale,
} from '@/components/product/product-locale';
import { messages as enMessages } from './en';
import { messages as zhMessages } from './zh';

export type Messages = Record<string, any>;

const MESSAGE_MAP: Record<ProductLocale, Messages> = {
  zh: zhMessages,
  en: enMessages,
  ja: enMessages,
  ko: enMessages,
  es: enMessages,
};

export function getMessages(locale: ProductLocale = 'en'): Messages {
  return MESSAGE_MAP[locale] ?? enMessages;
}

function getActiveMessages() {
  if (typeof window === 'undefined') {
    return enMessages;
  }
  return getMessages(getInitialProductLocale());
}

function createMessageProxy(path: string[] = []): unknown {
  return new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property === 'symbol') return undefined;
        const value = path.reduce<unknown>(
          (current, key) =>
            current && typeof current === 'object'
              ? (current as Record<string, unknown>)[key]
              : undefined,
          getActiveMessages()
        );
        const nextValue =
          value && typeof value === 'object'
            ? (value as Record<string, unknown>)[property]
            : undefined;
        if (typeof nextValue === 'function') {
          return nextValue.bind(value);
        }
        if (nextValue && typeof nextValue === 'object') {
          return createMessageProxy([...path, property]);
        }
        return nextValue;
      },
    }
  );
}

export const messages = createMessageProxy() as Messages;
