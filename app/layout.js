import "./globals.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export const metadata = {
  title: "Art Gallery",
  description: "Art gallery website frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pageContent">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
