import { ImageResponse } from 'next/og';

import siteConfig from '~/site.config';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#171717',
        borderRadius: 6,
        fontFamily: 'monospace',
        fontSize: 16,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '-0.04em',
      }}
    >
      {siteConfig.name[0]}
    </div>,
    { ...size },
  );
}
