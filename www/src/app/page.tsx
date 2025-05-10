import { getAllPosts } from "@/lib/blog/post";

export default async function Home() {
  const posts = await getAllPosts();
  console.log(posts);

  return <main></main>;
}
