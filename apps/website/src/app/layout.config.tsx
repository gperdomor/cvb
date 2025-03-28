import { SiGithub } from '@icons-pack/react-simple-icons';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import Logo from './icon.svg?url';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image alt="cvb-logo" src={Logo} width={20} height={20} />
        Class Variance Builder
      </>
    ),
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      type: 'icon',
      label: 'GitHub', // `aria-label`
      icon: <SiGithub />,
      text: 'GitHub',
      url: 'https://github.com/gperdomor/cvb',
      secondary: true,
    },
  ],
};
