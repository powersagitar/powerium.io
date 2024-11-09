import { useState } from 'react';

import {
  TableBlockObjectResponse,
  TableRowBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildren } from '@/lib/notion/client';

import LazyLoader from '../LazyLoader';
import { Table, Td, Tr } from '../ui/typography';
import { NotionRichTextItems } from './NotionRichText';

export default function NotionBlockTable({
  table,
}: {
  table: TableBlockObjectResponse;
}) {
  const [rows, setRows] = useState<TableRowBlockObjectResponse[]>([]);
  const [startCursor, setStartCursor] = useState<string | null | undefined>(
    undefined,
  );
  const [lazyLoaderId, setLazyLoaderId] = useState(0);

  const cells = rows.map((row) => (
    <Tr key={row.id}>
      {row.table_row.cells.map((cell, cellIdx) => (
        <Td key={`${row.id}-${cellIdx}`}>
          <NotionRichTextItems blockId={`${row.id}-${cellIdx}`}>
            {cell}
          </NotionRichTextItems>
        </Td>
      ))}
    </Tr>
  ));

  // todo: MARK: Implement table with column and row headers
  return (
    <LazyLoader
      load={() => {
        retrieveNotionBlockChildren(table.id, startCursor).then((response) => {
          setStartCursor(response.next_cursor);
          setRows([
            ...rows,
            ...(response.results as TableRowBlockObjectResponse[]),
          ]);

          if (response.next_cursor !== null) {
            setLazyLoaderId(lazyLoaderId + 1);
          }
        });
      }}
      id={lazyLoaderId}
    >
      <Table>
        <tbody>{...cells}</tbody>
      </Table>
    </LazyLoader>
  );
}
