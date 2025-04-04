import {Tasks} from "@/components/tasks/tasks.model.ts";
import {getFullRoute, getFullWsRoute, ROUTES} from "@/lib/constant/api.routes.ts";

export const getTasks = async (): Promise<Tasks> => {
    const response = await fetch<Tasks>(getFullRoute(ROUTES.GET_TASKS));
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json<Tasks>();
}
export const auth = async () => {
    const response = await fetch(getFullRoute(ROUTES.AUTH));
    return response.ok
}