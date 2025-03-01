import { NotionBlockChildren } from '@/components/notion/engine';

type NotionPageContentProps = {
  id: string;
};

export default function NotionPageContent({ id }: NotionPageContentProps) {
  // TODO: re-implement table of contents
  return <NotionBlockChildren id={id} />;
  // return <NotionPageContentClient>
  // return (
  //   <Suspense fallback={<>loading...</>}>
  //     <NotionPageContentData id={id} />
  //   </Suspense>
  // );
}
