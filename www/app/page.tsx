import { ResetNotionHeadings } from '@/components/contexts/notion-headings';
import { NotionPublishedBlogs } from '@/components/notion';
import { SearchOnHomePage } from '@/components/search';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { H1, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';

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

        <SearchOnHomePage />
      </div>

      <NotionPublishedBlogs />
    </>
  );
}
