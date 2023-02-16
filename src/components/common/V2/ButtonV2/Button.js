import React from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner';

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading, color }) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-md px-auto py-auto font-semibold h-11 sm:h-12 text-sm sm:text-base w-full py-3',
                {
                    'bg-bgBtnV2 dark:hover:bg-bgBtnV2-dark_pressed dark:active:bg-bgBtnV2-pressed dark:disabled:bg-bgBtnV2-dark_disabled text-white':
                        variants === 'primary',
                    '!font-semibold px-0 !text-sm dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed':
                        variants === 'text',
                    'bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark': !loading && disabled,
                    'dark:!bg-dark-2 dark:hover:!bg-hover-dark dark:active:!bg-hover-dark dark:!text-txtSecondary-dark': color === 'dark'
                },
                className
            )}
            onClick={loading || disabled ? null : onClick}
            disabled={loading || disabled}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
};

export default Button;
