"use client";

import { Manrope } from "next/font/google";
import "./globals.css";
import "@/i18n";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import StoreProvider from "@/store/StoreProvider";

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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Book tables at the best restaurants in Kazakhstan"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={fontManrope.className}>
        <ServiceWorkerRegistration />
        <StoreProvider>
          <Header />
          <div className="pt-32 w-full max-sm:pt-14">{children}</div>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
