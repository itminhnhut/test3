import React from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner'

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading }) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-medium h-[2.75rem] sm:h-[3rem] text-sm sm:text-base w-full py-3',
                {
                    'dark:bg-bgBtnV2 dark:hover:bg-bgBtnV2-dark_pressed dark:active:bg-bgBtnV2-pressed dark:disabled:bg-bgBtnV2-dark_disabled text-white':
                        variants === 'primary',
                    '!font-semibold px-0 !text-sm dark:text-txtTextBtn-dark dark:hover:text-txtTextBtn-dark_pressed dark:active:text-txtTextBtn-dark_pressed':
                        variants === 'text',
                    'bg-gray-2 dark:!bg-dark-2 !text-txtDisabled': !loading && disabled
                },
                className
            )}
            onClick={(loading || disabled) ? null : onClick}
            disabled={loading || disabled}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
};

export default Button;
