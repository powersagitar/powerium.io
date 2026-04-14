import type { Root } from 'mdast';
import 'server-only';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

// Convert kebab-case (or lowercase) directive names to PascalCase component names.
// e.g. "article-list" → "ArticleList", "spacer" → "Spacer"
function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Build an mdxJsxAttributeValueExpression node for boolean / number values.
// MDX requires a minimal ESTree program wrapping any non-string attribute value.
function jsxExpressionValue(value: boolean | number) {
  const raw = String(value);
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: raw,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value, raw },
          },
        ],
      },
    },
  };
}

// Convert the flat attributes object produced by remark-directive into the
// mdxJsxAttribute node list expected by @mdx-js/mdx.
//
// Coercion rules:
//   ''        → {true}   (attribute present without a value, e.g. {recursive})
//   numeric   → {number} (e.g. {limit=5} → limit={5})
//   otherwise → string   (e.g. {size=lg} → size="lg")
function toMdxAttributes(attrs: Record<string, string>) {
  return Object.entries(attrs).map(([key, val]) => {
    if (val === '') {
      return {
        type: 'mdxJsxAttribute',
        name: key,
        value: jsxExpressionValue(true),
      };
    }
    const num = Number(val);
    if (val.trim() !== '' && !isNaN(num)) {
      return {
        type: 'mdxJsxAttribute',
        name: key,
        value: jsxExpressionValue(num),
      };
    }
    return { type: 'mdxJsxAttribute', name: key, value: val };
  });
}

// Remark plugin: convert remark-directive nodes into MDX JSX element nodes so
// that the custom component map (mdxComponents) can render them.
//
// Supported directive forms:
//   ::spacer{size=lg}                              → <Spacer size="lg" />
//   ::table-of-contents                            → <TableOfContents />
//   ::article-list{dir=guides recursive limit=3}   → <ArticleList dir="guides" recursive={true} limit={3} />
//
// leafDirective / containerDirective → mdxJsxFlowElement (block-level)
// textDirective                      → mdxJsxTextElement (inline)
export const remarkDirectiveComponents: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node) => {
    if (
      node.type !== 'leafDirective' &&
      node.type !== 'containerDirective' &&
      node.type !== 'textDirective'
    ) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directive = node as any;

    // remark-directive v4 creates directive nodes for colon-prefixed tokens
    // even when the name starts with a digit (e.g. `:3000` in `localhost:3000`).
    // Skip anything that doesn't start with an ASCII letter so we never produce
    // an invalid React element tag.
    if (!/^[a-zA-Z]/.test(directive.name)) return;

    directive.type =
      node.type === 'textDirective' ? 'mdxJsxTextElement' : 'mdxJsxFlowElement';
    directive.name = toPascalCase(directive.name);
    directive.attributes = toMdxAttributes(directive.attributes ?? {});
  });
};
