import { FC } from "react";

export type Post = {
  frontmatter: Frontmatter;
  default: FC;
};

export type FrontmatterWithPath = {
  path: Path;
  frontmatter: Frontmatter;
};

export type Path = `content/blog/${string}.mdx`;

export type Frontmatter = {
  title: string;
  description: string;
  authors: Author[];
  publishedAt: string;
};

type Author = {
  displayName: string;
  href?: string;
};
