import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { CookieBanner } from "@/components/gdpr/cookie-banner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "LAMID Learning",
    template: "%s | LAMID Learning",
  },
  description: "AI-powered multi-tenant learning experience platform by LAMID.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('lamid-theme');document.documentElement.classList.add(t==='light'?'light':'dark')})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen bg-background text-text-primary antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <CookieBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
