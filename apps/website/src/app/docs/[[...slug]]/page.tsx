import { createMetadata } from '@/lib/metadata';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const { body: MDXContent, toc, lastModified } = page.data;

  return (
    <DocsPage toc={toc} full={page.data.full} lastUpdate={lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const description =
    page.data.description ??
    'Universal, lightweight and performant styling solution with a focus on component architecture for the modern web';

  const image = {
    url: ['/og', ...slug, 'image.png'].join('/'),
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: [image],
      type: 'article',
      modifiedTime: page.data?.lastModified?.toString(),
    },
    twitter: {
      images: [image],
    },
  });
}
