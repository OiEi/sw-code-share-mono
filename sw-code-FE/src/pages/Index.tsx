import {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'react-router-dom';
import SharedTextEditor from "@/components/text-editor/ui.tsx";
import {PeopleIcon} from "@/components/ui/icons/people-icon.tsx";
import * as process from "process";
import {getFullWsRoute, ROUTES} from "@/lib/constant/api.routes.ts";
import {useTasks, useTasksOnce} from "@/components/tasks/tasks.query.ts";

const Index = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialRoomId = searchParams.get('roomId') || '';
    const [currentRoomId, setCurrentRoomId] = useState(initialRoomId);
    const [, setIsConnected] = useState(false);
    const [peopleCount, setPeopleCount] = useState(0)

    const roomIdForCopy = useRef('')

    const { data, isLoading, isAuth } = useTasksOnce();

    useEffect(() => {
        if (currentRoomId) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('roomId', currentRoomId);
            setSearchParams(newSearchParams);
        }
    }, [currentRoomId, setSearchParams]);

    const websocketUrl = getFullWsRoute(ROUTES.WS(currentRoomId));

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
                {/*<CopyIcon className="mr-2 h-4 w-4"/>*/}
                Copy link
            </button>
        )
    }

    const renderPeopleCount = () => <div className={'flex gap-4 text-green-600 font-bold'}>
        <PeopleIcon />
        {peopleCount}
    </div>

    return (
        <div className="min-h-screen px-6 bg-gray-200">
            <div className="max-w-full mx-auto pb-6 h-full">
                <div className="mb-4 flex justify-between items-center bg-white px-4 py-4 rounded-b-xl">
                    <div className='w-full flex justify-between gap-2 items-center'>
                        <img
                            src="/smartwaylogo.svg"
                            alt="Smartway Logo"
                            className="h-8 w-auto"
                        />
                        <div className={'flex gap-12'}>
                            {renderPeopleCount()}
                            {renderCopyButton()}
                        </div>
                    </div>
                </div>

                <SharedTextEditor
                    websocketUrl={websocketUrl}
                    onConnectionChange={setIsConnected}
                    setRoomIdForCopy={(id: string) => {
                        roomIdForCopy.current = id
                    }}
                    setPeopleCount={count => { setPeopleCount(count) }}
                />
                {data}
            </div>
        </div>
    );
};

export default Index;