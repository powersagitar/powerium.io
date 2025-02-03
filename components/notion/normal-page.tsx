import dateFormat from 'dateformat';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { siteConfig } from '@/config/site';
import { NotionPageProperties } from '@/lib/notion/types';

import { Link } from '../ui/link';
import { Separator } from '../ui/separator';
import { H1, P } from '../ui/typography';
import NotionRichTextItems from './engine/rich-text';
import { NotionPage, NotionPageContent, NotionPageHeader } from './page';

type NotionPageNormalProps = {
  page: PageObjectResponse;
};

export default async function NotionPageNormal({
  page,
}: NotionPageNormalProps) {
  const properties = page.properties as NotionPageProperties;
  const lastEdited = new Date(page.last_edited_time);

  return (
    <NotionPage>
      <NotionPageHeader className="text-center [overflow-wrap:anywhere]">
        <H1 className="mb-4">
          <NotionRichTextItems
            baseKey={page.id}
            richText={properties.title.title}
          />
        </H1>
        <address className="not-italic">
          <P className="whitespace-nowrap">
            <time dateTime={lastEdited.toISOString()}>
              <strong>{dateFormat(lastEdited, 'mediumDate')}</strong>
            </time>
          </P>
          <P className="not-first:mt-0">
            <Link href={siteConfig.metadata.author.url ?? '/'}>
              <strong>{siteConfig.metadata.author.name}</strong>
            </Link>
          </P>
        </address>

        <Separator className="my-6" />
      </NotionPageHeader>
      <NotionPageContent id={page.id} />
    </NotionPage>
  );
}
