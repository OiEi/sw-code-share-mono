import {useQuery} from "@tanstack/react-query";
import {Tasks} from "@/components/tasks/tasks.model.ts";
import {getTasks} from "@/components/tasks/tasks.api.ts";

export const useTasks = (enabled: boolean) => (useQuery<Tasks>({
    queryKey: ['tasks'],
    queryFn: () => getTasks(''),
    staleTime: 60000,
    enabled: enabled,
}))