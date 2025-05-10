import { CSSProperties } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  stackoverflowDark,
  stackoverflowLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeBlockProps = {
  children: {
    props: {
      className: `language-${string}`;
      children: string;
    };
  };
};

type SyntaxHighlighterProps = {
  language: string;
  customStyle: CSSProperties;
};

export default function CodeBlock({
  children: {
    props: { className, children },
  },
}: CodeBlockProps) {
  const language = className.replace("language-", "");

  const commons: SyntaxHighlighterProps = {
    language,
    customStyle: {
      borderRadius: "0.375rem", // rounded-md
      padding: "1rem", // p-4
    },
  };

  return (
    <div className="[&:not(:first-child)]:mt-6">
      <div className="block dark:hidden">
        <SyntaxHighlighter style={stackoverflowLight} {...commons}>
          {children}
        </SyntaxHighlighter>
      </div>

      <div className="hidden dark:block">
        <SyntaxHighlighter style={stackoverflowDark} {...commons}>
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
