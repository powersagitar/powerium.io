import React, { type JSX } from 'react';

import {
  ExclamationTriangleIcon,
  HandRaisedIcon,
  InformationCircleIcon,
  LightBulbIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { CalloutBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Callout, CalloutBadge } from '../../ui/callout';
import { P } from '../../ui/typography';
import NotionBlockChildren from './NotionBlockChildren';
import NotionRichTextItems from './rich-text';

export default function NotionBlockCallout({
  callout,
}: {
  callout: CalloutBlockObjectResponse;
}) {
  const { badge, color } = ((): {
    badge: JSX.Element;
    color: 'blue' | 'green' | 'violet' | 'yellow' | 'red' | 'inherit';
  } => {
    if (callout.callout.icon?.type === 'external') {
      const iconUrl = callout.callout.icon.external.url;

      if (iconUrl.includes('info-alternate')) {
        return {
          badge: (
            <>
              <InformationCircleIcon className="mr-1 h-[1.25em] w-[1.25em]" />
              Note
            </>
          ),
          color: 'blue',
        };
      } else if (iconUrl.includes('light-bulb')) {
        return {
          badge: (
            <>
              <LightBulbIcon className="mr-1 h-[1.25em] w-[1.25em]" />
              Tip
            </>
          ),
          color: 'green',
        };
      } else if (iconUrl.includes('megaphone')) {
        return {
          badge: (
            <>
              <MegaphoneIcon className="mr-1 h-[1.25em] w-[1.25em]" />
              Important
            </>
          ),
          color: 'violet',
        };
      } else if (iconUrl.includes('warning')) {
        return {
          badge: (
            <>
              <ExclamationTriangleIcon className="mr-1 h-[1.25em] w-[1.25em]" />
              Warning
            </>
          ),
          color: 'yellow',
        };
      } else if (iconUrl.includes('hand')) {
        return {
          badge: (
            <>
              <HandRaisedIcon className="mr-1 h-[1.25em] w-[1.25em]" />
              Caution
            </>
          ),
          color: 'red',
        };
      }
    }

    return {
      badge: <></>,
      color: 'inherit',
    };
  })();

  return (
    <Callout borderColor={color}>
      <CalloutBadge color={color}>{badge}</CalloutBadge>

      <P className="not-first:mt-1">
        <NotionRichTextItems
          baseKey={callout.id}
          richText={callout.callout.rich_text}
        />
      </P>

      {callout.has_children && (
        <NotionBlockChildren>
          {{ fetching: 'automatic', blockId: callout.id }}
        </NotionBlockChildren>
      )}
    </Callout>
  );
}
