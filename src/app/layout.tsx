import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: {
    default: 'Dailylink Africa - Professional Bilingual Digital News & Media',
    template: '%s | Dailylink Africa',
  },
  description:
    'Dailylink Africa is an independent digital news and media platform providing verified reporting, business insights, geopolitical analysis, and multimedia coverage in Somali and English.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Dailylink Africa - Horn of Africa & Global News',
    description: 'Independent, verified journalism in Somali and English.',
    url: 'https://dailylink.africa',
    siteName: 'Dailylink Africa',
    locale: 'so_SO',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dailylink Africa',
    description: 'Independent news and media in Somali and English.',
    creator: '@dailylinkafrica',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-[#111111] dark:text-[#FFFFFF] antialiased selection:bg-[#0084FF] selection:text-white">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

