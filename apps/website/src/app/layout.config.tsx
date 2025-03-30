import { SiGithub } from '@icons-pack/react-simple-icons';
import { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Book, CircleHelp, Combine, Heart, Shapes, SquareStack } from 'lucide-react';
import Image from 'next/image';
import Banner from '../../public/banner-logo.png';
import Logo from './icon.svg?url';

export const linkItems: LinkItemType[] = [
  {
    text: 'Sponsors',
    url: 'https://github.com/sponsors/gperdomor',
    icon: <Heart />,
  },
  {
    type: 'icon',
    url: 'https://github.com/gperdomor/cvb',
    text: 'GitHub',
    label: 'GitHub', // `aria-label`
    icon: <SiGithub />,
    external: true,
  },
];

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image alt="Class Variance Builder" aria-label="Fumadocs" src={Logo} width={20} height={20} />
        <span className="font-medium">Class Variance Builder</span>
      </>
    ),
  },
  links: [
    {
      type: 'menu',
      text: 'Documentation',
      url: '/docs',
      items: [
        {
          menu: {
            banner: (
              <div className="-mx-3 -mt-3">
                <Image src={Banner} alt="Banner" className="rounded-t-lg object-cover" />
              </div>
            ),
            className: 'md:row-span-2',
          },
          icon: <Book />,
          text: 'Getting Started',
          description: 'Learn to use Class Variance Builder on your components.',
          url: '/docs',
        },
        {
          icon: <Shapes />,
          text: 'Variants',
          description: 'Create multi-variant styles with a type-safe runtime API.',
          url: '/docs/variants',
          menu: {
            className: 'lg:col-start-2',
          },
        },
        {
          icon: <SquareStack />,
          text: 'Slots',
          description: 'Apply style variations to multiple parts of a component.',
          url: '/docs/slots',
          menu: {
            className: 'lg:col-start-2',
          },
        },
        {
          icon: <Combine />,
          text: 'Composing Recipes',
          description: 'Merge your recipes to create new ones.',
          url: '/docs/composing-recipes',
          menu: {
            className: 'lg:col-start-3 lg:row-start-1',
          },
        },
        {
          icon: <CircleHelp />,
          text: 'Frequently Asked Questions',
          description: 'Answers to common questions from the community.',
          url: '/docs/faq',
          menu: {
            className: 'lg:col-start-3',
          },
        },
      ],
    },
    ...linkItems,
  ],
};
