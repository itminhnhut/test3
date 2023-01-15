import React from 'react';
import classNames from 'classnames';

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick }) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-medium h-[2.75rem] sm:h-[3rem] text-sm sm:text-base w-full py-3',
                {
                    'bg-teal text-white': variants === 'primary',
                    'bg-bgButtonDisabled text-gray-5': disabled
                },
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
