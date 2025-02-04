import { Fragment } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function BlogArticleSkeleton() {
  return (
    <>
      {/* page header */}
      <Skeleton className="mx-auto mb-4 h-14 w-full" />
      <Skeleton className="mx-auto mb-4 h-6 w-3/4" />
      <Skeleton className="mx-auto mb-4 h-6 w-1/2" />

      {/* separator */}
      <Skeleton className="my-6 h-1 w-full" />

      {/* page content */}
      {Array.from({ length: 2 }).map((_, i) => (
        <Fragment key={`skeleton-page-content-${i}`}>
          {/* level 1 heading */}
          <Skeleton className="mt-12 mb-2 h-12 w-3/4 self-start" />

          {/* paragraph */}
          {['w-3/4', 'w-1/2', 'w-full', 'w-1/2', 'w-3/4', 'w-1/4', 'w-1/6'].map(
            (width, j) => (
              <Skeleton
                key={`skeleton-page-content-${i}-paragraph-${j}`}
                className={'mt-6 h-6 self-start ' + width}
              />
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
