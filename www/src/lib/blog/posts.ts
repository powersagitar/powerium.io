import { readFile } from "fs/promises";
import { globby } from "globby";
import matter from "gray-matter";
import { cache } from "react";
import { Blog, Metadata } from "./types";

type MatterExtractType = {
  content: string;
  data: Metadata;
};

export const getAllPosts = cache(async (): Promise<Map<string, Blog>> => {
  const paths = await globby("content/blog/**/*.mdx");
  const posts = new Map();

  await Promise.all(
    paths.map(async (path) => {
      const post = await readFile(path);
      const { content, data: metadata } = matter(
        post
      ) as unknown as MatterExtractType;

      posts.set(path, { content, metadata });
    })
  );

  return posts;
});
