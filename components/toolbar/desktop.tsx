'use client';

import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export default function Desktop() {
  const pathname = usePathname().split('/');

  if (isHomePage(pathname)) {
    return null;
  }

  // first element is always an empty string
  const base = pathname.slice(1, pathname.length - 1);
  const current = pathname[pathname.length - 1];

  return (
    <Breadcrumb className="mt-6 hidden w-full px-3 sm:block lg:w-2/3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {base.map((slug, idx) => (
          <Fragment key={`breadcrumb-${pathname}-${idx}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={'/' + base.slice(0, idx + 1).join('/')}>
                {slug}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function isHomePage(pathname: string[]) {
  return pathname.length === 2 && pathname[0] === '' && pathname[1] === '';
}
