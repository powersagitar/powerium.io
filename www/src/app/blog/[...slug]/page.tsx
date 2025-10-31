import { H1 } from "@/components/ui/typography";
import { getAllPosts, isPublished, pathToHref } from "@/lib/blog/post";
import { Path, Post } from "@/lib/blog/types";
import { notFound } from "next/navigation";

type Params = { slug: string[] };

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const path = ("content/blog/" + slug.join("/") + ".mdx") as Path;

  const { default: Post, frontmatter }: Post = await import("@/../" + path);

  if (!(await isPublished(new Date(frontmatter.publishedAt)))) {
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

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();

  return posts.map(({ path }) => {
    const href = pathToHref(path);
    const slug = href.split("/").slice(2);

    return {
      slug,
    };
  });
}
