import { Page } from '@/lib/source';
import { remarkInstall } from 'fumadocs-docgen';
import { remarkInclude } from 'fumadocs-mdx/config';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

const processor = remark()
  .use(remarkMdx)
  // needed for Fumadocs MDX
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkInstall, { persist: { id: 'package-manager' } });

export async function getLLMText(page: Page) {
  const processed = await processor.process({
    path: page.data._file.absolutePath,
    value: page.data.content,
  });

  return `# ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/gperdomor/cvb/refs/heads/main/apps/website/content/docs/${page.file.path}

${page.data.description}

${processed.value}`;
}
