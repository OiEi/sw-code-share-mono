import { useWebsocket } from '@/lib/hooks/socket/useWebsocket.ts';
import { getFullWsRoute, ROUTES } from '@/lib/constant/api.routes.ts';
import { useSearchParams } from 'react-router-dom';
import { ReactNode, useCallback, useState } from 'react';

import { PageContext, getCtx } from '@/lib/context/page/context.ts';
import { PageSettings } from '@/components/toolbar/page-settings.ts';
import { themes } from '@/lib/theme/theme.ts';
import { Theme } from '@/lib/theme/theme.type.ts';
import { useDebouncedCallback } from '@/lib/hooks/useDebounce.ts';
import { Events } from '@/lib/hooks/socket/socket.events.ts';

export const PageLayout = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const [roomIdForCopy, setRoomIdForCopy] = useState('');
  const [rawText, setRawText] = useState('');
  const [peopleCount, setPeopleCount] = useState(0);
  const websocketUrl = getFullWsRoute(ROUTES.WS(searchParams.get('roomId') || ''));
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    language: 'go',
    font: '12'
  });
  const [theme, setTheme] = useState(themes[0]);

  const { socketRef } = useWebsocket(
    websocketUrl,
    useCallback((id: string) => setRoomIdForCopy(id), []),
    useCallback((text: string) => setRawText(text), []),
    useCallback((count: number) => setPeopleCount(count), [])
  );

  const sendText = useDebouncedCallback((text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: Events.TextMessage,
        message: text
      }));
      console.log('Sent debounced update:', text.length, 'chars');
    }
  }, 500);

  const pageCtx = getCtx(
    socketRef,
    roomIdForCopy,
    rawText,
    peopleCount,
    pageSettings,
    (ps: PageSettings) => setPageSettings(ps),
    theme,
    (t: Theme) => setTheme(t),
    (c: number) => setPeopleCount(c),
    (t:string) => setRawText(t),
    sendText
  );

  return (
    <PageContext.Provider value={pageCtx}>
      {children}
    </PageContext.Provider>
  );
};