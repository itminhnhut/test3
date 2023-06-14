import classNames from 'classnames';
import React from 'react';

const index = ({ children, className = '', variants, selected = false, disabled = false, loading = false, onClick }) => {
    const extendClass = {
        suggestion: 'border border-divider dark:border-divider-dark'
    }[variants];

    return (
        <div
            onClick={onClick}
            className={classNames(
                `rounded-md py-2 px-4 text-sm text-gray-1 dark:text-gray-7 hover:text-gray-15 dark:hover:text-gray-4 hover:cursor-pointer
                bg-gray-13 dark:bg-dark-4 hover:bg-gray-6 dark:hover:bg-dark-5`,
                {
                    '!bg-teal/10 !hover:bg-teal/30 text-green-3 dark:text-green-3 hover:text-green-3 dark:hover:text-green-3 border-green-3 dark:border-green-3': selected,
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

export default index;
