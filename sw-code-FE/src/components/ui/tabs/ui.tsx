import { TabItem } from '@/components/ui/tabs/tabs.model.ts';
import { useState } from 'react';

interface TabsProps {
    tabs: TabItem[];
    defaultActiveId?: string;
}

export const Tabs = ({ tabs, defaultActiveId }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultActiveId || tabs[0]?.id);

  return (
    <div className='tabs-container'>
      {/* Вкладки */}
      <div className='flex border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div className='p-4'>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};