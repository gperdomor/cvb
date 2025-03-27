import { remarkInstall } from 'fumadocs-docgen';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [
        remarkInstall,
        {
          persist: {
            id: 'package-install',
          },
        },
      ],
    ],
    // MDX options
  },
});
