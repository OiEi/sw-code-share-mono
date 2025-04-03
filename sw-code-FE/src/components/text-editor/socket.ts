import {OnMessageEvent} from "@/components/text-editor/socket.message.ts";
import {MutableRefObject} from "react";

export const onMessage = (setRoomId: (string) => void, setText: (string) => void) => {
    return (event) => {
        try {
            const data = JSON.parse<OnMessageEvent>(event.data);

            if (data.type === 'text_update') {
                setText(data.content);
            }

            if (['room-updated', 'room-created'].includes(data.type)) {
                setRoomId(data.roomId)
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    }
};

export const onError = (error) => {
    console.error('WebSocket error:', error);
};

export const onClose = (onConnectionChange: (bool) => void, pingIntervalRef: MutableRefObject<number>, connectWebSocket: () => (undefined | (() => void))) => {
    return () => {
        console.log('WebSocket disconnected');
        onConnectionChange(false);

        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
        }

        setTimeout(connectWebSocket, 1000);
    };
}

export const onOpen = (onConnectionChange: (bool) => void, pingFn: () => void) => {
    return () => {
        console.log('WebSocket connected');
        onConnectionChange(true);

    };
}