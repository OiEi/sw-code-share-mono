import {CodeSlice} from "@/components/tasks/tasks.model.ts";
import {Accordion} from "@/components/ui/accordion/ui.tsx";
import {CodeBlock} from "@/components/code-block/ui.tsx";

interface TaskItemProps {
    task: CodeSlice;
    language?: string
}

export const TaskItem = ({task, language}: TaskItemProps) => {
    const renderDifficulty = (color: string) => {
        switch (color) {
            case 'green':
                return <div className={`w-[8px] h-[8px] bg-green-500 rounded-full`}/>
            case 'red':
                return <div className={`w-[8px] h-[8px] bg-red-500 rounded-full`}/>
            case 'yellow':
                return <div className={`w-[8px] h-[8px] bg-blue-500 rounded-full`}/>
            default:
                return <div className={`w-[8px] h-[8px] bg-blue-500 rounded-full`}/>
        }
    }

    return (
        <Accordion
            title={<div
                className={'flex gap-2 items-center'}>{task.name ?? task.grade} {renderDifficulty(task.color)}</div>}
        >
            <div className={'flex-col flex gap-2'}>
                <div className={'text-4xl font-bold'}>
                    Code
                </div>
                <CodeBlock
                    language={language}
                    code={task.text}
                />
                <div className={'text-4xl font-bold mt-4'}>
                    Solution
                </div>
                <div className={'bg-green-200 p-2 rounded-xl italic'}>
                    {task.solution}
                </div>
            </div>
        </Accordion>
    );
}