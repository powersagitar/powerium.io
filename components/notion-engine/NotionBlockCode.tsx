'use client';

import highlightjs from 'highlight.js';
import { useEffect, useRef } from 'react';

import { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import '@/styles/highlightjs-theme.css';

import { Figcaption, Pre } from '../ui/CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockCode({
  children,
}: {
  children: CodeBlockObjectResponse;
}) {
  const codeRef = useRef(null);

  // This callback has to be invoked after code block is fully loaded
  // Either disable lazy loading or make sure it runs after the code block is lazy loaded
  // Current approach is to disable lazy loading for the code block
  useEffect(() => {
    if (codeRef.current) {
      highlightjs.highlightElement(codeRef.current);
    }
  }, [codeRef]);

  const languageIdentifierMap = new Map([['plain text', 'plaintext']]);

  return (
    <>
      <div className="relative">
        <span className="absolute top-[0.5em] right-[1em] font-light text-xs">
          {children.code.language}
        </span>

        <Pre>
          <code
            className={`language-${languageIdentifierMap.get(children.code.language.toLowerCase()) ?? children.code.language.toLowerCase()} rounded-2xl text-wrap [overflow-wrap:anywhere]`}
            ref={codeRef}
          >
            <NotionRichTextItems baseKey={children.id}>
              {children.code.rich_text}
            </NotionRichTextItems>
          </code>
        </Pre>
      </div>

      {children.code.caption.length > 0 && (
        <Figcaption>
          <NotionRichTextItems baseKey={children.id}>
            {children.code.caption}
          </NotionRichTextItems>
        </Figcaption>
      )}
    </>
  );
}
