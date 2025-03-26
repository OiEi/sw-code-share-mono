import { useState, useEffect, useRef } from 'react';

interface SharedTextEditorProps {
  websocketUrl: string;
  roomId: string;
  onConnectionChange: (connected: boolean) => void;
  setRoomId: (roomId: string) => void;
}

const SharedTextEditor = ({ 
  websocketUrl, 
  roomId,
  onConnectionChange,
  setRoomId
}: SharedTextEditorProps) => {
  const [text, setText] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!websocketUrl) return;

    socketRef.current = new WebSocket(websocketUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket подключен');
      onConnectionChange(true);
      
      // Отправляем информацию о комнате при подключении
      socketRef.current?.send(JSON.stringify({
        type: 'join_room',
        roomId
      }));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'text_update') {
          setText(data.content);
        }
        if (data.Type === 'room-created') {
          setRoomId(data.roomId);
        }
      } catch (err) {
        console.error('Ошибка парсинга сообщения:', err);
      }
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket отключен');
      onConnectionChange(false);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      onConnectionChange(false);
    };

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [websocketUrl, roomId, onConnectionChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'text_update',
        roomId,
        content: newText
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Редактор</h2>
      <textarea
        value={text}
        onChange={handleTextChange}
        className="w-full h-64 p-4 border rounded-md resize-none"
        placeholder="Начните вводить текст..."
      />
    </div>
  );
};

export default SharedTextEditor;