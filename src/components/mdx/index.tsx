import type { MDXComponents } from 'mdx/types';

import { ArticleList } from './ArticleList';
import { ArticleListItem } from './ArticleListItem';
import { Spacer } from './Spacer';
import { TableOfContents } from './TableOfContents';

export const mdxComponents: MDXComponents = {
  // Custom components usable in MDX
  ArticleList,
  ArticleListItem,
  TableOfContents,
  Spacer,
};
