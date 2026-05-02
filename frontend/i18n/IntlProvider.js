"use client";

import { IntlContext } from "./IntlContext";

export default function IntlProvider({ locale, messages, children }) {
  return (
    <IntlContext.Provider value={{ locale, messages }}>
      {children}
    </IntlContext.Provider>
  );
}
