import type { MetadataRoute } from 'next';

import { getAllStaticPaths, getLastModified, resolveContent } from '@/lib/mdx';

const BASE_URL = 'https://powerium.io';

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllStaticPaths().map((segments) => {
    const urlPath = segments.length === 0 ? '' : '/' + segments.join('/');
    const resolved = resolveContent(segments);
    const lastModified =
      resolved.kind === 'file'
        ? getLastModified(resolved.filePath)
        : resolved.kind === 'directory'
          ? getLastModified(resolved.dirPath)
          : undefined;

    return { url: `${BASE_URL}${urlPath}`, lastModified };
  });
}
