import dateFormat from 'dateformat';
import fromnow from 'fromnow';

import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NotionDateMentionProps = {
  mention: MentionRichTextItemResponse;
};

export default function NotionDateMention({ mention }: NotionDateMentionProps) {
  if (mention.mention.type !== 'date') {
    console.error('Non-date mention passed to DateMention');
    return <>Non-date mention passed to DateMention</>;
  }

  const date = mention.mention.date;
  const startDate = dateFormat(date.start, 'mediumDate', true);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="text-muted-foreground">
          {startDate}
        </TooltipTrigger>
        <TooltipContent>
          {fromnow(startDate, { and: true, suffix: true })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
