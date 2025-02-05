import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { NotionPageBlog } from '@/components/notion/page';
import { siteConfig } from '@/config/site';
import { getBlogHref } from '@/lib/notion/client';
import {
  retrieveAllPublishedArticles,
  retrieveNotionPage,
} from '@/lib/notion/server';
import { NotionBlogPageProperties } from '@/lib/notion/types';

export const revalidate = 14400;

export async function generateStaticParams() {
  let posts;

  try {
    posts = (await retrieveAllPublishedArticles()) as DatabaseObjectResponse[];
  } catch (e) {
    console.error(e);
    return [];
  }

  return posts.map((post) => ({
    id: post.id,
  }));
}

type Props = {
  params: Promise<{ id: string }>;
};

async function getPage({ params }: Props) {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const id = (await params).id;

  try {
    return (await retrieveNotionPage(id)) as PageObjectResponse;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const page = await getPage(props);
  const properties = page.properties as NotionBlogPageProperties;

  const title = properties.title.title
    .map((richtext) => richtext.plain_text)
    .join('');
  const description = properties.description.rich_text
    .map((richtext) => richtext.plain_text)
    .join('');
  const canonical = getBlogHref(page.id);
  const url = canonical;
  const siteName = siteConfig.metadata.title;
  const ogImageURL = new URL('/api/og/blog/' + page.id, siteConfig.url.origin);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImageURL,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function BlogArticle(props: Props) {
  // exception is intentinally not caught
  // as it triggers a 500 internal server error
  const page = await getPage(props);
  return <NotionPageBlog page={page} />;
}
