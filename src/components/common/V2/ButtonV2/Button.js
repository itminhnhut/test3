import React from 'react';
import classNames from 'classnames';

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading }) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-medium h-[2.75rem] sm:h-[3rem] text-sm sm:text-base w-full py-3',
                {
                    'bg-teal text-white': variants === 'primary',
                    'bg-gray-2 dark:bg-dark-2 text-gray-5/[0.1]': disabled
                },
                className
            )}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {children}
        </button>
    );
};

export default Button;
