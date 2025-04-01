import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {toast} from '@/components/ui/use-toast';
import SharedTextEditor from '@/components/SharedTextEditor';
import {useSearchParams} from 'react-router-dom';
import {SmartwayIcon} from "@/components/inons.tsx";
import {CopyIcon} from "lucide-react";

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

    useEffect(() => {
        const host = 'code-interview.smartway.today'
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
        <div className="min-h-screen px-6 bg-gray-200">
            <div className="max-w-full mx-auto">

                <div className="mb-4 flex justify-between items-center bg-white px-4 py-2 rounded-lg">
                    <div className={'w-full flex justify-between gap-2 items-center'}>
                        <img
                            src="/smartwaylogo.svg"
                            alt="Smartway Logo"
                            className="h-8 w-auto"
                        />
                        <CopyButton textToCopy={link}/>
                    </div>
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

const CopyButton = ({textToCopy}: { textToCopy: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const fallbackCopy = () => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
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
            <CopyIcon />
            {isCopied ? 'Copied!' : 'Copy room link'}
        </Button>
    );
};

export default Index;
