import React, { useRef } from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner';
import { useHoverDirty } from 'react-use';
import { ArrowRightIcon } from 'components/svg/SvgIcon';

const GradientButton = ({ className = '', disabled = false, children, onClick, loading }) => {
    const buttonRef = useRef(null);
    const isHovering = useHoverDirty(buttonRef);

    return (
        <button
            ref={buttonRef}
            className={classNames(
                `relative flex items-center justify-center rounded-full group px-auto py-auto font-semibold h-11 sm:h-12 text-sm sm:text-base w-full py-2 px-6  dark:bg-gradient-button-dark bg-gradient-button hover:bg-gradient-button-hover dark:hover:bg-gradient-button-hover-dark  hover:text-white dark:hover:text-dark-dark  transition-all `,
                {
                    'bg-gray-2 dark:!bg-dark-2 !text-txtDisabled': !loading && disabled
                },
                className
            )}
            onClick={loading || disabled ? null : onClick}
            disabled={loading || disabled}
        >
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="group-hover:mr-3 transition-all">{children}</div>
                    <div className="group-hover:opacity-100 group-hover:right-3  absolute top-1/2 -translate-y-1/2 opacity-0 right-6">
                        <ArrowRightIcon color="currentColor" size={16} />
                    </div>
                </>
            )}
        </button>
    );
};

export default GradientButton;
