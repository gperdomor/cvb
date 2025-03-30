import type { Metadata } from 'next/types';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://class-variance-builder.vercel.app',
      siteName: 'Class Variance Builder',
      type: 'website',
      images: [
        { url: 'https://class-variance-builder.vercel.app/banner.png', width: 1200, height: 630 },
        {
          url: 'https://class-variance-builder.vercel.app/banner-alt.png',
          width: 1200,
          height: 630,
          alt: 'Alternative banner',
        },
        {
          url: 'https://class-variance-builder.vercel.app/banner-logo.png',
          width: 1200,
          height: 630,
          alt: 'Banner menu',
        },
      ],
      ...override.openGraph,
    },
    // twitter: {
    //   card: 'summary_large_image',
    //   creator: '@money_is_shark',
    //   title: override.title ?? undefined,
    //   description: override.description ?? undefined,
    //   images: '/banner.png',
    //   ...override.twitter,
    // },
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development' || !process.env.VERCEL_URL
    ? new URL('http://localhost:3000')
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
