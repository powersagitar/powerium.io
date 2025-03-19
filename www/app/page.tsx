import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPublishedBlog } from '@/components/notion/page';
import { SearchDesktop } from '@/components/search';
import { ResetNotionHeadings } from '@/components/table-of-contents/notion-headings';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { H1, H2, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';
import { retrievePublishedArticles } from '@/lib/notion/queries';

export default function Home() {
  return (
    <>
      <ResetNotionHeadings />

      <H1>{siteConfig.metadata.title}</H1>
      <P>{siteConfig.metadata.description}</P>

      <div className="mt-4 mb-2 grid gap-2 sm:grid-cols-[1fr_1fr_2fr] sm:gap-4">
        <Button variant="outline" asChild>
          <Link href="/about" className="no-underline">
            About
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/contact" className="no-underline">
            Contact
          </Link>
        </Button>

        <SearchDesktop />
      </div>

      <PublishedBlog />
    </>
  );
}

async function PublishedBlog() {
  const publishedArticles = (await retrievePublishedArticles(undefined, 5))
    .results as DatabaseObjectResponse[];

  return (
    <>
      <H2>Blog</H2>

      <NotionPublishedBlog publishedArticles={publishedArticles} />

      <Button asChild>
        <Link href="/blog" className="mt-2 no-underline">
          Load More
        </Link>
      </Button>
    </>
  );
}
