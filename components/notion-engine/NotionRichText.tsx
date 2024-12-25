'use client';

import katex from 'katex';
import { useEffect, useRef } from 'react';

import {
  EquationRichTextItemResponse,
  RichTextItemResponse,
  TextRichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Link } from '../ui/link';
import { Code } from '../ui/typography';

export function NotionRichTextItems({
  baseKey,
  children: notionRichText,
}: {
  baseKey: string;
  children: RichTextItemResponse[];
}) {
  return (
    <>
      {notionRichText.map((richTextItem, idx) => {
        switch (richTextItem.type) {
          case 'text':
            return (
              <TextRenderer
                key={`rich-text-${baseKey}-${idx}`}
                text={richTextItem}
              />
            );

          case 'equation':
            return (
              <EquationRenderer
                key={`rich-text-${baseKey}-${idx}`}
                equation={richTextItem}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}

type TextRendererProps = {
  text: TextRichTextItemResponse;
};

function TextRenderer({ text }: TextRendererProps) {
  let element = <>{text.plain_text}</>;

  if (text.annotations.bold) {
    element = <strong>{element}</strong>;
  }

  if (text.annotations.code) {
    element = <Code>{element}</Code>;
  }

  if (text.annotations.color) {
    // TODO: not implemented
  }

  if (text.annotations.italic) {
    element = <em>{element}</em>;
  }

  if (text.annotations.strikethrough) {
    element = <s>{element}</s>;
  }

  if (text.annotations.underline) {
    element = <u>{element}</u>;
  }

  if (text.text.link) {
    element = <Link href={text.text.link.url}>{element}</Link>;
  }

  return element;
}

type EquationRendererProps = {
  equation: EquationRichTextItemResponse;
};

function EquationRenderer({ equation }: EquationRendererProps) {
  const expressionRef = useRef(null);

  useEffect(() => {
    const expression = expressionRef.current;

    if (expression) {
      katex.render(equation.equation.expression, expression, {
        throwOnError: false,
        output: 'mathml',
      });
    }
  }, [equation, expressionRef]);

  return <span ref={expressionRef} />;
}
