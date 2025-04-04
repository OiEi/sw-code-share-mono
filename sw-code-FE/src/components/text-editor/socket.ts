import {OnMessageEvent} from "@/components/text-editor/socket.message.ts";
import {MutableRefObject} from "react";
import {Events} from "@/components/text-editor/socket.events.ts";

export const onMessage = (
    setRoomId: (string) => void,
    setText: (string) => void,
    setPeopleCount: (number) => void
) => {
    return (event) => {
        try {
            const data = JSON.parse<OnMessageEvent>(event.data);

            if (data.type === Events.TextMessage) {
                setText(data.message);
            }

            if (data.type === Events.RoomUsersCount) {
                setPeopleCount(Number(data.message));
            }

            if ([Events.RoomCreated, Events.RoomIdUpdated].includes(data.type)) {
                setRoomId(data.message)
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    }
};

export const onError = (error) => {
    console.log(error.status);
};

export const onClose = (
    onConnectionChange: (bool) => void,
    pingIntervalRef: MutableRefObject<number>,
    onRedirect: () => void,
) => {
    return (e) => {
        console.log('WebSocket disconnected');
        onConnectionChange(false);

        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
        }

        if (e.code == 1006) {
            console.log('Socket is closed')
            // onRedirect();
        }
    };
}

export const onOpen = (onConnectionChange: (bool) => void, pingFn: () => void) => {
    return (e) => {
        console.log(e)
        console.log('WebSocket connected');
        onConnectionChange(true);
    };
}