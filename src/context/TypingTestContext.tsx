'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTypingTest } from '@/hooks/useTypingTest';

type TypingTestContextType = ReturnType<typeof useTypingTest>;

const TypingTestContext = createContext<TypingTestContextType | null>(null);

export function TypingTestProvider({ children }: { children: ReactNode }) {
  const typingTest = useTypingTest();
  
  return (
    <TypingTestContext.Provider value={typingTest}>
      {children}
    </TypingTestContext.Provider>
  );
}

export function useTypingTestContext() {
  const context = useContext(TypingTestContext);
  if (!context) {
    throw new Error('useTypingTestContext must be used within a TypingTestProvider');
  }
  return context;
}
