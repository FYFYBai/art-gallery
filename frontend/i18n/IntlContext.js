import { createContext, useContext } from "react";

export const IntlContext = createContext({ locale: "fr", messages: {} });

export function useLocale() {
  return useContext(IntlContext).locale;
}

/**
 * useTranslations(namespace?)
 * Returns a t(key) function. Key can be dot-notated: t("nav.artworks")
 * or scoped if namespace provided: useTranslations("nav") → t("artworks")
 */
export function useTranslations(namespace) {
  const { messages } = useContext(IntlContext);

  return function t(key) {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const parts = fullKey.split(".");
    let value = messages;

    for (const part of parts) {
      if (value == null) return fullKey;
      value = value[part];
    }

    return value ?? fullKey;
  };
}
