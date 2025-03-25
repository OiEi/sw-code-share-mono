import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SharedTextEditor from '@/components/SharedTextEditor';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Получаем roomId из URL параметров
  const initialRoomId = searchParams.get('roomId') || '';
  const [roomId, setRoomId] = useState<string>(initialRoomId);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [websocketUrl, setWebsocketUrl] = useState<string>('');

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

  // Формируем URL для WebSocket
  useEffect(() => {
    const host = window.location.hostname;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const dynamicWsUrl = `${wsProtocol}//${host}/api/ws?roomId=${roomId || ''}`;
    setWebsocketUrl(dynamicWsUrl);
  }, [roomId]);

  const handleConnect = () => {
    if (!websocketUrl) {
      toast({
        title: "Ошибка",
        description: "Не удалось сформировать WebSocket URL",
        variant: "destructive"
      });
      return;
    }

    setIsConnected(true);
    toast({
      title: "Подключение",
      description: `Подключение к комнате: ${roomId || 'общая комната'}`,
    });
  };

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
        <h1 className="text-3xl font-bold text-center mb-8">Rusky Lingo Buddy - Совместное редактирование</h1>

        {!isConnected ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Подключение к комнате</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Идентификатор комнаты
              </label>
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Введите ID комнаты или оставьте пустым для общей комнаты"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleConnect}>
                Подключиться
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div>
              <p className="text-sm text-gray-600">Комната: <span className="font-medium">{roomId || 'общая комната'}</span></p>
              <p className="text-sm text-gray-600">WebSocket URL: <span className="font-medium">{websocketUrl}</span></p>
              <CopyButton textToCopy={websocketUrl} />
            </div>
            <Button
              variant="outline"
              onClick={handleDisconnect}
            >
              Отключиться
            </Button>
          </div>
        )}

        {isConnected && (
          <SharedTextEditor 
            websocketUrl={websocketUrl} 
            roomId={roomId} 
            setRoomId={setRoomId} 
          />
        )}
      </div>
    </div>
  );
};

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        console.error('Не удалось скопировать текст');
      });
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