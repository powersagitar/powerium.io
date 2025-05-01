export type Post = {
  metadata: Metadata;
  source: string;
};

export type AllMetadata = {
  metadata: Metadata;
  path: string;
};

export type Metadata = {
  title: string;
  published: Date;
  authors: Author[];
  description: string;
};

type Author = {
  displayName: string;
  href?: URL;
};
