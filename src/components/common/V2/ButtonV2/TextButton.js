import React from 'react';
import classNames from 'classnames';

const TextButton = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading }) => {
    return (
        <button
            className={classNames(
                'flex whitespace-nowrap items-center justify-center rounded-md font-semibold text-base w-full py-3 px-6',
                {
                    'px-0 text-sm dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed':
                        variants === 'primary',
                    'text-gray-5/[0.1]': disabled
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

export default TextButton;
