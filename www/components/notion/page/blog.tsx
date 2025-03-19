import dateFormat from 'dateformat';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/config/site';
import { NotionBlogPageProperties } from '@/lib/notion/types';

import { Link } from '../../ui/link';
import { Separator } from '../../ui/separator';
import { H1, P } from '../../ui/typography';
import NotionRichTextItems from '../engine/rich-text';
import { NotionPage, NotionPageContent, NotionPageHeader } from './primitives';

type NotionPageBlogProps = {
  page: PageObjectResponse;
};

export default function NotionPageBlog({ page }: NotionPageBlogProps) {
  const properties = page.properties as NotionBlogPageProperties;
  const authors = properties.authors;
  const published = new Date(
    properties.published.date.start + 'T00:00:00.000Z',
  );

  return (
    <NotionPage id={page.id}>
      <NotionPageHeader className="text-center [overflow-wrap:anywhere]">
        <H1 className="mb-4">
          <NotionRichTextItems
            baseKey={page.id}
            richText={properties.title.title}
          />
        </H1>

        <address className="not-italic">
          <P className="whitespace-nowrap">
            <time dateTime={published.toISOString()}>
              <strong>{dateFormat(published, 'mediumDate')}</strong>
            </time>
          </P>
          <P className="not-first:mt-0">
            {authors.rich_text.length > 0 ? (
              <NotionRichTextItems
                baseKey={page.id}
                richText={authors.rich_text}
              />
            ) : (
              <Link href={siteConfig.metadata.author.url ?? '/'}>
                <strong>{siteConfig.metadata.author.name}</strong>
              </Link>
            )}
          </P>
        </address>

        <Separator className="my-6" />
      </NotionPageHeader>
      <NotionPageContent id={page.id} />
    </NotionPage>
  );
}
