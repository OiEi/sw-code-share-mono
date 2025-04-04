import {CodeSlice} from "@/components/tasks/tasks.model.ts";
import {Accordion} from "@/components/ui/accordion/ui.tsx";

interface TaskItemProps {
    task: CodeSlice;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const renderDifficulty = (color: string) => (
        <div className={`w-[8px] h-[8px] bg-${color}-500 rounded-full`}/>
    )

    return (
        <Accordion
            title={<div
                className={'flex gap-2 items-center'}>{task.name ?? task.grade} {renderDifficulty(task.color)}</div>}
        >
            <div className={'flex-col flex gap-2'}>
                <div className={'font-bold'}>{task.text}</div>
                <div className={'font-bold'}>{task.solution}</div>
            </div>
        </Accordion>
    );
}