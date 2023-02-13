import React from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner'

const Button = ({ className = '', disabled = false, children, variants = 'primary', onClick, loading }) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-semibold h-[2.75rem] sm:h-[3rem] text-sm sm:text-base w-full py-3 disabled:cursor-default',
                {
                    'bg-teal text-white': variants === 'primary',
                    '!bg-dark-2 !text-txtDisabled': !loading && disabled,
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
