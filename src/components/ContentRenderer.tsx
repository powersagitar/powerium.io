import * as runtime from 'react/jsx-runtime';

import { notFound } from 'next/navigation';

import { compile, run } from '@mdx-js/mdx';
import matter from 'gray-matter';

import { mdxComponents } from '@/components/mdx';
import { ArticleListItem } from '@/components/mdx/ArticleListItem';
import { Badge } from '@/components/ui/badge';
import {
  getArticlesInDir,
  getLastModified,
  normalizeFrontmatter,
  readMdxSource,
  resolveContent,
} from '@/lib/mdx';
import { mdxOptions } from '@/lib/mdx-options';

export async function generateContentMetadata(slugParts: string[]) {
  const resolved = resolveContent(slugParts);

  if (resolved.kind === 'file') {
    const { data } = matter(readMdxSource(resolved.filePath));
    return {
      title: data.title as string,
      description: data.description as string,
    };
  }

  if (resolved.kind === 'directory') {
    const name = slugParts.at(-1) ?? '';
    return { title: name.charAt(0).toUpperCase() + name.slice(1) };
  }

  return {};
}

export async function ContentRenderer({ slugParts }: { slugParts: string[] }) {
  const resolved = resolveContent(slugParts);

  if (resolved.kind === 'not-found') notFound();

  if (resolved.kind === 'file') {
    const rawSource = readMdxSource(resolved.filePath);
    const { data } = matter(rawSource);
    const frontmatter = normalizeFrontmatter(data);

    const compiled = await compile(rawSource, {
      outputFormat: 'function-body',
      ...mdxOptions,
    });
    const { default: Content } = await run(compiled, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    const publishDate = frontmatter['publish-date'];
    const lastEdited =
      frontmatter['last-edited'] ?? getLastModified(resolved.filePath);

    return (
      <article className="prose">
        <header className="mb-7">
          <h1 id="title" className="mb-3">
            <a href="#title" className="anchor">
              {frontmatter.title}
            </a>
          </h1>
          {frontmatter.description && (
            <p className="text-muted-foreground mb-3.5 text-[17px] leading-[1.55]">
              {frontmatter.description}
            </p>
          )}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {frontmatter.author && (
              <>
                <span>
                  By{' '}
                  <span className="text-foreground font-medium">
                    {frontmatter.author}
                  </span>
                </span>
              </>
            )}
            {publishDate && (
              <>
                {frontmatter.author && <span aria-hidden="true">·</span>}
                <time dateTime={publishDate}>{publishDate}</time>
              </>
            )}
            {(!publishDate || lastEdited > publishDate) && (
              <>
                {(publishDate || frontmatter.author) && (
                  <span aria-hidden="true">·</span>
                )}
                <span>
                  <time dateTime={lastEdited}>{lastEdited}</time>
                  {' (Last Edited)'}
                </span>
              </>
            )}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="ml-1 flex flex-wrap gap-1.5">
                {frontmatter.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>
        <Content components={mdxComponents} />
      </article>
    );
  }

  if (resolved.kind === 'directory') {
    const articles = getArticlesInDir(slugParts, resolved.recursive);
    if (articles.length === 0) notFound();
    const name = slugParts.at(-1) ?? '';
    const title = name.charAt(0).toUpperCase() + name.slice(1);
    const lastEdited = getLastModified(resolved.dirPath);

    return (
      <div className="prose">
        <h1 id="title" className="mb-2">
          <a href="#title" className="anchor">
            {title}
          </a>
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          <time dateTime={lastEdited}>{lastEdited}</time>
          {' (Last Edited)'}
        </p>
        <ul className="not-prose mb-5.5 grid list-none grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 p-0">
          {articles.map((article) => (
            <ArticleListItem
              key={article.slug}
              article={article}
              urlPrefix={resolved.urlPath}
            />
          ))}
        </ul>
      </div>
    );
  }
}
