export type Post = {
  metadata: Metadata;
  source: string;
};

export type AllMetadata = {
  metadata: Metadata;
  path: Path;
};

export type Path = `content/blog/${string}.mdx`;

export type Metadata = {
  title: string;
  published: string;
  authors: Author[];
  description: string;
};

type Author = {
  displayName: string;
  href?: string;
};
