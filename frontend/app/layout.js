import "./globals.css";
import { Noto_Sans, Noto_Serif } from "next/font/google";

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

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoSerif.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
