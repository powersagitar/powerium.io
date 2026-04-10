import { getArticlesInDir } from '@/lib/mdx';

import { ArticleCard } from './ArticleCard';

type Props = {
  dir: string;
  limit?: number;
};

export function ArticleList({ dir, limit }: Props) {
  const posts = getArticlesInDir([dir]).slice(0, limit);
  const urlPrefix = `/${dir}`;

  return (
    <div className="not-prose space-y-4">
      {posts.map((article) => (
        <ArticleCard
          key={article.slug}
          article={article}
          urlPrefix={urlPrefix}
        />
      ))}
    </div>
  );
}
