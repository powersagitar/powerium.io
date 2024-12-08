'use client';

import highlightjs from 'highlight.js';
import { useEffect, useRef, useState } from 'react';

import { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { CheckIcon, CopyIcon, UpdateIcon } from '@radix-ui/react-icons';

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

  const [copyIndicator, setCopyIndicator] = useState<
    'language' | 'copy' | 'copying' | 'copied'
  >('language');

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => {
          if (copyIndicator === 'language') {
            setCopyIndicator('copy');
          }
        }}
        onMouseLeave={() => {
          if (copyIndicator === 'copy') {
            setCopyIndicator('language');
          }
        }}
      >
        <span className="absolute top-[0.5em] right-[1em] font-light text-xs backdrop-blur">
          {copyIndicator === 'copy' ? (
            <button
              onClick={() => {
                setCopyIndicator('copying');
                navigator.clipboard
                  .writeText(
                    children.code.rich_text
                      .map((richText) => richText.plain_text)
                      .join(''),
                  )
                  .then(() => {
                    setCopyIndicator('copied');
                    setTimeout(() => setCopyIndicator('language'), 3000);
                  });
              }}
            >
              <CopyIcon />
            </button>
          ) : copyIndicator === 'copying' ? (
            <UpdateIcon className="animate-spin cursor-wait" />
          ) : copyIndicator === 'copied' ? (
            <CheckIcon />
          ) : (
            children.code.language
          )}
        </span>

        <Pre>
          <code
            className={`language-${languageIdentifierMap.get(children.code.language.toLowerCase()) ?? children.code.language.toLowerCase()} rounded w-full overflow-x-scroll`}
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
