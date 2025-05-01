import { getPost } from "@/lib/blog/posts";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const path = "content/blog/" + slug.join("/") + ".mdx";

  const post = await getPost(path).catch(() => notFound());

  if (!post) {
    notFound();
  }

  const { content, metadata } = post;

  if (new Date() < metadata.published) {
    notFound();
  }

  return <MDXRemote source={content} />;
}
