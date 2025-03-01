// 'use client';
//
// import { useContext, useEffect } from 'react';
//
// import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
//
// import { NotionHeadingsContext } from '@/components/contexts/notion-headings';
// import { NotionBlockChildren } from '@/components/notion/engine';
//
// type NotionPageClientProps = {
//   id: string;
// };
//
// export default function NotionPageContentClient({ id }: NotionPageClientProps) {
//   const { setNotionHeadings } = useContext(NotionHeadingsContext);
//
//   useEffect(
//     () =>
//       setNotionHeadings(
//         pageChildren.filter(
//           (block) =>
//             block.type === 'heading_1' ||
//             block.type === 'heading_2' ||
//             block.type === 'heading_3',
//         ),
//       ),
//     [pageChildren, setNotionHeadings],
//   );
//
//   return (
//     <NotionBlockChildren>
//       {{
//         fetching: 'manual',
//         blockChildren: pageChildren,
//       }}
//     </NotionBlockChildren>
//   );
// }
