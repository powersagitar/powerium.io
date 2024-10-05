import React from 'react';

import {
  ExclamationTriangleIcon,
  HandRaisedIcon,
  InformationCircleIcon,
  LightBulbIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { CalloutBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { P, Vr } from '../CommonElements';
import { NotionRichTextItems } from './NotionRichText';

export function NotionBlockCallout({
  children,
}: {
  children: CalloutBlockObjectResponse;
}) {
  const { verticalRule, badge } = ((): {
    verticalRule: JSX.Element;
    badge: JSX.Element;
  } => {
    if (children.callout.icon?.type === 'external') {
      const iconUrl = children.callout.icon.external.url;

      const iconBaseStyles = 'mr-1 h-[1.25em] w-[1.25em]';
      const paragraphBaseStyles = 'flex font-medium items-center';

      if (iconUrl.includes('info-alternate')) {
        return {
          verticalRule: <Vr bgcolor="bg-blue-600 dark:bg-blue-500" />,
          badge: (
            <P
              className={`${paragraphBaseStyles} text-blue-600 dark:text-blue-500`}
            >
              <InformationCircleIcon className={iconBaseStyles} />
              Note
            </P>
          ),
        };
      } else if (iconUrl.includes('light-bulb')) {
        return {
          verticalRule: <Vr bgcolor="bg-green-600 dark:bg-green-500" />,
          badge: (
            <P
              className={`${paragraphBaseStyles} text-green-600 dark:text-green-500`}
            >
              <LightBulbIcon className={iconBaseStyles} />
              Tip
            </P>
          ),
        };
      } else if (iconUrl.includes('megaphone')) {
        return {
          verticalRule: <Vr bgcolor="bg-violet-600 dark:bg-violet-500" />,
          badge: (
            <P
              className={`${paragraphBaseStyles} text-violet-600 dark:text-violet-500`}
            >
              <MegaphoneIcon className={iconBaseStyles} />
              Important
            </P>
          ),
        };
      } else if (iconUrl.includes('warning')) {
        return {
          verticalRule: <Vr bgcolor="bg-yellow-600 dark:bg-yellow-500" />,
          badge: (
            <P
              className={`${paragraphBaseStyles} text-yellow-600 dark:text-yellow-500`}
            >
              <ExclamationTriangleIcon className={iconBaseStyles} />
              Warning
            </P>
          ),
        };
      } else if (iconUrl.includes('hand')) {
        return {
          verticalRule: <Vr bgcolor="bg-red-600 dark:bg-red-500" />,
          badge: (
            <P
              className={`${paragraphBaseStyles} text-red-600 dark:text-red-500`}
            >
              <HandRaisedIcon className={iconBaseStyles} />
              Caution
            </P>
          ),
        };
      }
    }

    return {
      verticalRule: <></>,
      badge: <></>,
    };
  })();

  return (
    <div className="flex mt-4">
      {verticalRule}

      <div className="mx-6">
        {badge}
        <P className="mt-2">
          <NotionRichTextItems blockId={children.id}>
            {children.callout.rich_text}
          </NotionRichTextItems>
        </P>
      </div>
    </div>
  );
}
