import { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { H1 } from '@/components/ui/typography';

export default function PublishedBlogLoading() {
  return (
    <>
      <H1 className="mb-6">Blog Archive</H1>

      <div className="my-4 grid gap-4 md:grid-cols-[8em_4fr_6fr]">
        {Array.from({ length: 10 }).map((_, index) => (
          <Fragment key={`blog-entry-skeleton-${index}`}>
            <Skeleton className="h-6 w-1/3 md:w-full" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />

            <Separator className="md:hidden" />
          </Fragment>
        ))}
      </div>

      <Skeleton className="mt-6 h-9" />
    </>
  );
}
