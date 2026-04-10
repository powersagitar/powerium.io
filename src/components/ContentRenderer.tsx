import { notFound } from 'next/navigation';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';

import { mdxComponents } from '@/components/mdx';
import { ArticleCard } from '@/components/mdx/ArticleCard';
import {
  type Frontmatter,
  getArticlesInDir,
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
    const { content, frontmatter } = await compileMDX<Frontmatter>({
      source: readMdxSource(resolved.filePath),
      components: mdxComponents,
      options: { parseFrontmatter: true, mdxOptions },
    });

    return (
      <article className="prose">
        <header className="mb-8">
          <h1 id="title" className="mb-2">
            <a href="#title" className="anchor">
              {frontmatter.title}
            </a>
          </h1>
          {frontmatter.date && (
            <time className="text-muted-foreground text-sm">
              {frontmatter.date}
            </time>
          )}
          {frontmatter.author && (
            <p className="text-muted-foreground text-sm">
              by {frontmatter.author}
            </p>
          )}
          {frontmatter.tags && (
            <p className="text-muted-foreground text-sm">
              {frontmatter.tags.join(', ')}
            </p>
          )}
        </header>
        {content}
      </article>
    );
  }

  if (resolved.kind === 'directory') {
    const articles = getArticlesInDir(slugParts);
    const name = slugParts.at(-1) ?? '';
    const title = name.charAt(0).toUpperCase() + name.slice(1);

    return (
      <div className="prose">
        <h1 id="title" className="mb-8">
          <a href="#title" className="anchor">
            {title}
          </a>
        </h1>
        <div className="not-prose space-y-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              urlPrefix={resolved.urlPath}
            />
          ))}
        </div>
      </div>
    );
  }
}
