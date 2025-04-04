import {auth, getTasks} from "@/components/tasks/tasks.api.ts";
import {useEffect, useState} from "react";

export const useTasksOnce = () => {
    const [data, setData] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const authResult = await auth();
                if (!isMounted) return;

                setIsAuth(authResult);
                if (authResult) {
                    const tasks = await getTasks();
                    if (isMounted) setData(tasks);
                }
            } catch (e) {
                return { isAuth: false }
            }
        };

        fetchData();

        return () => { isMounted = false };
    }, []);

    return { data, isAuth };
};