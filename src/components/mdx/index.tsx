import type { MDXComponents } from 'mdx/types';

import { BlogList } from './BlogList';
import { BlogPostCard } from './BlogPostCard';
import { Spacer } from './Spacer';
import { TableOfContents } from './TableOfContents';

export const mdxComponents: MDXComponents = {
  // Custom components usable in MDX
  BlogList,
  BlogPostCard,
  TableOfContents,
  Spacer,
};
