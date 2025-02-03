import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NotionUserMentionProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionUserMention({ mention }: NotionUserMentionProps) {
  if (mention.mention.type !== 'user') {
    console.error('Non-user mention passed to NotionUserMention');
    return <>Non-user mention passed to NotionUserMention</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="text-muted-foreground">@user</TooltipTrigger>
        <TooltipContent>details redacted for privacy</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
