import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPublishedBlog } from '@/components/notion/page';
import { H1 } from '@/components/ui/typography';
import { retrieveAllPublishedArticles } from '@/lib/notion/queries';

export default async function PublishedBlog() {
  const publishedArticles =
    (await retrieveAllPublishedArticles()) as DatabaseObjectResponse[];

  return (
    <>
      <H1 className="mb-6">Blog Archive</H1>
      <NotionPublishedBlog publishedArticles={publishedArticles} />
    </>
  );
}
