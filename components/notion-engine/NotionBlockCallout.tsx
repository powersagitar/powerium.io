import React, { type JSX } from 'react';

import {
  ExclamationTriangleIcon,
  HandRaisedIcon,
  InformationCircleIcon,
  LightBulbIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { CalloutBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Callout, CalloutBadge } from '../ui/callout';
import { P } from '../ui/typography';
import NotionRichTextItems from './rich-text';

export default function NotionBlockCallout({
  children,
}: {
  children: CalloutBlockObjectResponse;
}) {
  const { badge, color } = ((): {
    badge: JSX.Element;
    color: 'blue' | 'green' | 'violet' | 'yellow' | 'red' | 'inherit';
  } => {
    if (children.callout.icon?.type === 'external') {
      const iconUrl = children.callout.icon.external.url;

      if (iconUrl.includes('info-alternate')) {
        return {
          badge: (
            <>
              <InformationCircleIcon className="h-[1.25em] w-[1.25em] mr-1" />
              Note
            </>
          ),
          color: 'blue',
        };
      } else if (iconUrl.includes('light-bulb')) {
        return {
          badge: (
            <>
              <LightBulbIcon className="h-[1.25em] w-[1.25em] mr-1" />
              Tip
            </>
          ),
          color: 'green',
        };
      } else if (iconUrl.includes('megaphone')) {
        return {
          badge: (
            <>
              <MegaphoneIcon className="h-[1.25em] w-[1.25em] mr-1" />
              Important
            </>
          ),
          color: 'violet',
        };
      } else if (iconUrl.includes('warning')) {
        return {
          badge: (
            <>
              <ExclamationTriangleIcon className="h-[1.25em] w-[1.25em] mr-1" />
              Warning
            </>
          ),
          color: 'yellow',
        };
      } else if (iconUrl.includes('hand')) {
        return {
          badge: (
            <>
              <HandRaisedIcon className="h-[1.25em] w-[1.25em] mr-1" />
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

      <P className="[&:not(:first-child)]:mt-1">
        <NotionRichTextItems baseKey={children.id}>
          {children.callout.rich_text}
        </NotionRichTextItems>
      </P>
    </Callout>
  );
}
