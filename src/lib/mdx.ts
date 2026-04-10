import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import 'server-only';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export type BlogFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
};

export function getBlogSlugs(): string[] {
  const blogDir = path.join(CONTENT_DIR, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getBlogFrontmatter(slug: string): BlogFrontmatter {
  const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(source);
  return data as BlogFrontmatter;
}

export function getAllBlogPosts(): BlogPost[] {
  return getBlogSlugs()
    .map((slug) => ({ slug, ...getBlogFrontmatter(slug) }))
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogSource(slug: string): string {
  const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.mdx`);
  return fs.readFileSync(filePath, 'utf-8');
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
