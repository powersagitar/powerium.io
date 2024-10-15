import { ReactNode, useEffect } from 'react';

export default function LazyLoader({
  children,
  load: next,
  id,
}: {
  children: ReactNode;
  load: () => void;
  id: number;
}) {
  useEffect(() => next(), [id]);

  return children;
}
