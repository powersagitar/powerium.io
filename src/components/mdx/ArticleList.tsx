import { getArticlesInDir } from '@/lib/mdx';

import { ArticleListItem } from './ArticleListItem';

type Props = {
  dir: string;
  recursive?: boolean;
  limit?: number;
};

export function ArticleList({ dir, recursive = false, limit }: Props) {
  const posts = getArticlesInDir([dir], recursive).slice(0, limit);
  const urlPrefix = `/${dir}`;

  return (
    <ul className="not-prose mb-5.5 grid list-none grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 p-0">
      {posts.map((article) => (
        <ArticleListItem
          key={article.slug}
          article={article}
          urlPrefix={urlPrefix}
        />
      ))}
    </ul>
  );
}
