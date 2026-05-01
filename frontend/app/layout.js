import "./globals.css";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

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
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSerif.variable}`}>
        <Header />
        <main className="pageContent">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
