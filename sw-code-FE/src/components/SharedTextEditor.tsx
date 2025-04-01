import {useState, useEffect, useRef} from 'react';

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
        <div className="bg-white rounded-xl border border-gray-200 h-max">
            <textarea
                value={text}
                onChange={handleTextChange}
                className="w-full h-96 p-3 text-xs leading-snug font-mono border border-gray-200 rounded-lg
              focus:ring-1 focus:ring-gray-500 focus:border-gray-500
              hover:border-gray-300 transition-colors duration-200
              resize-none bg-white text-gray-800 focus:outline-none"
                // className="w-full h-96 p-3 text-xs leading-snug font-mono border border-gray-50 rounded-lg focus:ring-amber-600 focus:border-gray-100 hover:border-gray-300 resize-none bg-gray-50 text-gray-800"
                placeholder="// Put your code..."
                spellCheck="false"
            />

            <div className="p-2 text-xs text-gray-500 flex justify-between items-center">
                <div>
                    <span className="mr-1">Room ID:</span>
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{roomId || 'не указан'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <div className={`h-2 w-2 rounded-full ${socketRef.current?.readyState === WebSocket.OPEN ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-500">{socketRef.current?.readyState === WebSocket.OPEN ? 'connected' : 'not connected'}</span>
                </div>
            </div>
        </div>
    );
};

export default SharedTextEditor;