import { JSX } from 'react';

import { MentionRichTextItemResponse as SDKMentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionDateMention from './NotionDateMention';
import NotionLinkMention, {
  MentionLinkMentionResponse,
} from './NotionLinkMention';
import NotionPageMention from './NotionPageMention';
import NotionUserMention from './NotionUserMention';

type MentionRichTextItemResponse =
  | SDKMentionRichTextItemResponse
  | MentionLinkMentionResponse;

type Renderers = {
  [key in MentionRichTextItemResponse['mention']['type']]: (
    mention: MentionRichTextItemResponse,
  ) => JSX.Element;
};

const renderers: Renderers = {
  user: (mention) => (
    <NotionUserMention mention={mention as SDKMentionRichTextItemResponse} />
  ),
  link_preview: () => <>link_preview</>,
  link_mention: (mention) => (
    <NotionLinkMention mention={mention as MentionLinkMentionResponse} />
  ),
  date: (mention) => (
    <NotionDateMention mention={mention as SDKMentionRichTextItemResponse} />
  ),
  page: (mention) => (
    <NotionPageMention mention={mention as SDKMentionRichTextItemResponse} />
  ),
  database: () => <>database</>,
  template_mention: () => <>template_mention</>,
};

type NotionMentionRichTextItemProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionMentionRichTextItem({
  mention,
}: NotionMentionRichTextItemProps) {
  return renderers[mention.mention.type](mention);
}
