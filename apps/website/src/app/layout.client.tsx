'use client';

import { cx } from '@/lib/cvb.config';
import { useParams } from 'next/navigation';
import { type ReactNode, useId } from 'react';

export function useMode(): string | undefined {
  const { slug } = useParams();
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const mode = useMode();

  return <body className={cx(mode, 'relative flex flex-col min-h-screen')}>{children}</body>;
}

export function CVBIcon(props: React.SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
      viewBox="0 0 1000 1000"
      {...props}
    >
      <style />
      <g transform="translate(-1201 -2400)">
        <g id="CVB">
          <path
            d="M0 2459.77h1000v955.743H0z"
            style={{
              fill: 'none',
            }}
            transform="matrix(1 0 0 1.04631 1201 -173.675)"
          />
          <g
            style={{
              fill: '#000',
            }}
          >
            <path
              d="M0 29.118c-7.085 8.291-15.425 20.895-34.195 20.895-17.39 0-35.123-12.97-35.506-36.759 1.745-22.115 18.638-34.203 35.455-34.203 20.285 0 28.409 14.182 35.266 23.306L16.649-8.668c6.29 6.138 15.387 7.531 22.861 4.374 6.05-2.555 10.519-7.609 12.261-13.866 1.477-5.306.846-10.859-1.705-15.628l14.708-12.021C39.54-79.352 10.18-100.79-34.296-100.79c-66.101 0-116.291 55.497-115.295 115.234-1.537 57.605 47.72 115.457 115.31 115.464h.004c45.482 0 74.1-22.407 99.416-55.362L0 29.118Z"
              style={{
                fill: 'var(--color-logo-shape-background)',
                fillRule: 'nonzero',
              }}
              transform="matrix(4.16667 0 0 4.16668 1877.015 2839.342)"
            />
          </g>
          <path
            d="m-.807-.168.076.005a.07.07 0 0 0 .068.091c.005 0 .011 0 .016-.002a.072.072 0 0 0 .053-.051.077.077 0 0 0-.001-.037l.078-.001a.245.245 0 0 0 .164.212l-.032.104c-.002.003.002.007.006.005A.047.047 0 0 1-.332.16.046.046 0 0 1-.31.204a.048.048 0 0 1-.062.042.048.048 0 0 1-.029-.025C-.402.218-.407.218-.408.222l-.04.1a.533.533 0 0 1-.359-.49Z"
            style={{
              fill: `url(#${id}_Radial1)`,
              fillRule: 'nonzero',
            }}
            transform="matrix(809.512 0 0 -809.51435 1956.345 2752.802)"
          />
          <path
            d="m-.425.168.027-.07A.071.071 0 0 0-.287.045a.07.07 0 0 0-.032-.066.09.09 0 0 0-.035-.011l.023-.074a.241.241 0 0 0 .251-.09l.09.063c.003.002.007-.001.006-.004a.05.05 0 0 1 .017-.045.048.048 0 0 1 .049-.008.049.049 0 0 1 .02.073.047.047 0 0 1-.032.019C.066-.097.065-.093.068-.09l.084.068a.536.536 0 0 1-.577.19Z"
            style={{
              fill: `url(#${id}_Radial2)`,
              fillRule: 'nonzero',
            }}
            transform="matrix(809.511 0 0 -809.5133 1956.344 2622.452)"
          />
          <path
            d="M-.345.838-.38.734C-.382.731-.387.73-.388.734a.05.05 0 0 1-.04.026.048.048 0 0 1-.018-.093.043.043 0 0 1 .037.003c.004.002.007-.001.006-.005L-.43.561a.534.534 0 0 1 .579.185L.085.787A.05.05 0 0 0 .076.769.072.072 0 0 0-.036.764a.072.072 0 0 0-.012.073.077.077 0 0 0 .022.029l-.063.046A.242.242 0 0 0-.345.838Z"
            style={{
              fill: `url(#${id}_Radial3)`,
              fillRule: 'nonzero',
            }}
            transform="matrix(809.511 0 0 -809.5133 1956.344 3766.456)"
          />
          <path
            d="M-.711.79c0-.013.005-.025.015-.034.002-.003 0-.007-.003-.007L-.807.742A.535.535 0 0 1-.452.249l.019.073a.142.142 0 0 0-.02.004.071.071 0 1 0 .061.127l.025.074a.242.242 0 0 0-.15.221l-.11.001c-.003 0-.005.005-.003.007a.047.047 0 0 1 .013.047.048.048 0 0 1-.035.034l-.011.001A.047.047 0 0 1-.711.79Z"
            style={{
              fill: `url(#${id}_Radial4)`,
              fillRule: 'nonzero',
            }}
            transform="matrix(809.509 0 0 -809.51226 1956.343 3508.384)"
          />
        </g>
      </g>
      <defs>
        <radialGradient
          id={`${id}_Radial1`}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1 0 0 -1 0 .154)"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.24}
            style={{
              stopColor: '#ffc507',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.7}
            style={{
              stopColor: '#ff0071',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.99}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={1}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
        </radialGradient>
        <radialGradient
          id={`${id}_Radial2`}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1 0 0 -1 0 -.007)"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.24}
            style={{
              stopColor: '#ffc507',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.7}
            style={{
              stopColor: '#ff0071',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.99}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={1}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
        </radialGradient>
        <radialGradient
          id={`${id}_Radial3`}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1 0 0 -1 0 1.407)"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.24}
            style={{
              stopColor: '#ffc507',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.7}
            style={{
              stopColor: '#ff0071',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.99}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={1}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
        </radialGradient>
        <radialGradient
          id={`${id}_Radial4`}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(1 0 0 -1 0 1.088)"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0}
            style={{
              stopColor: '#fffbf8',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.24}
            style={{
              stopColor: '#ffc507',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.7}
            style={{
              stopColor: '#ff0071',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.99}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
          <stop
            offset={1}
            style={{
              stopColor: '#9635f0',
              stopOpacity: 1,
            }}
          />
        </radialGradient>
      </defs>
    </svg>
  );
}
