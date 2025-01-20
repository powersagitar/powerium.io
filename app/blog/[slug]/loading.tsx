import { Fragment } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function BlogArticleLoading() {
  return (
    <>
      {/* page header */}
      <Skeleton className="h-14 w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-4" />

      {/* separator */}
      <Skeleton className="h-1 w-full my-6" />

      {/* page content */}
      {Array.from({ length: 2 }).map((_, i) => (
        <Fragment key={`skeleton-page-content-${i}`}>
          {/* level 1 heading */}
          <Skeleton className="h-12 w-3/4 mt-12 mb-2 self-start" />

          {/* paragraph */}
          {['w-3/4', 'w-1/2', 'w-full', 'w-1/2', 'w-3/4', 'w-1/4', 'w-1/6'].map(
            (width, j) => (
              <Skeleton
                key={`skeleton-page-content-${i}-paragraph-${j}`}
                className={'h-6 mt-6 self-start ' + width}
              />
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
