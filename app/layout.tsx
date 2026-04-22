import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
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
  title: "DECORMARMI — кабинет клиента",
  description: "Клиентский портал для проектов по укладке мрамора."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh bg-carbon-950 font-sans text-zinc-200 antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

