import { useSearchParams } from 'react-router-dom';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { getFullWsRoute, ROUTES } from '@/lib/constant/api.routes.ts';
import { PageSettings } from '@/components/toolbar/page-settings.ts';
import { Theme } from '@/lib/theme/theme.type.ts';
import { themes } from '@/lib/theme/theme.ts';
import { useWebsocket } from '@/lib/hooks/socket/useWebsocket.ts';
import { useDebouncedCallback } from '@/lib/hooks/useDebounce.ts';
import { Events } from '@/lib/hooks/socket/socket.events.ts';
import { PageContext } from '@/lib/context/page/context.ts';
import { PageCtx } from '@/lib/context/page/context.model.ts';
import { resizeText } from '@/lib/strings/formatText';

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
  const [theme, setTheme] = useState<Theme>({ ...themes[0] });

  const { socketRef } = useWebsocket(
    websocketUrl,
    useCallback((id: string) => setRoomIdForCopy(id), []),
    useCallback((text: string) => setRawText(resizeText(text)), []),
    useCallback((count: number) => setPeopleCount(count), [])
  );

  const sendText = useDebouncedCallback((text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: Events.TextMessage,
        message: resizeText(text)
      }));
    }
  }, 500);

  const stableSetters = useMemo(() => ({
    setPageSettings,
    setTheme: (newTheme: Theme) => {
      console.log('Updating theme to:', newTheme);
      setTheme({ ...newTheme });
    },
    setPeopleCount,
    setRawText,
    sendText
  }), [sendText]);

  const pageCtx: PageCtx = useMemo(() => ({
    ...stableSetters,
    socket: socketRef,
    roomIdForCopy,
    rawText,
    peopleCount,
    pageSettings,
    theme
  }), [
    stableSetters,
    socketRef,
    roomIdForCopy,
    rawText,
    peopleCount,
    pageSettings,
    theme
  ]);

  return (
    <PageContext.Provider value={pageCtx}>
      {children}
    </PageContext.Provider>
  );
};