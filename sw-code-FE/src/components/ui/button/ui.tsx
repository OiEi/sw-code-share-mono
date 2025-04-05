import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: ReactNode;
    isLoading?: boolean;
}

export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'md',
                           fullWidth = false,
                           icon,
                           isLoading = false,
                           className = '',
                           ...props
                       }: ButtonProps) => {

    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:border-gray-400',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
        outline: 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50',
    };

    const sizeStyles = {
        sm: 'py-1.5 px-3 text-sm rounded-md',
        md: 'py-2.5 px-5 text-base rounded-lg',
        lg: 'py-3.5 px-7 text-lg rounded-xl',
    };

    return (
        <button
            className={`
        font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        inline-flex items-center justify-center gap-2
        disabled:opacity-60 disabled:cursor-not-allowed
        transform hover:-translate-y-0.5 active:translate-y-0 transition-transform
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
            {...props}
        >
            {isLoading ? (
                <span className="inline-flex items-center">
          <svg
              className="animate-spin h-5 w-5 mr-2 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Обработка...
        </span>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
};