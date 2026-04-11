import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import 'server-only';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export type Frontmatter = {
  title: string;
  description: string;
  date?: string;
  lastEdited?: string;
  draft?: boolean;
  author?: string;
  tags?: string[];
};

export function getLastModified(fsPath: string): string {
  return fs.statSync(fsPath).mtime.toISOString().slice(0, 10);
}

export type Article = Frontmatter & {
  slug: string;
  urlPath: string;
};

export type ResolvedContent =
  | { kind: 'file'; filePath: string; urlPath: string }
  | { kind: 'directory'; dirPath: string; urlPath: string }
  | { kind: 'not-found' };

export function resolveContent(slugParts: string[]): ResolvedContent {
  const urlPath = slugParts.length === 0 ? '/' : '/' + slugParts.join('/');

  if (slugParts.length === 0) {
    const filePath = path.join(CONTENT_DIR, 'index.mdx');
    if (fs.existsSync(filePath)) return { kind: 'file', filePath, urlPath };
    return { kind: 'not-found' };
  }

  const filePath = path.join(CONTENT_DIR, ...slugParts) + '.mdx';
  if (fs.existsSync(filePath)) return { kind: 'file', filePath, urlPath };

  const dirPath = path.join(CONTENT_DIR, ...slugParts);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const hasMdx = fs.readdirSync(dirPath).some((f) => f.endsWith('.mdx'));
    if (hasMdx) return { kind: 'directory', dirPath, urlPath };
  }

  return { kind: 'not-found' };
}

export function getArticlesInDir(
  dirSegments: string[],
  recursive: boolean,
): Article[] {
  const dirPath = path.join(CONTENT_DIR, ...dirSegments);
  if (!fs.existsSync(dirPath)) return [];

  const urlDirPrefix = '/' + dirSegments.join('/');

  function collectMdxFiles(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && recursive) {
        results.push(...collectMdxFiles(fullPath));
      } else if (entry.name.endsWith('.mdx')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  return collectMdxFiles(dirPath)
    .map((filePath) => {
      const relative = path.relative(dirPath, filePath).replace(/\.mdx$/, '');
      const slug = relative.split(path.sep).join('/');
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(source);
      const fm = data as Frontmatter;
      return { slug, urlPath: `${urlDirPrefix}/${slug}`, ...fm };
    })
    .filter((a) => !a.draft)
    .sort((a, b) => {
      if (a.date && b.date)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date) return -1;
      if (b.date) return 1;
      return a.slug.localeCompare(b.slug);
    });
}

export function readMdxSource(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

export function getAllStaticPaths(): string[][] {
  const paths: string[][] = [];
  const seenDirs = new Set<string>();

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let hasMdxInThisDir = false;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.mdx')) {
        hasMdxInThisDir = true;
        const relative = path.relative(CONTENT_DIR, path.join(dir, entry.name));
        const withoutExt = relative.replace(/\.mdx$/, '');
        const segments = withoutExt.split(path.sep);
        if (segments.length === 1 && segments[0] === 'index') {
          paths.push([]);
        } else {
          paths.push(segments);
        }
      }
    }

    if (hasMdxInThisDir && dir !== CONTENT_DIR) {
      const relative = path.relative(CONTENT_DIR, dir);
      const segments = relative.split(path.sep);
      const key = segments.join('/');
      if (!seenDirs.has(key)) {
        seenDirs.add(key);
        paths.push(segments);
      }
    }
  }

  walk(CONTENT_DIR);
  return paths;
}
