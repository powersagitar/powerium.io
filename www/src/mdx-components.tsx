import type { MDXComponents } from "mdx/types";
import Separator from "./components/mdx/separator";
import BlockQuote from "./components/ui/block-quote";
import CodeBlock from "./components/ui/code-block";
import { Link } from "./components/ui/link";
import { Code, H1, H2, H3, P, Ul } from "./components/ui/typography";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    a: Link,
    blockquote: BlockQuote,
    code: Code,
    hr: Separator,
    pre: CodeBlock,
    ul: Ul,
  };
}
