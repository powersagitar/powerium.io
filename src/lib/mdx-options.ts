import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxOptions: Record<string, any> = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap',
        properties: {
          className: ['anchor'],
        },
      },
    ],
    [
      rehypePrettyCode,
      {
        theme: {
          dark: 'github-dark',
          light: 'github-light',
        },
        keepBackground: false,
      },
    ],
  ],
};
