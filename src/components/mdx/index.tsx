import type { MDXComponents } from 'mdx/types';

import { ArticleCard } from './ArticleCard';
import { ArticleList } from './ArticleList';
import { Spacer } from './Spacer';
import { TableOfContents } from './TableOfContents';

export const mdxComponents: MDXComponents = {
  // Custom components usable in MDX
  ArticleList,
  ArticleCard,
  TableOfContents,
  Spacer,
};
