import { components } from "@/components/mdx/components";
import { H1 } from "@/components/ui/typography";
import { getPost } from "@/lib/blog/posts";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const path = "content/blog/" + slug.join("/") + ".mdx";

  const { metadata, source } = await getPost(path).catch(() => notFound());

  if (!metadata) {
    notFound();
  }

  if (new Date() < new Date(metadata.published)) {
    notFound();
  }

  return (
    <article>
      <hgroup>
        <H1>{metadata.title}</H1>
      </hgroup>

      <MDXRemote source={source} components={components} />
    </article>
  );
}
