import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import 'server-only';

import type { Frontmatter } from '@/lib/mdx';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type BlogFrontmatter = Frontmatter & {
  author?: string;
  tags?: string[];
};

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getBlogFrontmatter(slug: string): BlogFrontmatter {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(source);
  return data as BlogFrontmatter;
}

export function getBlogSource(slug: string): string {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  return fs.readFileSync(filePath, 'utf-8');
}
