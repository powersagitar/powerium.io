import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import 'server-only';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export type Frontmatter = {
  title: string;
  description: string;
  date: string;
  draft?: boolean;
};

export type Article = Frontmatter & {
  slug: string;
};

export function getAllPosts(dir: string): Article[] {
  const targetDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(targetDir)) return [];
  const slugs = fs
    .readdirSync(targetDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
  return slugs
    .map((slug) => {
      const filePath = path.join(targetDir, `${slug}.mdx`);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(source);
      return { slug, ...(data as Frontmatter) };
    })
    .filter((article) => !article.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPageSource(page: string): string {
  const filePath = path.join(CONTENT_DIR, 'pages', `${page}.mdx`);
  return fs.readFileSync(filePath, 'utf-8');
}

export function getPageSlugs(): string[] {
  const pagesDir = path.join(CONTENT_DIR, 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  return fs
    .readdirSync(pagesDir)
    .filter((f) => f.endsWith('.mdx') && f !== 'home.mdx')
    .map((f) => f.replace(/\.mdx$/, ''));
}
