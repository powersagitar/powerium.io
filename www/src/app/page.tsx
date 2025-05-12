import { Link } from "@/components/ui/link";
import { H1, H2, P } from "@/components/ui/typography";
import { getAllPosts, pathToSlug } from "@/lib/blog/post";
import { siteConfig } from "@/lib/config/config";
import dateFormat from "dateformat";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main>
      <hgroup>
        <H1>{siteConfig.title}</H1>
        <P>{siteConfig.description}</P>
      </hgroup>

      <H2 className="mt-10">Blog</H2>
      <div className="my-4 grid-cols-[8em_2fr_3fr] gap-4 font-medium sm:grid">
        {posts.map(({ frontmatter, path }, idx) => (
          <Link
            href={pathToSlug(path)}
            className="contents"
            key={"home-published-blog-list-" + idx}
          >
            <p className="text-muted-foreground">
              {dateFormat(frontmatter.publishedAt, "mediumDate", true)}
            </p>

            <p className="underline">{frontmatter.title}</p>

            <p className="text-muted-foreground">{frontmatter.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
