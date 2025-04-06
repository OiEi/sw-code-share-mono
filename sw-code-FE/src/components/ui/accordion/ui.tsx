import { useState } from 'react';

interface AccordionProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        className={`w-full flex justify-between items-center py-3 px-4 text-left hover:bg-gray-50 transition-colors ${
          isOpen ? 'bg-gray-50' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex-1'>{title}</div>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen py-2' : 'max-h-0'
        }`}
      >
        <div className='px-4 pb-2'>{children}</div>
      </div>
    </div>
  );
};