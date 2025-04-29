import { readFileSync } from "fs";
import { globbySync } from "globby";
import matter from "gray-matter";
import { cache } from "react";
import { Blog, Metadata } from "./types";

export const getAllPosts = cache((): Blog[] => {
  const paths = globbySync("content/blog/**/*.mdx");

  return paths.map((path) => {
    const post = readFileSync(path);
    const metadata = matter(post).data as Metadata;

    return {
      path,
      metadata,
    };
  });
});
