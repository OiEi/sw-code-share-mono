import {useState, useEffect, useRef, useCallback} from 'react';
import Editor from "react-simple-code-editor";
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/components/prism-go';
import 'prismjs/components/prism-csharp';

import '@/lib/theme/index.css'

import {ToolBar} from "@/components/toolbar/ui.tsx";

import {onClose, onError, onMessage, onOpen} from "@/components/text-editor/socket.ts";

import {Theme} from "@/lib/theme/theme.type.ts";
import {PageSettings} from "@/components/toolbar/page-settings.ts";

import {themes} from "@/lib/theme/theme.ts";

interface SharedTextEditorProps {
    websocketUrl: string;
    setRoomIdForCopy: (newRoomId: string) => void;
    onConnectionChange: (connected: boolean) => void;
}

const SharedTextEditor = ({
                              websocketUrl,
                              setRoomIdForCopy,
                              onConnectionChange,
                          }: SharedTextEditorProps) => {
    const [text, setText] = useState('');
    const socketRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<number | null>(null);
    const isMountedRef = useRef(false);

    const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

    const [pageSettings, setPageSettings] = useState<PageSettings>({
        language: 'go',
        font: '12'
    });

    const handleConnectWebSocket = useCallback(() => {
        if (!websocketUrl || !isMountedRef.current) return;

        console.log('Connecting to WebSocket:', websocketUrl);
        const socket = new WebSocket(websocketUrl);
        socketRef.current = socket;

        const handlePing = () => {
            pingIntervalRef.current = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({type: 'ping'}));
                }
            }, 25000);
        }

        socket.onopen = onOpen(onConnectionChange, handlePing);
        socket.onmessage = onMessage(setRoomIdForCopy, setText);
        socket.onclose = onClose(onConnectionChange, pingIntervalRef, handleConnectWebSocket);
        socket.onerror = onError;

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close(1000, 'Component unmounting');
            }
        };
    }, [websocketUrl, onConnectionChange]);

    useEffect(() => {
        isMountedRef.current = true;
        handleConnectWebSocket();

        return () => {
            isMountedRef.current = false;
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.close(1000, 'Component unmounting');
            }
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };
    }, [handleConnectWebSocket]);

    const handleTextChange = (text: string) => {
        setText(text);
        handleSendTextUpdate(text)
    };

    const handleSendTextUpdate = (newText: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'text_update',
                content: newText
            }));
        }
    };

    const handleHighlightCode = (code: string) => {
        switch (pageSettings.language) {
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
        <div className="bg-white border rounded-2xl border-gray-200 h-[calc(100vh-8rem)]">
            <ToolBar
                currentTheme={currentTheme}
                pageSettings={pageSettings}
                setPageSettings={setPageSettings}
                setCurrentTheme={setCurrentTheme}
            />
            <Editor
                className={`flex-1 ${currentTheme.editorBg} ${currentTheme.editorText} prism-${currentTheme.value}`}
                value={text}
                onValueChange={code => handleTextChange(code)}
                highlight={handleHighlightCode}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: Number(pageSettings.font),
                    borderBottomLeftRadius: '1rem',
                    borderBottomRightRadius: '1rem'
                }}
                textareaClassName={`focus:outline-none focus:ring-0 border-0`}
                preClassName={`border-0 focus:outline-none`}
            />
        </div>
    );
};

export default SharedTextEditor