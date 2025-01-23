import 'server-only';

import dateFormat from 'dateformat';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/config/site';
import { retrieveNotionPage } from '@/lib/notion/server';
import { NotionArticlePageProperties } from '@/lib/notion/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/');
  const id = segments[segments.length - 1];

  let blog;

  try {
    blog = (await retrieveNotionPage(id)) as PageObjectResponse;
  } catch (_) {
    return new Response(undefined, { status: 404 });
  }

  const properties = blog.properties as NotionArticlePageProperties;
  const title = properties.title.title;
  const authorsOverride = properties.authors.rich_text;
  const description = properties.description.rich_text;
  const publishDate = new Date(properties.published.date.start);
  const lastEditedDate = new Date(blog.last_edited_time);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          color: 'white',
          display: 'flex',
          padding: '20px',
          borderRadius: '10px',
          flexDirection: 'column',
        }}
      >
        <aside>
          <p style={{ marginRight: 'auto' }}>{siteConfig.metadata.title}</p>
          <p style={{ marginLeft: 'auto' }}>
            /blog/<span style={{ fontWeight: 'bold' }}>{id}</span>
          </p>
        </aside>
        <h1
          style={{
            fontSize: '28',
            borderBottom: 'solid',
            marginBottom: '0px',
          }}
        >
          {title.map((richtext) => richtext.plain_text).join('')}
        </h1>
        <p>
          <span style={{ marginRight: 'auto' }}>
            {authorsOverride.length > 0
              ? authorsOverride.map((richtext) => richtext.plain_text).join('')
              : siteConfig.metadata.author.name}
          </span>
          <span style={{ marginLeft: 'auto' }}>
            Published {dateFormat(publishDate, 'mediumDate', true)} &bull;
            Updated {dateFormat(lastEditedDate, 'mediumDate', true)}
          </span>
        </p>
        <p style={{ fontWeight: 'bold' }}>
          {description.map((richtext) => richtext.plain_text).join('')}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
