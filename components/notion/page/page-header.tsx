type NotionNormalPageProps = {
  children: Readonly<React.ReactNode>;
  className?: string;
};

export default function NotionPageHeader({
  children,
  className,
}: NotionNormalPageProps) {
  return <header className={className}>{children}</header>;
}
