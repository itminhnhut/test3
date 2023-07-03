import classNames from 'classnames';
import React from 'react';

const Chip = ({ children, className = '', variants = 'filter', selected = false, disabled = false, loading = false, onClick, isDeepBackground = false }) => {
    const extendClass = {
        suggestion: 'border-divider dark:border-divider-dark bg-transparent',
        filter: 'bg-gray-13 dark:bg-dark-4 border-transparent'
    }[variants];

    return (
        <div
            onClick={onClick}
            className={classNames(
                `rounded-md py-2 px-4 text-sm text-gray-1 dark:text-gray-7 hover:text-gray-15 dark:hover:text-gray-4 hover:cursor-pointer
                  dark:hover:bg-dark-5 transition-all duration-75 border whitespace-nowrap`,
                {
                    'bg-gray-13 hover:bg-gray-6': !isDeepBackground,
                    'bg-white hover:bg-gray-6': isDeepBackground,
                    '!bg-teal/10 hover:!bg-teal/30 !text-green-3 dark:!text-green-3 hover:!text-green-3 dark:hover:!text-green-3 font-semibold': selected,
                    'border-green-3 dark:border-green-3': selected && variants === 'suggestion',
                    '': disabled && !loading,
                    'pointer-events-none': loading
                },
                extendClass,
                className
            )}
        >
            {children}
        </div>
    );
};

export default Chip;
