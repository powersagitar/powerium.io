'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type LastEditedContextValue = {
  lastEdited: string | null;
  setLastEdited: (date: string | null) => void;
};

const LastEditedContext = createContext<LastEditedContextValue>({
  lastEdited: null,
  setLastEdited: () => {},
});

export function LastEditedProvider({ children }: { children: ReactNode }) {
  const [lastEdited, setLastEdited] = useState<string | null>(null);
  return (
    <LastEditedContext.Provider value={{ lastEdited, setLastEdited }}>
      {children}
    </LastEditedContext.Provider>
  );
}

export function useLastEdited() {
  return useContext(LastEditedContext);
}

export function LastEditedSetter({ date }: { date: string | null }) {
  const { setLastEdited } = useLastEdited();
  useEffect(() => {
    setLastEdited(date);
    return () => setLastEdited(null);
  }, [date, setLastEdited]);
  return null;
}
