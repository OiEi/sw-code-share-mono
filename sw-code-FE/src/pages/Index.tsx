import {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'react-router-dom';
import {CopyIcon} from 'lucide-react';
import SharedTextEditor from "@/components/text-editor/ui.tsx";

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

    const websocketUrl = `${
        window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    }//code-interview.smartway.today/api/ws?roomId=${currentRoomId || ''}`;

    const renderCopyButton = () => {
        if (!roomIdForCopy.current) {
            return null;
        }

        return (
            <button
                className={'w-fit flex items-center'}
                onClick={
                    () => navigator.clipboard.writeText(
                        `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomId=${roomIdForCopy.current}`
                    )
                }
            >
                <CopyIcon className="mr-2 h-4 w-4"/>
                Copy link
            </button>
        )
    }

    return (
        <div className="min-h-screen px-6 bg-gray-200">
            <div className="max-w-full mx-auto pb-6">
                <div className="mb-4 flex justify-between items-center bg-white px-4 py-4 rounded-b-xl">
                    <div className='w-full flex justify-between gap-2 items-center'>
                        <img
                            src="/smartwaylogo.svg"
                            alt="Smartway Logo"
                            className="h-8 w-auto"
                        />
                        {renderCopyButton()}
                    </div>
                </div>

                <SharedTextEditor
                    websocketUrl={websocketUrl}
                    onConnectionChange={setIsConnected}
                    setRoomIdForCopy={(id: string) => {
                        roomIdForCopy.current = id
                    }}/>
            </div>
        </div>
    );
};

export default Index;