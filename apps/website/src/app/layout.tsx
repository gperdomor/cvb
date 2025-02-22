import { cx } from 'cvb';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer, Layout, Link, Navbar } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';

import { CVBLogo } from '@/components/icons';
import 'nextra-theme-docs/style.css';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  description: 'Universal, fast and scalable styling solution for the modern web.',
  metadataBase: new URL('https://class-variance-builder.vercel.app/'),
  keywords: [
    'Class Varince Builder',
    'class-variance-builder',
    'Slot Varince Builder',
    'slot-variance-builder',
    'cvb',
    'svb',
    'classes',
    'classname',
    'classnames',
    'css',
    'cva',
    'stitches',
    'vanilla-extract',
    'variants',
    'tailwind-variants',
    'panda',
    'pandacss',
  ],
  applicationName: 'CVB Docs',
  appleWebApp: {
    title: 'CVB Docs',
  },
  title: {
    template: '%s - Docs',
    default: 'Class Variance Builder',
  },
  openGraph: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    url: './',
    siteName: 'CVB',
    locale: 'en_US',
    type: 'website',
  },
};

function GitHubIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  );
}

const banner = (
  <Banner dismissible={false} storageKey="1.0-release">
    {/* <a href="https://github.com/gperdomor/cvb/releases/tag/v1.0.0-beta.4" target="_blank">
      🎉 cvb@1.0.0-beta.4 is released. Read more →
    </a> */}
    🎉 cvb@1.0.0-beta.4 is released.{' '}
    <Link href="https://github.com/gperdomor/cvb/releases/tag/v1.0.0-beta.4">Read more</Link>.
  </Banner>
);

const navbar = (
  <Navbar
    logo={
      <CVBLogo
        height="20"
        className={cx(
          'hover:transition-all hover:duration-1000 motion-reduce:hover:transition-none',
          '[mask-image:linear-gradient(60deg,#000_25%,rgba(0,0,0,.2)_50%,#000_75%)] [mask-position:0] [mask-size:400%]',
          'hover:[mask-position:100%]'
        )}
      />
    }
    projectLink="https://github.com/gperdomor/cvb"
    projectIcon={
      <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
    }
  />
);

const footer = (
  <Footer className="py-5">
    <p className="text-xs">© {new Date().getFullYear()} Gustavo Perdomo.</p>
  </Footer>
);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" className={cx('h-full antialiased', inter.variable)} suppressHydrationWarning>
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/gperdomor/cvb/tree/main/apps/website"
          // editLink="Edit this page on GitHub"
          // sidebar={{ defaultMenuCollapseLevel: 1 }}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
