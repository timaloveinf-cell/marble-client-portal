import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Marble — поиск договора",
  description: "Минималистичный поиск договора для компании по укладке мрамора."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}

