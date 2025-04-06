import { createContext, MutableRefObject, useState } from 'react';
import { PageCtx } from '@/lib/context/page/context.model.ts';
import { themes } from '@/lib/theme/theme.ts';
import { PageSettings } from '@/components/toolbar/page-settings.ts';
import { handleFn } from '@/lib/types/handle.ts';
import { Theme } from '@/lib/theme/theme.type.ts';

const getCtx = (
  socket: MutableRefObject<WebSocket>,
  roomIdForCopy: string,
  rawText: string,
  peopleCount: number,
  pageSettings: PageSettings,
  setPageSetting: handleFn<PageSettings>,
  theme: Theme,
  setTheme: handleFn<Theme>,
  setPeopleCount: handleFn<number>,
  setRawText: handleFn<string>,
  sendText: handleFn<string>
): PageCtx => {
  return {
    pageSettings: pageSettings,
    socket: socket,
    theme: themes[0],
    roomIdForCopy: roomIdForCopy,
    rawText: rawText,
    peopleCount: peopleCount,
    setPageSettings: setPageSetting,
    setRawText: setRawText,
    setTheme: setTheme,
    setPeopleCount: setPeopleCount,
    sendText: sendText,
  };
};

const PageContext = createContext<PageCtx>(null);

export { getCtx, PageContext };