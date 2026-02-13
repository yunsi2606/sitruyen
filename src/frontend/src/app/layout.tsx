import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "@/styles/animations.css";

export const metadata = {
  title: 'SiTruyen - Read Free Manga Online',
  description: 'Read manga online for free in high quality. Updated daily with new chapters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {/* Main Layout Container - Fluid to allow full-width heroes/bands */}
          <main className="flex-1 w-full fade-in-up">
            {children}
          </main>
          {/* Footer removed here, managed by page or added back later as global component */}
        </ThemeProvider>
      </body>
    </html>
  );
}
