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
  const publishDateUTCString =
    properties.published.date.start + 'T00:00:00.000Z';
  const publishDateUTC = new Date(publishDateUTCString);
  const lastEditedDate = new Date(page.last_edited_time);

  return (
    <time dateTime={lastEditedDate.toISOString()}>
      {publishDateUTC.toDateString() === lastEditedDate.toDateString() ? (
        <strong className="whitespace-nowrap">
          {dateformat(publishDateUTC, 'mediumDate')}
        </strong>
      ) : (
        <>
          <span className="whitespace-nowrap">
            Published{' '}
            <strong>{dateformat(publishDateUTC, 'mediumDate')}</strong>
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
