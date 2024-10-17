import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Hr, Vr } from '../ui/CommonElements';
import { NotionPageHeadingLi } from './TableOfContents';

export default function Desktop({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  const [displayTocSidebar, setDisplayTocPanel] = useState(false);

  return (
    <motion.aside className="flex fixed top-0 right-0 bottom-0 items-center z-50">
      <AnimatePresence>
        {displayTocSidebar ? (
          <div onMouseLeave={() => setDisplayTocPanel(false)}>
            <Sidebar>{notionPageHeadings}</Sidebar>
          </div>
        ) : (
          <div onMouseEnter={() => setDisplayTocPanel(true)}>
            <Hint />
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

function Hint() {
  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: -3 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 3,
        ease: 'easeInOut',
      }}
      className="flex flex-row-reverse"
    >
      <Vr />
      <p className="[writing-mode:vertical-rl] py-3 rounded-l-lg backdrop-blur">
        Table of Contents
      </p>
    </motion.div>
  );
}

function Sidebar({
  children: notionPageHeadings,
}: {
  children: (
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
  )[];
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 25 }}
      className="flex flex-col backdrop-blur-lg p-4 rounded-2xl max-w-prose max-h-[75vh]"
    >
      <h1 className="self-center font-medium">Table of Contents</h1>

      <Hr className="my-2 rounded-full" />

      <ul className="overflow-y-scroll">
        <NotionPageHeadingLi>{notionPageHeadings}</NotionPageHeadingLi>
      </ul>
    </motion.nav>
  );
}
