import { Suspense } from 'react';

import TOCDesktop from '@/components/table-of-contents/desktop';
import { getNotionHeadings } from '@/lib/notion/page';

type NotionPageProps = {
  children: Readonly<React.ReactNode>;
  id: string;
};

export default function NotionPage({
  children: headerAndContent,
  id,
}: NotionPageProps) {
  return (
    <article className="w-full whitespace-pre-wrap">
      {headerAndContent}
      <Suspense>
        <TOCDesktopSuspended id={id} />
      </Suspense>
    </article>
  );
}

type TOCDesktopSuspendedProps = {
  id: string;
};

async function TOCDesktopSuspended({ id }: TOCDesktopSuspendedProps) {
  const headings = await getNotionHeadings(id);
  return <TOCDesktop headings={headings} />;
}
