import { generateOGImage } from '@/app/og/[...slug]/og';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const regularFont = readFileSync(join(process.cwd(), 'src/app/og/[...slug]/HubotSansCondensed-Regular.otf'));
const boldFont = readFileSync(join(process.cwd(), 'src/app/og/[...slug]/HubotSansCondensed-Bold.otf'));

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));

  if (!page) {
    notFound();
  }

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    fonts: [
      {
        name: 'Hubot',
        data: regularFont,
        weight: 400,
      },
      {
        name: 'Hubot',
        data: boldFont,
        weight: 600,
      },
    ],
  });
}

export function generateStaticParams(): { slug: string[] }[] {
  return source.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, 'image.png'],
  }));
}
