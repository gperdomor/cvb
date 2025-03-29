import { metadataImage } from '@/lib/metadata-image';
import { type ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateOGImage } from './og';

const regularFont = readFileSync(join(process.cwd(), 'src/app/og/[...slug]/HubotSansCondensed-Regular.otf'));
const boldFont = readFileSync(join(process.cwd(), 'src/app/og/[...slug]/HubotSansCondensed-Bold.otf'));

export const GET = metadataImage.createAPI((page): ImageResponse => {
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
});

export function generateStaticParams() {
  return metadataImage.generateParams();
}
