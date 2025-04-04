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
import {useDebouncedCallback} from "@/lib/hooks/useDebounce.ts";
import {useSearchParams} from "react-router-dom";
import {Events} from "@/components/text-editor/socket.events.ts";

interface SharedTextEditorProps {
    websocketUrl: string;
    setRoomIdForCopy: (newRoomId: string) => void;
    onConnectionChange: (connected: boolean) => void;
    setPeopleCount: (count: number) => void;
}

const SharedTextEditor = ({
                              websocketUrl,
                              setRoomIdForCopy,
                              onConnectionChange,
                              setPeopleCount
                          }: SharedTextEditorProps) => {
    const [rawText, setRawText] = useState('');
    const socketRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<number | null>(null);
    const isMountedRef = useRef(false);
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
    const [pageSettings, setPageSettings] = useState<PageSettings>({
        language: 'go',
        font: '12'
    });
    const [, setSearchParams] = useSearchParams()

    const debouncedSendText = useDebouncedCallback((text: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: Events.TextMessage,
                message: text
            }));
            console.log('Sent debounced update:', text.length, 'chars');
        }
    }, 500);

    const handleConnectWebSocket = useCallback(() => {
        if (!websocketUrl || !isMountedRef.current) return;

        console.log('Connecting to WebSocket:', websocketUrl);
        const socket = new WebSocket(websocketUrl);
        socketRef.current = socket;

        const handlePing = () => {
            pingIntervalRef.current = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({type: Events.Undefined}));
                }
            }, 25000);
        }

        const handleDisconnect = () => {
            const newSearchParams = new URLSearchParams();
            newSearchParams.set('roomId', '')
            setSearchParams(newSearchParams);

            window.location.reload()
        }

        socket.onopen = onOpen(onConnectionChange, handlePing);
        socket.onmessage = onMessage(setRoomIdForCopy, setRawText, setPeopleCount);
        socket.onclose = onClose(onConnectionChange, pingIntervalRef, () => handleDisconnect());
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
        setRawText(text);
        debouncedSendText(text)
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
        <div className="bg-white border rounded-2xl border-gray-200 min-h-[calc(100vh-8rem)]">
            <ToolBar
                currentTheme={currentTheme}
                pageSettings={pageSettings}
                setPageSettings={setPageSettings}
                setCurrentTheme={setCurrentTheme}
            />
            <Editor
                className={`min-h-[calc(100vh-8rem)] ${currentTheme.editorBg} ${currentTheme.editorText} prism-${currentTheme.value}`}
                value={rawText}
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