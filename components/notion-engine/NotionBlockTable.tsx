import { useState } from 'react';

import {
  TableBlockObjectResponse,
  TableRowBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildren } from '@/lib/notion/client';

import LazyLoader from '../LazyLoader';
import { Table, Td, Th, Tr } from '../ui/typography';
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
        <tbody>
          {rows.map((row, rowIdx) => (
            <Tr key={row.id}>
              {row.table_row.cells.map((richTextCell, cellIdx) => {
                const key = `${row.id}-${cellIdx}`;

                const cell = (
                  <NotionRichTextItems baseKey={`${row.id}-${cellIdx}`}>
                    {richTextCell}
                  </NotionRichTextItems>
                );

                const isColHeader =
                  table.table.has_column_header && rowIdx === 0;

                const isRowHeader = table.table.has_row_header && cellIdx === 0;

                if (isColHeader || isRowHeader) {
                  return <Th key={key}>{cell}</Th>;
                }

                return <Td key={key}>{cell}</Td>;
              })}
            </Tr>
          ))}
        </tbody>
      </Table>
    </LazyLoader>
  );
}
