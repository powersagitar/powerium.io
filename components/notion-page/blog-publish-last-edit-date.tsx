'use client';

import dateformat from 'dateformat';

import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { NotionArticlePageProperties } from '@/lib/notion/types';

type BlogPublishLastEditDateProps = {
  page: DatabaseObjectResponse | PageObjectResponse;
};

export default function BlogPublishLastEditDate({
  page,
}: BlogPublishLastEditDateProps) {
  const properties = page.properties as unknown as NotionArticlePageProperties;
  const publishDateISOString =
    properties.published.date.start + 'T00:00:00.000Z';
  const publishDate = new Date(publishDateISOString);
  const lastEditedDate = new Date(page.last_edited_time);

  return (
    <time dateTime={lastEditedDate.toISOString()}>
      {publishDate >= lastEditedDate ? (
        <strong className="whitespace-nowrap">
          {dateformat(publishDate, 'mediumDate')}
        </strong>
      ) : (
        <>
          <span className="whitespace-nowrap">
            Published <strong>{dateformat(publishDate, 'mediumDate')}</strong>
          </span>{' '}
          &bull;{' '}
          <span className="whitespace-nowrap">
            Updated <strong>{dateformat(lastEditedDate, 'mediumDate')}</strong>
          </span>
        </>
      )}
    </time>
  );
}
