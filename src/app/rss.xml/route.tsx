import type { ReactNode } from 'react';
import * as runtime from 'react/jsx-runtime';

import { compile, run } from '@mdx-js/mdx';
import { Feed } from 'feed';
import matter from 'gray-matter';
import type { MDXComponents } from 'mdx/types';
import siteConfig from '~/site.config';

import {
  type Frontmatter,
  getAllStaticPaths,
  getArticlesInDir,
  getLastModified,
  normalizeFrontmatter,
  readMdxSource,
  resolveContent,
} from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx-options';
import { renderToStaticMarkup } from '@/lib/rss-render';

export const dynamic = 'force-static';

const rssComponents: MDXComponents = {
  Callout: ({ children }: { type?: string; children?: ReactNode }) => (
    <>{children}</>
  ),
  Timeline: ({ children }: { children?: ReactNode }) => <>{children}</>,
  TimelineItem: ({
    title,
    children,
  }: {
    title?: string;
    badges?: string;
    children?: ReactNode;
  }) => (
    <>
      <strong>{title}</strong>
      {children}
    </>
  ),
  ArticleList: () => null,
  ArticleListItem: () => null,
  TableOfContents: () => null,
  Spacer: () => null,
  ProgressBar: () => null,
};

type FileEntry = { filePath: string; urlPath: string };

function collectFileEntries(include: 'none' | 'all' | string[]): FileEntry[] {
  if (include === 'none') return [];

  const seen = new Set<string>();
  const entries: FileEntry[] = [];

  function addFile(filePath: string, urlPath: string) {
    if (!seen.has(filePath)) {
      seen.add(filePath);
      entries.push({ filePath, urlPath });
    }
  }

  if (include === 'all') {
    for (const segments of getAllStaticPaths()) {
      const resolved = resolveContent(segments);
      if (resolved.kind === 'file') {
        addFile(resolved.filePath, resolved.urlPath);
      }
    }
    return entries;
  }

  for (const entry of include) {
    const segments = entry.split('/').filter(Boolean);
    const resolved = resolveContent(segments);
    if (resolved.kind === 'file') {
      addFile(resolved.filePath, resolved.urlPath);
    } else if (resolved.kind === 'directory') {
      for (const article of getArticlesInDir(segments, resolved.recursive)) {
        const articleSegments = article.urlPath.split('/').filter(Boolean);
        const articleResolved = resolveContent(articleSegments);
        if (articleResolved.kind === 'file') {
          addFile(articleResolved.filePath, articleResolved.urlPath);
        }
      }
    }
  }

  return entries;
}

function resolveItemDate(fm: Frontmatter, filePath: string): Date {
  const dateStr =
    fm['publish-date'] ?? fm['last-edited'] ?? getLastModified(filePath);
  return new Date(dateStr);
}

async function renderToHtml(rawSource: string): Promise<string> {
  const compiled = await compile(rawSource, {
    outputFormat: 'function-body',
    ...mdxOptions,
  });
  const { default: Content } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return renderToStaticMarkup(<Content components={rssComponents} />);
}

export async function GET() {
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: baseUrl,
    link: baseUrl,
    copyright: siteConfig.author ?? '',
    feedLinks: { rss2: `${baseUrl}/rss.xml` },
    author: siteConfig.author ? { name: siteConfig.author } : undefined,
  });

  const include = siteConfig.rss ?? 'none';
  const entries = collectFileEntries(include);

  const items = (
    await Promise.all(
      entries.map(async ({ filePath, urlPath }) => {
        const rawSource = readMdxSource(filePath);
        const { data } = matter(rawSource);
        const fm = normalizeFrontmatter(data);
        if (fm.draft) return null;
        const date = resolveItemDate(fm, filePath);
        const html = await renderToHtml(rawSource);
        return { urlPath, fm, date, html };
      }),
    )
  ).filter((item) => item !== null);

  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  for (const { urlPath, fm, date, html } of items) {
    feed.addItem({
      title: fm.title,
      description: fm.description,
      link: `${baseUrl}${urlPath}`,
      id: `${baseUrl}${urlPath}`,
      date,
      content: html,
    });
  }

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
