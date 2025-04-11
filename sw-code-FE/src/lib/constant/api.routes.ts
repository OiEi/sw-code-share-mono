const apiUrl = import.meta.env.VITE_API_HOST;
const wsUrl = import.meta.env.VITE_WEBSOCKET_HOST;

export const ROUTES = {
  WS: (roomId?: string) => roomId ? `/api/ws?roomId=${roomId}` : '/auth/ws',
  GET_TASKS: '/auth/task',
  AUTH: '/auth'
};

export const getFullRoute = (url: string) => `${window.location.protocol}//${apiUrl}${url}`;
export const getFullWsRoute = (url: string) => `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${wsUrl}${url}`;