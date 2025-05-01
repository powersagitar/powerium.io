import { readFile } from "fs/promises";
import { globby } from "globby";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import { cache } from "react";
import { AllMetadata, Metadata, Post } from "./types";

export const getAllMetadata = cache(async (): Promise<AllMetadata[]> => {
  const paths = await globby("content/blog/**/*.mdx");

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
