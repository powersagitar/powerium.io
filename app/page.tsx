import { ResetNotionHeadings } from '@/components/contexts/notion-headings';
import PublishedBlogs from '@/components/notion/PublishedBlogs';
import { H1, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <>
      <ResetNotionHeadings />

      <H1>{siteConfig.metadata.title}</H1>
      <P>{siteConfig.metadata.description}</P>

      <PublishedBlogs />
    </>
  );
}
