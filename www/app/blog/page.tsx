import { notFound } from 'next/navigation';

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPublishedBlog } from '@/components/notion/page';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { H1 } from '@/components/ui/typography';
import { retrievePublishedArticles } from '@/lib/notion/queries';

type PublishedBlobProps = {
  searchParams: Promise<{
    'start-cursor'?: string;
  }>;
};

export default async function PublishedBlog(props: PublishedBlobProps) {
  const searchParams = await props.searchParams;
  const startCursor = searchParams['start-cursor'] ?? undefined;

  // TODO: suspense
  const queryResponse = await retrievePublishedArticles(startCursor, 10).catch(
    () => notFound(),
  );

  const publishedArticles = queryResponse.results as DatabaseObjectResponse[];

  return (
    <>
      <H1 className="mb-6">Blog Archive</H1>

      <NotionPublishedBlog publishedArticles={publishedArticles} />

      {queryResponse.has_more && (
        <Button asChild className="mt-6">
          <Link
            href={`/blog?start-cursor=${queryResponse.next_cursor}`}
            className="no-underline"
          >
            Load More
          </Link>
        </Button>
      )}
    </>
  );
}
