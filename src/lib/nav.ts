import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import 'server-only';

import { getArticlesInDir } from './mdx';

export type NavItem = { href: string; title: string };
export type NavSection = {
  label: string;
  items: NavItem[];
  font?: 'sans' | 'mono';
  prefix?: string;
};

const NAV_FILE = path.join(process.cwd(), 'content', '_nav.mdx');

function parseAttrs(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w+)=(?:"([^"]*)"|([\w=./_-]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2] ?? m[3];
  }
  return attrs;
}

export function getNavSections(): NavSection[] {
  const source = fs.readFileSync(NAV_FILE, 'utf-8');
  const { content } = matter(source);

  const sections: NavSection[] = [];
  const lines = content.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    const sectionMatch = line.match(/^:::nav-section\{([^}]*)\}/);
    if (sectionMatch) {
      const attrs = parseAttrs(sectionMatch[1]);
      const { label, font, prefix } = attrs;
      if (!label) {
        i++;
        continue;
      }

      const items: NavItem[] = [];

      i++;
      while (i < lines.length) {
        const inner = lines[i].trim();
        if (inner === ':::') {
          i++;
          break;
        }

        const itemMatch = inner.match(/^::nav-item\{([^}]*)\}/);
        if (itemMatch) {
          const a = parseAttrs(itemMatch[1]);
          if (a.href && a.title) items.push({ href: a.href, title: a.title });
        }

        const dirMatch = inner.match(/^::nav-dir\{([^}]*)\}/);
        if (dirMatch) {
          const a = parseAttrs(dirMatch[1]);
          if (a.dir) {
            const articles = getArticlesInDir([a.dir], false);
            items.push(
              ...articles.map((art) => ({
                href: art.urlPath,
                title: art.title,
              })),
            );
          }
        }

        i++;
      }

      sections.push({
        label,
        font: font === 'mono' ? 'mono' : undefined,
        prefix,
        items,
      });
      continue;
    }

    i++;
  }

  return sections;
}
