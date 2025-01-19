'use client';

import dateformat from 'dateformat';
import { useEffect, useState } from 'react';

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

  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);
  const [lastEditedDate, setLastEditedDate] = useState<Date | undefined>(
    undefined,
  );

  useEffect(() => {
    setPublishDate(new Date(publishDateISOString));
    setLastEditedDate(new Date(page.last_edited_time));
  }, [publishDateISOString, page.last_edited_time]);

  if (!publishDate || !lastEditedDate) {
    return (
      <span className="animate-pulse">
        {dateformat(new Date(0), 'mediumDate')}
      </span>
    );
  }

  if (publishDate >= lastEditedDate) {
    return (
      <time dateTime={publishDate.toISOString()}>
        <strong className="whitespace-nowrap">
          {dateformat(publishDate, 'mediumDate')}
        </strong>
      </time>
    );
  }

  return (
    <>
      <span className="whitespace-nowrap">
        Published{' '}
        <time dateTime={publishDate.toISOString()}>
          <strong>{dateformat(publishDate, 'mediumDate')}</strong>
        </time>
      </span>
      {' • '}
      <span className="whitespace-nowrap">
        Updated{' '}
        <time dateTime={lastEditedDate.toISOString()}>
          <strong>{dateformat(lastEditedDate, 'mediumDate')}</strong>
        </time>
      </span>
    </>
  );
}
