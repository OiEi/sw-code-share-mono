import { MutableRefObject } from 'react';
import { PageSettings } from '@/components/toolbar/page-settings.ts';
import { Theme } from '@/lib/theme/theme.type.ts';
import { handleFn } from '@/lib/types/handle.ts';

export type PageCtx = {
  socket: MutableRefObject<WebSocket | null>;
  pageSettings: PageSettings;
  theme: Theme;
  roomIdForCopy: string;
  rawText: string;
  peopleCount: number;
  setRawText: handleFn<string>;
  setTheme: handleFn<Theme>;
  setPageSettings: handleFn<PageSettings>
  setPeopleCount: handleFn<number>,
  sendText: handleFn<string>
}