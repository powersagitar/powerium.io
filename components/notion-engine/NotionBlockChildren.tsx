'use client';

import clsx from 'clsx';
import { Fragment, type JSX, useState } from 'react';

import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  EmbedBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ImageBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import { retrieveNotionBlockChildren } from '@/lib/notion/client';

import NotionBlockBulletedListItem from './NotionBlockBulletedListItem';
import NotionBlockCallout from './NotionBlockCallout';
import NotionBlockCode from './NotionBlockCode';
import NotionBlockDivider from './NotionBlockDivider';
import NotionBlockEmbed from './NotionBlockEmbed';
import NotionBlockHeading1 from './NotionBlockHeading1';
import NotionBlockHeading2 from './NotionBlockHeading2';
import NotionBlockHeading3 from './NotionBlockHeading3';
import NotionBlockImage from './NotionBlockImage';
import NotionBlockParagraph from './NotionBlockParagraph';
import NotionBlockQuote from './NotionBlockQuote';

const defaultBlockRenderer = (type: BlockObjectResponse['type']) => {
  console.log(`${type} is not yet implemented.`);
  return null;
};

const blockRenderers: {
  [key in BlockObjectResponse['type']]: (
    block: BlockObjectResponse,
  ) => JSX.Element | null;
} = {
  heading_1: (block) => (
    <NotionBlockHeading1>
      {block as Heading1BlockObjectResponse}
    </NotionBlockHeading1>
  ),

  heading_2: (block) => (
    <NotionBlockHeading2>
      {block as Heading2BlockObjectResponse}
    </NotionBlockHeading2>
  ),

  heading_3: (block) => (
    <NotionBlockHeading3>
      {block as Heading3BlockObjectResponse}
    </NotionBlockHeading3>
  ),

  paragraph: (block) => (
    <NotionBlockParagraph>
      {block as ParagraphBlockObjectResponse}
    </NotionBlockParagraph>
  ),

  bulleted_list_item: (block) => (
    <NotionBlockBulletedListItem>
      {block as BulletedListItemBlockObjectResponse}
    </NotionBlockBulletedListItem>
  ),

  embed: (block) => (
    <NotionBlockEmbed>{block as EmbedBlockObjectResponse}</NotionBlockEmbed>
  ),

  quote: (block) => (
    <NotionBlockQuote>{block as QuoteBlockObjectResponse}</NotionBlockQuote>
  ),

  code: (block) => (
    <NotionBlockCode>{block as CodeBlockObjectResponse}</NotionBlockCode>
  ),

  divider: () => <NotionBlockDivider />,

  callout: (block) => (
    <NotionBlockCallout>
      {block as CalloutBlockObjectResponse}
    </NotionBlockCallout>
  ),

  image: (block) => (
    <NotionBlockImage image={block as ImageBlockObjectResponse} />
  ),

  synced_block: () => null,

  // unimplemented
  audio: (block) => defaultBlockRenderer(block.type),
  bookmark: (block) => defaultBlockRenderer(block.type),
  file: (block) => defaultBlockRenderer(block.type),
  pdf: (block) => defaultBlockRenderer(block.type),
  video: (block) => defaultBlockRenderer(block.type),
  table_of_contents: (block) => defaultBlockRenderer(block.type),
  toggle: (block) => defaultBlockRenderer(block.type),
  to_do: (block) => defaultBlockRenderer(block.type),
  unsupported: (block) => defaultBlockRenderer(block.type),
  equation: (block) => defaultBlockRenderer(block.type),
  numbered_list_item: (block) => defaultBlockRenderer(block.type),
  breadcrumb: (block) => defaultBlockRenderer(block.type),
  child_database: (block) => defaultBlockRenderer(block.type),
  child_page: (block) => defaultBlockRenderer(block.type),
  column: (block) => defaultBlockRenderer(block.type),
  column_list: (block) => defaultBlockRenderer(block.type),
  link_preview: (block) => defaultBlockRenderer(block.type),
  link_to_page: (block) => defaultBlockRenderer(block.type),
  table: (block) => defaultBlockRenderer(block.type),
  table_row: (block) => defaultBlockRenderer(block.type),
  template: (block) => defaultBlockRenderer(block.type),
};

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

  const renderedBlockChildren = (
    children.fetching === 'automatic'
      ? automaticBlockChildren
      : children.blockChildren
  ).map((block) => {
    return (
      <Fragment key={block.id}>
        {blockRenderers[block.type](block)}

        {block.has_children && (
          <div
            className={clsx({
              'ml-[1rem]': block.type !== 'synced_block',
            })}
          >
            <NotionBlockChildren>
              {{
                fetching: 'automatic',
                blockId: block.id,
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
      {renderedBlockChildren}
    </LazyLoader>
  ) : (
    renderedBlockChildren
  );
}
