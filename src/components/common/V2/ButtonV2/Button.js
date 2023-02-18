import React from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner';

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading, color, ...props }) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-md px-auto py-auto font-semibold h-11 sm:h-12 text-sm sm:text-base w-full py-3',
                {
                    'bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white': variants === 'primary',
                    '!bg-red': color === 'red' && !disabled,
                    'text-txtTextBtn-tonal dark:text-txtTextBtn-tonal_dark bg-bgBtnV2-tonal hover:bg-bgBtnV2-tonal_pressed active:bg-bgBtnV2-tonal_pressed dark:bg-bgBtnV2-tonal_dark dark:hover:bg-bgBtnV2-tonal_dark_pressed dark:active:bg-bgBtnV2-tonal_dark_pressed':
                        color === 'dark',
                    '!font-semibold px-0 !text-sm text-txtTextBtn hover:text-txtTextBtn-pressed active:text-txtTextBtn-pressed dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed':
                        variants === 'text',
                    '!bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark': disabled
                },
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
