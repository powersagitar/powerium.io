import { getAllPosts } from '@/lib/mdx';

import { ArticleCard } from './ArticleCard';

type Props = {
  dir: string;
  title: string;
  limit?: number;
};

export function ArticleList({ dir, title, limit }: Props) {
  const posts = getAllPosts(dir).slice(0, limit);
  const urlPrefix = `/${dir}`;

  return (
    <div className="not-prose space-y-4">
      <h2 className="prose mb-4 text-xl font-semibold">{title}</h2>
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
