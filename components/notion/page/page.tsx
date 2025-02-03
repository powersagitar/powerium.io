import TOCDesktop from '@/components/table-of-contents/desktop';

type NotionPageProps = {
  children: Readonly<React.ReactNode>;
};

export default function NotionPage({
  children: headerAndContent,
}: NotionPageProps) {
  return (
    <article className="w-full whitespace-pre-wrap">
      {headerAndContent}
      <TOCDesktop />
    </article>
  );
}
