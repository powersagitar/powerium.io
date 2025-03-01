import clsx from 'clsx';
import { Fragment, type JSX, Suspense } from 'react';

import {
  AudioBlockObjectResponse,
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  EmbedBlockObjectResponse,
  EquationBlockObjectResponse,
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

import NotionBlockAudio from '@/components/notion/engine/NotionBlockAudio';
import NotionBlockBulletedListItem from '@/components/notion/engine/NotionBlockBulletedListItem';
import NotionBlockCallout from '@/components/notion/engine/NotionBlockCallout';
import NotionBlockCode from '@/components/notion/engine/NotionBlockCode';
import NotionBlockDivider from '@/components/notion/engine/NotionBlockDivider';
import NotionBlockEmbed from '@/components/notion/engine/NotionBlockEmbed';
import NotionBlockEquation from '@/components/notion/engine/NotionBlockEquation';
import NotionBlockFile from '@/components/notion/engine/NotionBlockFile';
import NotionBlockHeading1 from '@/components/notion/engine/NotionBlockHeading1';
import NotionBlockHeading2 from '@/components/notion/engine/NotionBlockHeading2';
import NotionBlockHeading3 from '@/components/notion/engine/NotionBlockHeading3';
import NotionBlockImage from '@/components/notion/engine/NotionBlockImage';
import NotionBlockNumberedListItem from '@/components/notion/engine/NotionBlockNumberedListItem';
import NotionBlockParagraph from '@/components/notion/engine/NotionBlockParagraph';
import NotionBlockQuote from '@/components/notion/engine/NotionBlockQuote';
import NotionBlockTable from '@/components/notion/engine/NotionBlockTable';
import NotionBlockVideo from '@/components/notion/engine/NotionBlockVideo';
import { retrieveNotionBlockChildrenAll } from '@/lib/notion/server';

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
    <NotionBlockHeading1 heading={block as Heading1BlockObjectResponse} />
  ),

  heading_2: (block) => (
    <NotionBlockHeading2 heading={block as Heading2BlockObjectResponse} />
  ),

  heading_3: (block) => (
    <NotionBlockHeading3 heading={block as Heading3BlockObjectResponse} />
  ),

  paragraph: (block) => (
    <NotionBlockParagraph paragraph={block as ParagraphBlockObjectResponse} />
  ),

  bulleted_list_item: (block) => (
    <NotionBlockBulletedListItem
      bulletedListItem={block as BulletedListItemBlockObjectResponse}
    />
  ),

  embed: (block) => (
    <NotionBlockEmbed embed={block as EmbedBlockObjectResponse} />
  ),

  quote: (block) => (
    <NotionBlockQuote quote={block as QuoteBlockObjectResponse} />
  ),

  code: (block) => <NotionBlockCode code={block as CodeBlockObjectResponse} />,

  divider: () => <NotionBlockDivider />,

  callout: (block) => (
    <NotionBlockCallout callout={block as CalloutBlockObjectResponse} />
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

  equation: (block) => (
    <NotionBlockEquation equation={block as EquationBlockObjectResponse} />
  ),

  table_row: () => null,

  table_of_contents: () => null,

  // unimplemented
  bookmark: (block) => defaultBlockRenderer(block.type),
  pdf: (block) => defaultBlockRenderer(block.type),
  toggle: (block) => defaultBlockRenderer(block.type),
  to_do: (block) => defaultBlockRenderer(block.type),
  unsupported: (block) => defaultBlockRenderer(block.type),
  breadcrumb: (block) => defaultBlockRenderer(block.type),
  child_database: (block) => defaultBlockRenderer(block.type),
  child_page: (block) => defaultBlockRenderer(block.type),
  column: (block) => defaultBlockRenderer(block.type),
  column_list: (block) => defaultBlockRenderer(block.type),
  link_preview: (block) => defaultBlockRenderer(block.type),
  link_to_page: (block) => defaultBlockRenderer(block.type),
  template: (block) => defaultBlockRenderer(block.type),
};
const noFetchChildren = new Set<BlockObjectResponse['type']>([
  'callout',
  'table',
]);

type NotionBlockChildrenProps = {
  id: string;
};

async function NotionBlockChildrenSuspended({ id }: NotionBlockChildrenProps) {
  const blockChildren = await retrieveNotionBlockChildrenAll(id);

  return blockChildren.map((block) => (
    <Fragment key={block.id}>
      {blockRenderers[block.type](block)}

      {block.has_children && !noFetchChildren.has(block.type) && (
        <div
          className={clsx({
            'ml-[1rem]': block.type !== 'synced_block',
          })}
        >
          <NotionBlockChildren id={block.id} />
        </div>
      )}
    </Fragment>
  ));
}

export default function NotionBlockChildren({ id }: NotionBlockChildrenProps) {
  // TODO: fallback to be implemented
  return (
    <Suspense fallback={<>Loading...</>}>
      <NotionBlockChildrenSuspended id={id} />
    </Suspense>
  );
}
