import { readFile } from "fs/promises";
import { globby } from "globby";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import { cache } from "react";
import { AllMetadata, Metadata, Path, Post } from "./types";

export const getAllMetadata = cache(async (): Promise<AllMetadata[]> => {
  const paths = (await globby("content/blog/**/*.mdx")) as Path[];

  return Promise.all(
    paths.map(async (path) => {
      const post = await readFile(path);
      const { frontmatter } = getFrontmatter<Metadata>(post);

      return {
        path,
        metadata: frontmatter,
      };
    })
  );
});

export const getPost = cache(async (path: string): Promise<Post> => {
  const post = await readFile(path);
  const { frontmatter, strippedSource } = getFrontmatter<Metadata>(post);

  return {
    metadata: frontmatter,
    source: strippedSource,
  };
});

export const checkIsPublished = cache(
  (publishDate: Date): boolean => new Date() >= publishDate
);

export const sortByNewlyPublished = cache(
  (a: Date, b: Date) => b.valueOf() - a.valueOf()
);

export const pathToSlug = cache(
  (path: Path) =>
    "/blog/" +
    path
      .split("/")
      .slice(2)
      .join("/")
      .replace(/\.mdx$/, "")
);
