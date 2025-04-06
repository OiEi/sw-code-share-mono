import { useState } from 'react';
import { PeopleIcon } from '@/components/ui/icons/people-icon.tsx';
import { Tasks } from '@/components/tasks/ui.tsx';
import { useTasksOnce } from '@/components/tasks/tasks.hook.ts';
import { usePageContext } from '@/lib/hooks/useContext.ts';
import { ToolBar } from '@/components/toolbar/ui.tsx';
import { CodeEditor } from '@/components/code-editor/ui.tsx';

const Index = () => {
  const ctx = usePageContext();
  const { data, isAuth } = useTasksOnce();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderCopyButton = () => {
    if (!ctx.roomIdForCopy) {
      return null;
    }

    return (
      <button
        className={'w-fit flex items-center'}
        onClick={
          () => navigator.clipboard.writeText(
            `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomId=${ctx.roomIdForCopy}`
          )
        }
      >
                Copy link
      </button>
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPeopleCount = () => <div className={'flex gap-4 text-green-600 font-bold'}>
    <PeopleIcon/>
    {ctx.peopleCount}
  </div>;

  const renderTasks = () => {
    if (!isAuth) {
      return null;
    }

    return (
      <Tasks data={data} />
    );
  };

  const renderSidebarButton = () => {
    if (!isAuth) {
      return null;
    }

    return (
      <button
        onClick={toggleSidebar}
        className={`absolute top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all
                            ${isSidebarOpen ? 'right-[calc(50%-16px)]' : 'right-0'}`}
      >
        {isSidebarOpen ? '>' : '<'}
      </button>
    );
  };

  return (
    <div className='min-h-screen px-6 bg-gray-200'>
      <div className='max-w-full mx-auto pb-6 h-full'>
        <div className='mb-4 flex justify-between items-center bg-white px-4 py-4 rounded-b-xl'>
          <div className='w-full flex justify-between gap-2 items-center'>
            <img
              src='/smartwaylogo.svg'
              alt='Smartway Logo'
              className='h-8 w-auto'
            />
            <div className={'flex gap-12'}>
              {renderPeopleCount()}
              {renderCopyButton()}
            </div>
          </div>
        </div>

        <div className={'flex relative'}>
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-1/2' : 'w-full'}`}>
            <div className='bg-white border rounded-2xl border-gray-200 min-h-[calc(100vh-8rem)]'>
              <ToolBar/>
              <CodeEditor/>
            </div>
          </div>

          {renderSidebarButton()}

          <div
            className={`fixed top-0 rounded-l-2xl border-neutral-600 border-2 right-0 h-full bg-white shadow-lg transition-all duration-300 z-20
                            ${isSidebarOpen ? 'w-1/2 translate-x-0' : 'w-0 translate-x-full'}`}
            style={{
              marginTop: '5rem',
              height: 'calc(100vh - 5rem)'
            }}
          >
            <div className='p-4 h-full overflow-y-auto'>
              {renderTasks()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;