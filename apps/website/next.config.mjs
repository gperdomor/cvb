//@ts-check

import { composePlugins, withNx } from '@nx/next';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withMDX,
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
