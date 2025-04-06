const apiUrl = import.meta.env.VITE_API_HOST;

export const ROUTES = {
  WS: (roomId?: string) => `/api/ws?roomId=${roomId || ''}`,
  GET_TASKS: '/auth/task',
  AUTH: '/auth'
};

export const getFullRoute = (url: string) => `${window.location.protocol}//${apiUrl}${url}`;
export const getFullWsRoute = (url: string) => `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${apiUrl}${url}`;