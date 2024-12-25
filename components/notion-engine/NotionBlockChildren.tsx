'use client';

import clsx from 'clsx';
import { Fragment, type JSX, useState } from 'react';

import {
  AudioBlockObjectResponse,
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  EmbedBlockObjectResponse,
  FileBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ImageBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
  TableBlockObjectResponse,
  VideoBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import LazyLoader from '@/components/LazyLoader';
import NotionBlockAudio from '@/components/notion-engine/NotionBlockAudio';
import NotionBlockBulletedListItem from '@/components/notion-engine/NotionBlockBulletedListItem';
import NotionBlockCallout from '@/components/notion-engine/NotionBlockCallout';
import NotionBlockCode from '@/components/notion-engine/NotionBlockCode';
import NotionBlockDivider from '@/components/notion-engine/NotionBlockDivider';
import NotionBlockEmbed from '@/components/notion-engine/NotionBlockEmbed';
import NotionBlockFile from '@/components/notion-engine/NotionBlockFile';
import NotionBlockHeading1 from '@/components/notion-engine/NotionBlockHeading1';
import NotionBlockHeading2 from '@/components/notion-engine/NotionBlockHeading2';
import NotionBlockHeading3 from '@/components/notion-engine/NotionBlockHeading3';
import NotionBlockImage from '@/components/notion-engine/NotionBlockImage';
import NotionBlockNumberedListItem from '@/components/notion-engine/NotionBlockNumberedListItem';
import NotionBlockParagraph from '@/components/notion-engine/NotionBlockParagraph';
import NotionBlockQuote from '@/components/notion-engine/NotionBlockQuote';
import NotionBlockTable from '@/components/notion-engine/NotionBlockTable';
import NotionBlockVideo from '@/components/notion-engine/NotionBlockVideo';
import { retrieveNotionBlockChildren } from '@/lib/notion/client';

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

  numbered_list_item: (block) => (
    <NotionBlockNumberedListItem
      numberedListItem={block as NumberedListItemBlockObjectResponse}
    />
  ),

  table: (block) => (
    <NotionBlockTable table={block as TableBlockObjectResponse} />
  ),

  audio: (block) => (
    <NotionBlockAudio audio={block as AudioBlockObjectResponse} />
  ),

  video: (block) => (
    <NotionBlockVideo video={block as VideoBlockObjectResponse} />
  ),

  file: (block) => <NotionBlockFile file={block as FileBlockObjectResponse} />,

  table_row: () => null,

  table_of_contents: () => null,

  // unimplemented
  bookmark: (block) => defaultBlockRenderer(block.type),
  pdf: (block) => defaultBlockRenderer(block.type),
  toggle: (block) => defaultBlockRenderer(block.type),
  to_do: (block) => defaultBlockRenderer(block.type),
  unsupported: (block) => defaultBlockRenderer(block.type),
  equation: (block) => defaultBlockRenderer(block.type),
  breadcrumb: (block) => defaultBlockRenderer(block.type),
  child_database: (block) => defaultBlockRenderer(block.type),
  child_page: (block) => defaultBlockRenderer(block.type),
  column: (block) => defaultBlockRenderer(block.type),
  column_list: (block) => defaultBlockRenderer(block.type),
  link_preview: (block) => defaultBlockRenderer(block.type),
  link_to_page: (block) => defaultBlockRenderer(block.type),
  template: (block) => defaultBlockRenderer(block.type),
};
const noFetchChildren = new Set<BlockObjectResponse['type']>(['table']);

type NotionBlockChildrenProps = {
  children:
    | {
        fetching: 'automatic';
        blockId: string;
      }
    | {
        fetching: 'manual';
        blockChildren: BlockObjectResponse[];
      };
};

export default function NotionBlockChildren({
  children,
}: NotionBlockChildrenProps) {
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

        {block.has_children && !noFetchChildren.has(block.type) && (
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
