import { ReactNode, useEffect } from 'react';

export default function LazyLoader({
  children,
  load,
  id,
}: {
  children: ReactNode;
  load: () => void;
  id: number;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => load(), [id]);

  return children;
}
