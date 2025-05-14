import { globby } from "globby";
import matter from "gray-matter";
import fs from "node:fs/promises";
import { cache } from "react";
import { Frontmatter, FrontmatterWithPath, Path } from "./types";

export const getAllPosts = cache(async () => {
  const paths = await globby("content/blog/**/*.mdx");

  return Promise.all(
    paths.map(async (path): Promise<FrontmatterWithPath> => {
      const post = await fs.readFile(path);
      const { data } = matter(post);

      return {
        path: path as Path,
        frontmatter: data as Frontmatter,
      };
    })
  );
});

// TODO: for some reason i can't extract dynamic imports
//
// export const getPost = async (path: Path): Promise<Post> => {
//   const { default: Post, frontmatter } = await import("@/../" + path);
//   return {
//     frontmatter,
//     Post,
//   };
// };

export const isPublished = cache(
  (publishDate: Date): boolean => new Date() >= publishDate
);

export const sortByNewlyPublished = cache(
  (a: Date, b: Date) => b.valueOf() - a.valueOf()
);

export const pathToHref = cache(
  (path: Path) =>
    "/blog/" +
    path
      .split("/")
      .slice(2)
      .join("/")
      .replace(/\.mdx$/, "")
);
