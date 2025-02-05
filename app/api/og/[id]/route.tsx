import 'server-only';

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notionConfig } from '@/config/notion';
import { siteConfig } from '@/config/site';
import { retrieveNotionPage } from '@/lib/notion/server';
import { NotionBlogPageProperties } from '@/lib/notion/types';

export const revalidate = 14400;

export async function generateStaticParams() {
  return [
    { id: notionConfig.auxiliaryPages.about?.id },
    { id: notionConfig.auxiliaryPages.contact?.id },
  ];
}

export async function GET(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];

  let page;

  try {
    page = (await retrieveNotionPage(id)) as PageObjectResponse;
  } catch (_) {
    return new Response(undefined, { status: 404 });
  }

  const properties = page.properties as NotionBlogPageProperties;

  const title = properties.title.title
    .map((richtext) => richtext.plain_text)
    .join('');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          borderRadius: '10px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
          width: '100%',
          height: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '64',
            margin: 'auto',
          }}
        >
          {title.substring(0, siteConfig.metadata.openGraph.titleLength)}
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
