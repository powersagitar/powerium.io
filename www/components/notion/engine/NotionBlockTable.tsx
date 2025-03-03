import { Suspense } from 'react';

import {
  TableBlockObjectResponse,
  TableRowBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildrenAll } from '@/lib/notion/server';

import { Table, Td, Th, Tr } from '../../ui/typography';
import NotionRichTextItems from './rich-text';

type NotionBlockTableProps = {
  table: TableBlockObjectResponse;
};

async function NotionBlockTableSuspended({ table }: NotionBlockTableProps) {
  const rows = (await retrieveNotionBlockChildrenAll(
    table.id,
  )) as TableRowBlockObjectResponse[];

  return (
    <Table>
      <tbody>
        {rows.map((row, rowIdx) => (
          <Tr key={row.id}>
            {row.table_row.cells.map((richTextCell, cellIdx) => {
              const key = `${row.id}-${cellIdx}`;

              const cell = (
                <NotionRichTextItems
                  baseKey={`${row.id}-${cellIdx}`}
                  richText={richTextCell}
                />
              );

              const isColHeader = table.table.has_column_header && rowIdx === 0;

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
  );
}

export default function NotionBlockTable({ table }: NotionBlockTableProps) {
  // TODO: fallback to be implemented
  return (
    <Suspense fallback={<>Loading...</>}>
      <NotionBlockTableSuspended table={table} />
    </Suspense>
  );
}
