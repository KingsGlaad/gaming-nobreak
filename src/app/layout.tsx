import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { NextAuthSessionProvider } from "@/components/providers/session-provider";

import { ProgressBarProvider } from "@/components/providers/progressbar-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gaming Nobreak",
  description: "Plataforma de gamificação e engajamento para jovens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ProgressBarProvider>
              <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
              <Toaster richColors />
            </ProgressBarProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
