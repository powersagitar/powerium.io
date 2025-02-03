import 'server-only';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NotionPageBlog } from '@/components/notion';
import { siteConfig } from '@/config/site';
import { getBlogHref } from '@/lib/notion/client';
import { retrieveNotionPage } from '@/lib/notion/server';
import { NotionBlogPageProperties } from '@/lib/notion/types';

type GenerateMetadataProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  try {
    const pageId = (await params).slug;
    const page = (await retrieveNotionPage(pageId)) as PageObjectResponse;
    const properties = page.properties as unknown as NotionBlogPageProperties;

    const title = properties.title.title
      .map((richtext) => richtext.plain_text)
      .join('');
    const description = properties.description.rich_text
      .map((richtext) => richtext.plain_text)
      .join('');

    return {
      title,
      description,

      alternates: {
        canonical: getBlogHref(pageId),
      },

      openGraph: {
        title,
        description,
        url: `${siteConfig.url.origin}/blog/${pageId}`,
        siteName: siteConfig.metadata.title,
        images: [
          {
            url: `${siteConfig.url.origin}/api/og/blog/${pageId}`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
    };
  } catch (e) {
    console.warn(e);
    return {};
  }
}

type BlogArticleProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogArticle({ params }: BlogArticleProps) {
  try {
    const pageId = (await params).slug;
    const page = (await retrieveNotionPage(pageId)) as PageObjectResponse;
    return <NotionPageBlog page={page} />;
  } catch (e) {
    console.warn(e);
    return notFound();
  }
}
