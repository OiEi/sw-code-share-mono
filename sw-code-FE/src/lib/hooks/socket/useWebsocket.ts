import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { handleFn } from '@/lib/types/handle.ts';
import { onClose, onError, onMessage, onOpen } from '@/lib/hooks/socket/socket.ts';
import { Events } from '@/lib/hooks/socket/socket.events.ts';

export function useWebsocket(
  websocketUrl: string,
  setRoomIdForCopy: handleFn<string>,
  setRawText: handleFn<string>,
  setPeopleCount: handleFn<number>,
) {
  const [, setSearchParams] = useSearchParams();
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number>(0);

  useEffect(() => {
    if (!websocketUrl) return;

    console.log('Connecting to WebSocket:', websocketUrl);
    const socket = new WebSocket(websocketUrl);
    socketRef.current = socket;

    const handleDisconnect = () => {
      // const newSearchParams = new URLSearchParams();
      // newSearchParams.set('roomId', '');
      // setSearchParams(newSearchParams);
      // window.location.reload();

      clearInterval(pingIntervalRef.current);
    };
    
    const handlePing =   () => {
      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: Events.PingEvent }));
        }
      }, 25000);
    };

    const handleSetRoomId = (roomId: string) => {
      setRoomIdForCopy(roomId);
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('roomId', roomId);
      setSearchParams(newSearchParams);
    };

    socket.onopen = onOpen(handlePing);
    socket.onmessage = onMessage(handleSetRoomId, setRawText, setPeopleCount);
    socket.onclose = onClose(() => handleDisconnect());
    socket.onerror = onError;

    // Cleanup функция
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []); // Зависимость только от websocketUrl

  return { socketRef };
}