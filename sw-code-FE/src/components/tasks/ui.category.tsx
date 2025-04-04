import {CodeSlice} from "@/components/tasks/tasks.model.ts";
import {Accordion} from "@/components/ui/accordion/ui.tsx";
import {TaskItem} from "@/components/tasks/ui.item.tsx";

interface TaskCategoryProps {
    categoryName: string;
    tasks: CodeSlice[];
}

export const TaskCategory = ({ categoryName, tasks }: TaskCategoryProps) => {
    return (
        <Accordion
            title={
                <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{categoryName}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {tasks.length} задач
                    </span>
                </div>
            }
        >
            <div className="space-y-1 pl-2">
                {tasks.map((task, index) => (
                    <TaskItem
                        key={`${categoryName}-${index}`}
                        task={task}
                    />
                ))}
            </div>
        </Accordion>
    );
};
