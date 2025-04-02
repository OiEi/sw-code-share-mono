import {useState, useEffect, useRef, useCallback} from 'react';
import Editor from "react-simple-code-editor";
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-go'; // Golang
import 'prismjs/components/prism-csharp'; // C#
import {SimpleSelect} from "@/components/ui/select/ui.tsx";

interface SharedTextEditorProps {
    websocketUrl: string;
    initialRoomId: string;
    setRoomIdForCopy: (newRoomId: string) => void;
    onConnectionChange: (connected: boolean) => void;
}

const SharedTextEditor = ({
                              websocketUrl,
                              initialRoomId,
                              setRoomIdForCopy,
                              onConnectionChange,
                          }: SharedTextEditorProps) => {
    const [text, setText] = useState('');
    const [currentRoomId, setCurrentRoomId] = useState(initialRoomId);
    const socketRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<number | null>(null);
    const isMountedRef = useRef(false);
    const [language, setLanguage] = useState('go');

    const languages = [
        {value: "js", label: "JavaScript"},
        {value: "go", label: "Golang"},
        {value: "csharp", label: "C#"},
    ];

    // Функция подключения к WebSocket
    const connectWebSocket = useCallback(() => {
        if (!websocketUrl || !isMountedRef.current) return;

        console.log('Connecting to WebSocket:', websocketUrl);
        const socket = new WebSocket(websocketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket connected');
            onConnectionChange(true);

            // Настраиваем пинг
            pingIntervalRef.current = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({type: 'ping'}));
                }
            }, 25000);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'text_update') {
                    setText(data.content);
                }

                if (['room-updated', 'room-created'].includes(data.type)) {
                    setRoomIdForCopy(data.roomId)
                }
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            onConnectionChange(false);
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
            // Пытаемся переподключиться через 1 секунду
            setTimeout(connectWebSocket, 1000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close(1000, 'Component unmounting');
            }
        };
    }, [websocketUrl, onConnectionChange]);

    // Инициализация подключения
    useEffect(() => {
        isMountedRef.current = true;
        connectWebSocket();

        return () => {
            isMountedRef.current = false;
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.close(1000, 'Component unmounting');
            }
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };
    }, [connectWebSocket]);

    const sendTextUpdate = useCallback((newText: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'text_update',
                roomId: currentRoomId,
                content: newText
            }));
        }
    }, [currentRoomId]);

    const handleTextChange = (text: string) => {
        // const newText = e.target.value;
        setText(text);
        sendTextUpdate(text);
    };


    const highlightCode = (code: string) => {
        switch (language) {
            case 'go':
                return Prism.highlight(code, Prism.languages.go, 'go');
            case 'csharp':
                return Prism.highlight(code, Prism.languages.csharp, 'csharp');
            case 'javascript':
            default:
                return Prism.highlight(code, Prism.languages.javascript, 'javascript');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 h-max">
            <SimpleSelect
                options={languages}
                defaultValue={language}
                onChange={(value) => setLanguage(value)}
            />
            <Editor
                className="h-96 overflow-scroll bg-gray-50 rounded-lg"
                value={text}
                onValueChange={code => handleTextChange(code)}
                highlight={highlightCode}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    backgroundColor: 'transparent',
                }}
                textareaClassName="focus:outline-none focus:ring-0 border-0 overflow-scroll"
                preClassName="border-0 focus:outline-none"
            />
        </div>
    );
};

export default SharedTextEditor