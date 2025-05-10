import { MDXComponents } from "next-mdx-remote-client";
import CodeBlock from "../ui/code-block";
import Iframe from "../ui/iframe";
import { Link } from "../ui/link";
import { Code, H1, H2, H3, P, Ul } from "../ui/typography";
import Separator from "./separator";

export const components: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  code: Code,
  a: Link,
  pre: CodeBlock,
  hr: Separator,
  Iframe: Iframe,
};
