import React, { useRef } from 'react';
import classNames from 'classnames';
import Spinner from 'components/svg/Spinner';
import { useHoverDirty } from 'react-use';

const GradientButton = ({ className = '', disabled = false, children, onClick, loading }) => {
    const buttonRef = useRef(null);
    const isHovering = useHoverDirty(buttonRef);

    return (
        <button
            ref={buttonRef}
            className={classNames(
                `flex items-center justify-center rounded-full px-auto py-auto font-semibold h-11 sm:h-12 text-sm sm:text-base w-full py-2 px-6 ${
                    isHovering ? 'bg-white' : 'dark:bg-gradient-button-dark bg-gradient-button '
                }   transition `,
                {
                    'bg-gray-2 dark:!bg-dark-2 !text-txtDisabled': !loading && disabled
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

export default GradientButton;
