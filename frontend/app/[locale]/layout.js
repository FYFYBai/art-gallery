import "../globals.css";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import IntlProvider from "../../i18n/IntlProvider";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Art Gallery",
  description: "Art gallery website frontend",
  icons: { icon: "/favicon.png" },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className={`${notoSans.variable} ${notoSerif.variable}`}>
        <IntlProvider locale={locale} messages={messages}>
          <Header />
          <main className="pageContent">{children}</main>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
