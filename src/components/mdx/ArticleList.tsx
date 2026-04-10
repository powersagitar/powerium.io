import { getArticlesInDir } from '@/lib/mdx';

import { ArticleListItem } from './ArticleListItem';

type Props = {
  dir: string;
  limit?: number;
};

export function ArticleList({ dir, limit }: Props) {
  const posts = getArticlesInDir([dir]).slice(0, limit);
  const urlPrefix = `/${dir}`;

  return (
    <ul className="not-prose divide-y">
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
