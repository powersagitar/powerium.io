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

// gray-matter parses bare YAML dates (e.g. `date: 2025-01-01`) as Date objects.
// Normalize them back to ISO date strings so callers can rely on the type.
export function normalizeFrontmatter(
  data: Record<string, unknown>,
): Frontmatter {
  if (data['date'] instanceof Date)
    data['date'] = data['date'].toISOString().slice(0, 10);
  if (data['lastEdited'] instanceof Date)
    data['lastEdited'] = data['lastEdited'].toISOString().slice(0, 10);
  return data as unknown as Frontmatter;
}

export function getLastModified(fsPath: string): string {
  return fs.statSync(fsPath).mtime.toISOString().slice(0, 10);
}

export type Article = Frontmatter & {
  slug: string;
  urlPath: string;
};

export type ResolvedContent =
  | { kind: 'file'; filePath: string; urlPath: string }
  | { kind: 'directory'; dirPath: string; urlPath: string; recursive: boolean }
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
    const indexPath = path.join(dirPath, 'index.mdx');
    if (fs.existsSync(indexPath))
      return { kind: 'file', filePath: indexPath, urlPath };

    const immediateEntries = fs.readdirSync(dirPath, { withFileTypes: true });
    const hasImmediateMdx = immediateEntries.some(
      (e) => e.isFile() && e.name.endsWith('.mdx') && e.name !== 'index.mdx',
    );

    if (hasImmediateMdx)
      return { kind: 'directory', dirPath, urlPath, recursive: false };

    // No immediate .mdx files — search the subtree. Any index.mdx found here
    // is inside a subdirectory and counts as a valid peer article.
    const hasMdxInSubtree = (function check(dir: string): boolean {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (check(path.join(dir, entry.name))) return true;
        } else if (entry.name.endsWith('.mdx')) {
          return true;
        }
      }
      return false;
    })(dirPath);
    if (hasMdxInSubtree)
      return { kind: 'directory', dirPath, urlPath, recursive: true };
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
      if (entry.isDirectory()) {
        // A subdirectory with index.mdx is a peer article at this level.
        const indexPath = path.join(fullPath, 'index.mdx');
        if (fs.existsSync(indexPath)) results.push(indexPath);
        // Descend further only in recursive mode.
        if (recursive) results.push(...collectMdxFiles(fullPath));
      } else if (entry.name.endsWith('.mdx') && entry.name !== 'index.mdx') {
        results.push(fullPath);
      }
    }
    return results;
  }

  return collectMdxFiles(dirPath)
    .map((filePath) => {
      const relative = path.relative(dirPath, filePath).replace(/\.mdx$/, '');
      const segments = relative.split(path.sep);
      // subdir/index.mdx represents the page at /subdir, not /subdir/index
      if (segments[segments.length - 1] === 'index') segments.pop();
      const slug = segments.join('/');
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(source);
      const fm = normalizeFrontmatter(data);
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

  function walk(dir: string): boolean {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let hasMdxAnywhere = false;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (walk(path.join(dir, entry.name))) hasMdxAnywhere = true;
      } else if (entry.name.endsWith('.mdx')) {
        hasMdxAnywhere = true;
        const relative = path.relative(CONTENT_DIR, path.join(dir, entry.name));
        const withoutExt = relative.replace(/\.mdx$/, '');
        const segments = withoutExt.split(path.sep);
        if (segments.length === 1 && segments[0] === 'index') {
          paths.push([]);
        } else if (segments[segments.length - 1] === 'index') {
          // index.mdx inside a subdirectory — the directory path is emitted
          // by the hasMdxAnywhere branch below; skip a /slug/index route.
        } else {
          paths.push(segments);
        }
      }
    }

    if (hasMdxAnywhere && dir !== CONTENT_DIR) {
      const relative = path.relative(CONTENT_DIR, dir);
      const segments = relative.split(path.sep);
      const key = segments.join('/');
      if (!seenDirs.has(key)) {
        seenDirs.add(key);
        paths.push(segments);
      }
    }

    return hasMdxAnywhere;
  }

  walk(CONTENT_DIR);
  return paths;
}
