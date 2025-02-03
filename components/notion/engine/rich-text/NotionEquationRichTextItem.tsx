'use client';

import katex from 'katex';
import { useEffect, useRef } from 'react';

import { EquationRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

type NotionEquationRichTextItemProps = {
  equation: EquationRichTextItemResponse;
};

export default function NotionEquationRichTextItem({
  equation,
}: NotionEquationRichTextItemProps) {
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
