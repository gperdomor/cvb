import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';
import { MDXComponents } from 'nextra/mdx-components';

const themeComponents = getThemeComponents();

export const useMDXComponents = (components: MDXComponents) => ({
  ...themeComponents,
  ...components,
});
