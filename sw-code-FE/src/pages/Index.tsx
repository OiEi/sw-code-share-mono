import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SharedTextEditor from '@/components/SharedTextEditor';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRoomId = searchParams.get('roomId') || '';
  const [roomId, setRoomId] = useState<string>(initialRoomId);
  const [websocketUrl, setWebsocketUrl] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Обновляем URL при изменении roomId
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (roomId) {
      newSearchParams.set('roomId', roomId);
    } else {
      newSearchParams.delete('roomId');
    }
    setSearchParams(newSearchParams);
  }, [roomId, searchParams, setSearchParams]);

  // Формируем URL для WebSocket один раз при монтировании
  useEffect(() => {
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const dynamicWsUrlWOProtocol = `${host}/api/ws?roomId=${roomId}`;
    const dynamicWsUrl = `${wsProtocol}//${dynamicWsUrlWOProtocol}`;
    const dynamicHttpUrl = `${window.location.protocol}//${host}?roomId=${roomId}`;
    setWebsocketUrl(dynamicWsUrl);
    setLink(dynamicHttpUrl);
  }, [roomId]);

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Отключено",
      description: "Соединение закрыто",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">НЕ Rusky Lingo Buddy - Совместное редактирование</h1>
        
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-sm text-gray-600">Комната: <span className="font-medium">{roomId || 'общая комната'}</span></p>
            <p className="text-sm text-gray-600">WebSocket URL: <span className="font-medium">{websocketUrl}</span></p>
            <CopyButton textToCopy={link} />
          </div>
          <Button
            variant="outline"
            onClick={handleDisconnect}
            disabled={!isConnected}
          >
            Отключиться
          </Button>
        </div>

        <SharedTextEditor 
          websocketUrl={websocketUrl} 
          roomId={roomId}
          onConnectionChange={setIsConnected}
          setRoomId={(roomId: string) => setRoomId(roomId)}
        />
      </div>
    </div>
  );
};

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // Fallback для HTTP
    const fallbackCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed'; // Чтобы не было прокрутки страницы
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          console.error('Не удалось скопировать текст');
        }
      } catch (err) {
        console.error('Ошибка при копировании:', err);
      } finally {
        document.body.removeChild(textarea);
      }
    };

    // Пытаемся использовать modern API, если доступно
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCopy}
      className="mt-2"
    >
      {isCopied ? 'Скопировано!' : 'Копировать URL'}
    </Button>
  );
};

export default Index;