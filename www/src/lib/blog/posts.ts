import { globbySync } from "globby";

export function getAllPosts() {
  return globbySync("content/blog/**/*.mdx");
}
