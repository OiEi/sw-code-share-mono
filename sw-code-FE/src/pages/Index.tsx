import {useState, useEffect, useRef} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import SharedTextEditor from '@/components/SharedTextEditor';

const Index = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialRoomId = searchParams.get('roomId') || '';
    const [currentRoomId, setCurrentRoomId] = useState(initialRoomId);
    const [, setIsConnected] = useState(false);

    const roomIdForCopy = useRef('')

    useEffect(() => {
        if (currentRoomId) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('roomId', currentRoomId);
            setSearchParams(newSearchParams);
        }
    }, [currentRoomId, setSearchParams]);

    useEffect(() => {

    }, []);

    // const websocketUrl = `${
    //     window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // }//code-interview.smartway.today/api/ws?roomId=${currentRoomId || ''}`;
    const websocketUrl = `${
        window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    }//192.168.0.20:4000/api/ws?roomId=${currentRoomId || ''}`;

    const currentUrl = `${window.location.protocol}//${
        window.location.host
    }${window.location.pathname}?roomId=${roomIdForCopy.current}`;

    return (
        <div className="min-h-screen px-6 bg-gray-200">
            <div className="max-w-full mx-auto">
                <div className="mb-4 flex justify-between items-center bg-white px-4 py-2 rounded-lg">
                    <div className='w-full flex justify-between gap-2 items-center'>
                        <img
                            src="/smartwaylogo.svg"
                            alt="Smartway Logo"
                            className="h-8 w-auto"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(currentUrl)}
                        >
                            <CopyIcon className="mr-2 h-4 w-4" />
                            Copy link
                        </Button>
                    </div>
                </div>

                <SharedTextEditor
                    websocketUrl={websocketUrl}
                    initialRoomId={currentRoomId}
                    onRoomIdChange={setCurrentRoomId}
                    onConnectionChange={setIsConnected}
                 setRoomIdForCopy={(id: string) => { roomIdForCopy.current = id }}/>
            </div>
        </div>
    );
};

export default Index;