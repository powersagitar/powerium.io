export type Blog = {
  content: string;
  metdata: Metadata;
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
