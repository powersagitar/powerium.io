export type MetadataWithSource = {
  metadata: Metadata;
  strippedSource: string;
};

export type MetadataWithPath = {
  path: Path;
  metadata: Metadata;
};

export type Path = `content/blog/${string}.mdx`;

export type Metadata = {
  title: string;
  description: string;
  authors: Author[];
  publishedAt: string;
};

type Author = {
  displayName: string;
  href?: string;
};
