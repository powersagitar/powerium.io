import { H1 } from "@/components/ui/typography";
import { checkIsPublished as isPublished } from "@/lib/blog/post";
import { Path, Post } from "@/lib/blog/types";
import { notFound } from "next/navigation";

type Props = {
  params: Readonly<Promise<{ slug: string[] }>>;
};

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const path = ("content/blog/" + slug.join("/") + ".mdx") as Path;

  const { default: Post, frontmatter }: Post = await import("@/../" + path);

  if (!isPublished(new Date(frontmatter.publishedAt))) {
    notFound();
  }

  return (
    <main>
      <article>
        <hgroup>
          <H1>{frontmatter.title}</H1>
        </hgroup>

        <Post />
      </article>
    </main>
  );
}
