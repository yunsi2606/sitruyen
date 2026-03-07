import { Header } from "@/components/Header";
import { RuntimeConfig } from "@/components/RuntimeConfig";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Script from "next/script";
import "./globals.css";
import "@/styles/animations.css";

export const metadata = {
  title: 'SiTruyen - Read Free Manga Online',
  description: 'Read manga online for free in high quality. Updated daily with new chapters.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        <RuntimeConfig />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LWNE0EXJNZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());

            window.gtag('config', 'G-LWNE0EXJNZ', {
              debug_mode: true
            });
          `}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen bg-background font-sans text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {/* Main Layout Container - Fluid to allow full-width heroes/bands */}
          <main className="flex-1 w-full">
            {children}
          </main>
          {/* Footer removed here, managed by page or added back later as global component */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
