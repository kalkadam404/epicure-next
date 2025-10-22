"use client";

import { Manrope } from "next/font/google";
import "./globals.css";
import "@/i18n";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const fontManrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={fontManrope.className}>
        <Header />
        <div className="pt-[105px] w-full">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
