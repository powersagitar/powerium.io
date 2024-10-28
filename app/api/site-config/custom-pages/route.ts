import 'server-only';

import { notionConfig } from '@/config/notion';

export function GET() {
  if (!notionConfig.customPages) {
    return Response.json({});
  }

  const customPages = Array.from(notionConfig.customPages).map(
    ([href, { navTitle }]) => {
      return { href: href, title: navTitle };
    },
  );

  return Response.json({ ...customPages });
}
