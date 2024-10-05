'use client';

import { Fragment, useState } from 'react';

import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  EmbedBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildren } from '@/app/lib/notion/client';

import LazyLoader from '../LazyLoader';
import { NotionBlockBulletedListItem } from './NotionBlockBulletedListItem';
import { NotionBlockCallout } from './NotionBlockCallout';
import { NotionBlockCode } from './NotionBlockCode';
import { NotionBlockDivider } from './NotionBlockDivider';
import { NotionBlockEmbed } from './NotionBlockEmbed';
import { NotionBlockHeading1 } from './NotionBlockHeading1';
import { NotionBlockHeading2 } from './NotionBlockHeading2';
import { NotionBlockHeading3 } from './NotionBlockHeading3';
import { NotionBlockParagraph } from './NotionBlockParagraph';
import { NotionBlockQuote } from './NotionBlockQuote';

export default function NotionBlockChildren({
  children,
}: {
  children:
    | {
        fetching: 'automatic';
        blockId: string;
      }
    | {
        fetching: 'manual';
        blockChildren: BlockObjectResponse[];
      };
}) {
  const [automaticBlockChildren, setAutomaticBlockChildren] = useState<
    BlockObjectResponse[]
  >([]);

  const [automaticStartCursor, setAutomaticStartCursor] = useState<
    string | null | undefined
  >(undefined);

  const blockChildrenJsx = (
    children.fetching === 'automatic'
      ? automaticBlockChildren
      : children.blockChildren
  ).map((childBlock) => {
    let element = <></>;

    switch (childBlock.type) {
      case 'heading_1':
        element = (
          <>
            {element}
            <NotionBlockHeading1>
              {childBlock as Heading1BlockObjectResponse}
            </NotionBlockHeading1>
          </>
        );
        break;

      case 'heading_2':
        element = (
          <>
            {element}
            <NotionBlockHeading2>
              {childBlock as Heading2BlockObjectResponse}
            </NotionBlockHeading2>
          </>
        );
        break;

      case 'heading_3':
        element = (
          <>
            {element}
            <NotionBlockHeading3>
              {childBlock as Heading3BlockObjectResponse}
            </NotionBlockHeading3>
          </>
        );
        break;

      case 'paragraph':
        element = (
          <>
            {element}
            <NotionBlockParagraph>
              {childBlock as ParagraphBlockObjectResponse}
            </NotionBlockParagraph>
          </>
        );
        break;

      case 'bulleted_list_item':
        element = (
          <>
            {element}
            <NotionBlockBulletedListItem>
              {childBlock as BulletedListItemBlockObjectResponse}
            </NotionBlockBulletedListItem>
          </>
        );
        break;

      case 'embed':
        element = (
          <>
            {element}
            <NotionBlockEmbed>
              {childBlock as EmbedBlockObjectResponse}
            </NotionBlockEmbed>
          </>
        );
        break;

      case 'quote':
        element = (
          <>
            {element}
            <NotionBlockQuote>
              {childBlock as QuoteBlockObjectResponse}
            </NotionBlockQuote>
          </>
        );
        break;

      case 'code':
        element = (
          <>
            {element}
            <NotionBlockCode>
              {childBlock as CodeBlockObjectResponse}
            </NotionBlockCode>
          </>
        );
        break;

      case 'divider':
        element = (
          <>
            {element}
            <NotionBlockDivider />
          </>
        );
        break;

      case 'callout':
        element = (
          <>
            {element}
            <NotionBlockCallout>
              {childBlock as CalloutBlockObjectResponse}
            </NotionBlockCallout>
          </>
        );
        break;

      default:
        console.log(`Unimplemented block type: ${childBlock.type}`);
        break;
    }

    return (
      <Fragment key={childBlock.id}>
        {element}
        {childBlock.has_children && (
          <div className="ml-[1rem]">
            <NotionBlockChildren>
              {{
                fetching: 'automatic',
                blockId: childBlock.id,
              }}
            </NotionBlockChildren>
          </div>
        )}
      </Fragment>
    );
  });

  const [lazyLoaderId, setLazyLoaderId] = useState(0);

  return children.fetching === 'automatic' ? (
    <LazyLoader
      load={() => {
        retrieveNotionBlockChildren(
          children.blockId,
          automaticStartCursor,
        ).then((listBlockChildrenResponse) => {
          setAutomaticStartCursor(listBlockChildrenResponse.next_cursor);
          setAutomaticBlockChildren([
            ...automaticBlockChildren,
            ...(listBlockChildrenResponse.results as BlockObjectResponse[]),
          ]);

          if (listBlockChildrenResponse.next_cursor !== null) {
            setLazyLoaderId(lazyLoaderId + 1);
          }
        });
      }}
      id={lazyLoaderId}
    >
      {blockChildrenJsx}
    </LazyLoader>
  ) : (
    blockChildrenJsx
  );
}
