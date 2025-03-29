import { baseUrl, createMetadata } from '@/lib/metadata';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Link from 'fumadocs-core/link';
import { Banner } from 'fumadocs-ui/components/banner';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = createMetadata({
  title: {
    template: '%s | Class Variance Builder',
    default: 'Class Variance Builder',
  },
  description:
    'Universal, lightweight and performant styling solution with a focus on component architecture for the modern web',
  metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <Banner variant="normal" height="2.5rem" className="gap-2">
            🎉 cvb@1.0.0-beta.4 is released.
            <Link className="text-blue-500" href="https://github.com/gperdomor/cvb/releases/tag/v1.0.0-beta.4">
              Read more
            </Link>
          </Banner>
          {children}
        </RootProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
