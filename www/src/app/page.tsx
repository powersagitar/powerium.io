import { Link } from "@/components/ui/link";
import { H1, H2, P } from "@/components/ui/typography";
import {
  checkIsPublished,
  getAllMetadata,
  pathToSlug,
  sortByNewlyPublished,
} from "@/lib/blog/posts";
import { siteConfig } from "@/lib/config/config";
import dateFormat from "dateformat";
import { notFound } from "next/navigation";

export default async function Home() {
  const metadata = await getAllMetadata()
    .then((list) =>
      list
        .filter((post) => checkIsPublished(new Date(post.metadata.published)))
        .sort((a, b) =>
          sortByNewlyPublished(
            new Date(a.metadata.published),
            new Date(b.metadata.published)
          )
        )
        .slice(0, 5)
    )
    .catch(() => notFound());

  return (
    <main>
      <hgroup>
        <H1>{siteConfig.title}</H1>
        <P>{siteConfig.description}</P>
      </hgroup>

      <H2 className="mt-10">Blog</H2>
      <div className="my-4 grid gap-4 sm:grid-cols-[8em_2fr_3fr]">
        {metadata.map(({ metadata, path }, idx) => (
          <Link
            href={pathToSlug(path)}
            className="contents"
            key={"home-published-blog-list-" + idx}
          >
            <p className="text-muted-foreground">
              {dateFormat(metadata.published, "mediumDate", true)}
            </p>

            <p className="underline">{metadata.title}</p>

            <p className="text-muted-foreground">{metadata.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
