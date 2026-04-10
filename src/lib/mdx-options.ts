import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFormat from 'rehype-format';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'server-only';

// MDX-specific hast node types that must be passed through by any plugin that
// iterates the tree. hast-util-sanitize drops all node types outside the
// standard hast set, so rehype-sanitize cannot be used in an MDX pipeline
// without destroying all custom components (<BlogList />, <Spacer />, etc.).
// For a static site with author-controlled content it provides no security
// benefit, so it is intentionally omitted.
const MDX_NODE_TYPES = [
  'mdxjsEsm',
  'mdxFlowExpression',
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
  'mdxTextExpression',
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxOptions: Record<string, any> = {
  remarkPlugins: [
    remarkFrontmatter, // parse YAML/TOML frontmatter blocks
    remarkGfm, // tables, strikethrough, task lists, autolinks
    remarkMath, // $inline$ and $$block$$ math
    remarkDirective, // ::directive[content]{key=val} syntax
  ],
  rehypePlugins: [
    [
      rehypeRaw, // parse raw HTML nodes embedded in markdown
      {
        // MDX-specific node types must be passed through untouched;
        // hast-util-raw does not know how to handle JSX/expression nodes.
        passThrough: [...MDX_NODE_TYPES],
      },
    ],
    rehypeSlug, // add id attributes to headings
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap',
        properties: { className: ['anchor'] },
      },
    ],
    [
      rehypePrettyCode, // syntax highlighting via shiki
      {
        theme: { dark: 'github-dark', light: 'github-light' },
        keepBackground: false,
      },
    ],
    rehypeKatex, // render math nodes to KaTeX HTML
    [
      rehypeExternalLinks, // open external links in new tab
      { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] },
    ],
    rehypeFormat, // normalize HTML whitespace (runs last)
  ],
};
