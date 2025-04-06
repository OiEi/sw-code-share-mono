import { PageContext } from '@/lib/context/page/context.ts';
import { useContext } from 'react';

export const usePageContext = () => {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error('useAppContext must be init');
  }

  return context;
};