import { docs } from '@/.source';
import { InferMetaType, InferPageType, loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (icon && icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
    return undefined;
  },
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
