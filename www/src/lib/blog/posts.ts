import { readFileSync } from "fs";
import { globbySync } from "globby";
import matter from "gray-matter";
import { cache } from "react";
import { Blog, Metadata } from "./types";

type MatterExtractType = {
  content: string;
  data: Metadata;
};

export const getAllPosts = cache((): Map<string, Blog> => {
  const paths = globbySync("content/blog/**/*.mdx");
  const posts = new Map();

  paths.forEach((path) => {
    const post = readFileSync(path);
    const { content, data } = matter(post) as unknown as MatterExtractType;

    posts.set(path, { content, metadata: data });
  });

  return posts;
});
