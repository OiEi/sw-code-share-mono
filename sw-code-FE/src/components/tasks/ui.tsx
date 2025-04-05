import {Tasks} from "@/components/tasks/tasks.model.ts";
import {TabItem} from "../ui/tabs/tabs.model";
import {Tabs} from "@/components/ui/tabs/ui.tsx";
import {TaskCategory} from "@/components/tasks/ui.category.tsx";

interface TasksProps {
    data: Tasks;
    setText: (code: string) => void;
}

export const Tasks = ({data, setText}: TasksProps) => {
    if (!data) {
        return null;
    }

    const tabs: TabItem[] = Object.entries(data).map(([language, categories]) => ({
        label: language,
        id: language,
        content: (
            <div className="space-y-2">
                {Object.entries(categories).map(([categoryName, tasks]) => (
                    <TaskCategory
                        setText={setText}
                        language={language}
                        key={`${language}-${categoryName}`}
                        categoryName={categoryName}
                        tasks={tasks}
                    />
                ))}
            </div>
        )
    }));

    return <Tabs tabs={tabs} className="h-full"/>;
};