import { components } from "@/components/mdx/components";
import { H1 } from "@/components/ui/typography";
import { getPost } from "@/lib/blog/post";
import { Path } from "@/lib/blog/types";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";

type Props = {
  params: Readonly<Promise<{ slug: string[] }>>;
};

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const path = ("content/blog/" + slug.join("/") + ".mdx") as Path;

  const { metadata, strippedSource } = await getPost(path).catch(() =>
    notFound()
  );

  if (new Date() < new Date(metadata.publishedAt)) {
    notFound();
  }

  return (
    <main>
      <article>
        <hgroup>
          <H1>{metadata.title}</H1>
        </hgroup>

        <MDXRemote source={strippedSource} components={components} />
      </article>
    </main>
  );
}
