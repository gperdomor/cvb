import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    host: 'https://class-variance-builder.vercel.app',
    sitemap: 'https://class-variance-builder.vercel.app/sitemap.xml',
  };
}
