import React from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner';

const Button = ({
    className = '',
    disabled = false,
    children,
    variants = 'primary',
    onClick,
    loading,
    color,
    ...props
}) => {
    const extendClass = {
        'primary': 'bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white',
        'red': 'text-white bg-red',
        'text': 'whitespace-nowrap px-0 text-green-3 hover:text-green-4 active:text-green-4 dark:text-green-2 dark:hover:text-green-4 dark:active:text-green-4',
        'secondary': 'whitespace-nowrap bg-gray-10 hover:bg-gray-6 text-gray-15 dark:bg-dark-2 dark:hover:bg-dark-5 dark:text-gray-7'
    }[variants];

    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-md px-auto py-auto font-semibold h-11 sm:h-12 text-sm sm:text-base w-full py-3',
                {
                    '!bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark': disabled && !loading,
                    'pointer-events-none': loading
                },
                extendClass,
                className
            )}
            onClick={loading || disabled ? null : onClick}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
};

export default Button;