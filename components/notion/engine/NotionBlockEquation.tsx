'use client';

import katex from 'katex';
import { useEffect, useRef } from 'react';

import { EquationBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

type NotionBlockEquationProps = {
  equation: Readonly<EquationBlockObjectResponse>;
};

export default function NotionBlockEquation({
  equation,
}: NotionBlockEquationProps) {
  const expressionRef = useRef(null);

  useEffect(() => {
    const expression = expressionRef.current;

    if (expression) {
      katex.render(equation.equation.expression, expression, {
        throwOnError: false,
        displayMode: true,
        output: 'mathml',
      });
    }
  }, [equation]);

  return <span ref={expressionRef} />;
}
