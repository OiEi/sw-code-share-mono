import process from "process";

export const ROUTES = {
    WS: (roomId?: string) => `/api/ws?roomId=${roomId || ''}`,
    GET_TASKS: `/api/task`,
    AUTH: `/auth`
}

export const getFullRoute = (url: string) => `${window.location.protocol}//${process.env.VITE_API_HOST}${url}`
export const getFullWsRoute = (url: string) => `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${process.env.VITE_API_HOST}${url}`