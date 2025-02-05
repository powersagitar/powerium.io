import 'server-only';

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/config/site';
import {
  retrieveAllPublishedArticles,
  retrieveNotionPage,
} from '@/lib/notion/server';
import { NotionBlogPageProperties } from '@/lib/notion/types';

export const revalidate = 14400;

export async function generateStaticParams() {
  const posts =
    (await retrieveAllPublishedArticles()) as DatabaseObjectResponse[];

  return posts.map((post) => ({ id: post.id }));
}

export async function GET(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];

  let blog;

  try {
    blog = (await retrieveNotionPage(id)) as PageObjectResponse;
  } catch (_) {
    return new Response(undefined, { status: 404 });
  }

  const properties = blog.properties as NotionBlogPageProperties;
  const title = properties.title.title
    .map((richtext) => richtext.plain_text)
    .join('');
  const description = properties.description.rich_text
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
            fontSize: '48',
            borderBottom: 'solid',
          }}
        >
          {title.substring(0, siteConfig.metadata.openGraph.titleLength)}
        </h1>
        <p style={{ fontSize: '32' }}>
          {description.substring(
            0,
            siteConfig.metadata.openGraph.descriptionLength,
          )}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
