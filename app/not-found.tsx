import { Metadata } from 'next';

import { Link } from '@/components/ui/link';
import { H1, P } from '@/components/ui/typography';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  fetch(new URL('api/caching/revlidate-notion', siteConfig.url.origin), {
    method: 'POST',
  });

  return (
    <>
      <H1>Page Not Found</H1>
      <P>
        The requested page is not found on the server. It is either removed or
        never existed.
      </P>
      <P>
        <Link href="/">
          You may want to return to {siteConfig.metadata.title}
        </Link>
      </P>
    </>
  );
}
