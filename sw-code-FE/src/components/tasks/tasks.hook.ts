import {auth, getTasks} from "@/components/tasks/tasks.api.ts";
import {useEffect, useState} from "react";
import {Tasks} from "@/components/tasks/tasks.model.ts";

export const useTasksOnce = (): {
    data: Tasks
    isAuth: boolean
} => {
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
                    setData(tasks);
                }
            } catch (e) {
                return { isAuth: false }
            }
        };

        fetchData();

        return () => { isMounted = false };
    }, []);

    const returnedData = data as Tasks

    return { data: returnedData, isAuth };
};