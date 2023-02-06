import React from 'react';
import classNames from 'classnames';

const TextButton = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading }) => {
    return (
        <button
            className={classNames(
                'flex justify-center items-center whitespace-nowrap font-semibold text-sm h-[2.75rem] sm:h-[3rem] w-full py-6 bg-transparent',
                {
                    'text-teal': variants === 'primary',
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
