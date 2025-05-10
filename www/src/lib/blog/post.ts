import { globby } from "globby";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import fs from "node:fs/promises";
import { cache } from "react";
import { Metadata, MetadataWithPath, MetadataWithSource, Path } from "./types";

export const getAllPosts = cache(async () => {
  const paths = await globby("content/blog/**/*.mdx");

  return Promise.all(
    paths.map(async (path): Promise<MetadataWithPath> => {
      const post = await fs.readFile(path);
      const { frontmatter } = getFrontmatter<Metadata>(post);

      return {
        path: path as Path,
        metadata: frontmatter,
      };
    })
  );
});

export const getPost = cache(
  async (path: Path): Promise<MetadataWithSource> => {
    const post = await fs.readFile(path);
    const { frontmatter, strippedSource } = getFrontmatter<Metadata>(post);

    return {
      metadata: frontmatter,
      strippedSource,
    };
  }
);

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
