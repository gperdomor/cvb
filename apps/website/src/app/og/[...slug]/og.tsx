import type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types';
import { ImageResponse } from 'next/og';
import type { ReactElement, ReactNode } from 'react';
import Logo from '../../icon.svg';

interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  primaryColor?: string;
  primaryTextColor?: string;
}

export function generateOGImage(options: GenerateProps & ImageResponseOptions): ImageResponse {
  const { title, description, primaryColor, primaryTextColor, ...rest } = options;

  return new ImageResponse(
    generate({
      title,
      description,
      primaryTextColor,
      primaryColor,
    }),
    {
      width: 1200,
      height: 630,
      ...rest,
    }
  );
}

export function generate({
  primaryColor = 'rgba(255,50,255,0.7)',
  primaryTextColor = 'rgb(240,240,240)',
  ...props
}: GenerateProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: '#0c0c0c',
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {props.title}
        </p>
        <p
          style={{
            fontSize: '48px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {props.description}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginTop: 'auto',
            color: primaryTextColor,
          }}
        >
          <Logo width="60" height="60" />
          <p
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            Class Variance Builder
          </p>
        </div>
      </div>
    </div>
  );
}
