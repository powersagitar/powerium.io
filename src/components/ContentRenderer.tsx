import * as runtime from 'react/jsx-runtime';

import { notFound } from 'next/navigation';

import { compile, run } from '@mdx-js/mdx';
import matter from 'gray-matter';

import { mdxComponents } from '@/components/mdx';
import { ArticleListItem } from '@/components/mdx/ArticleListItem';
import { Badge } from '@/components/ui/badge';
import {
  type Frontmatter,
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
        <header className="mb-8">
          <h1 id="title" className="mb-2">
            <a href="#title" className="anchor">
              {frontmatter.title}
            </a>
          </h1>
          <p className="text-muted-foreground flex items-center gap-x-2 text-sm">
            {publishDate && <time dateTime={publishDate}>{publishDate}</time>}
            {(!publishDate || lastEdited > publishDate) && (
              <>
                {publishDate && <span aria-hidden="true">·</span>}
                <span>
                  <time dateTime={lastEdited}>{lastEdited}</time>
                  {' (Last Edited)'}
                </span>
              </>
            )}
          </p>
          {frontmatter.author && (
            <p className="text-muted-foreground text-sm">
              by {frontmatter.author}
            </p>
          )}
          {frontmatter.tags && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
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
        <ul className="not-prose divide-y">
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
