import React from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner';

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading, ...props }) => {
    const extendClass = {
        primary: 'bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white',
        red: 'text-white bg-red hover:bg-red-1',
        text: 'whitespace-nowrap px-0 text-green-3 hover:text-green-4 active:text-green-4 dark:text-green-2 dark:hover:text-green-4 dark:active:text-green-4',
        secondary: 'whitespace-nowrap bg-gray-10 hover:bg-gray-6 text-gray-15 dark:bg-dark-2 dark:hover:bg-dark-5 dark:text-gray-7',
        reset: 'whitespace-nowrap bg-dark-12 dark:bg-dark-2 hover:bg-gray-6 dark:hover:bg-dark-5 text-gray-1 dark:text-gray-7 px-4 rounded-md px-auto py-auto font-semibold h-12',
        adjust: 'dark:text-gray-7 text-gray-1 bg-gray-12 dark:bg-dark-2 hover:!text-gray-15 dark:hover:!text-gray-7'
    }[variants];

    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-md px-auto py-auto font-semibold h-11 sm:h-12 text-sm sm:text-base w-full py-3 space-x-1 duration-75',
                {
                    '!bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark': disabled && !loading,
                    'pointer-events-none': loading
                },
                extendClass,
                className
            )}
            onClick={onClick}
            disabled={loading || disabled}
        >
            {!loading ? children : <Spinner />}
        </button>
    );
};

export default Button;
