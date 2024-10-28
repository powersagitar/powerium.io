import 'server-only';

import { siteConfig } from '@/site.config';

export function GET() {
  if (!siteConfig.customPages) {
    return Response.json({});
  }

  const customPages = Array.from(siteConfig.customPages).map(
    ([href, { navTitle }]) => {
      return { href: href, title: navTitle };
    },
  );

  return Response.json({ ...customPages });
}
