import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import IntlProvider from "../../i18n/IntlProvider";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageViewTracker from "../../components/analytics/PageViewTracker";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <IntlProvider locale={locale} messages={messages}>
      <PageViewTracker />
      <Header />
      <main className="pageContent">{children}</main>
      <Footer />
    </IntlProvider>
  );
}
