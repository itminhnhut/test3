import classNames from 'classnames';
import React from 'react';

function ResizeHandleArea({ className, ...props }) {
    return (
        <span
            className={classNames(
                'z-[1] after:border-b-2 after:border-r-2 dark:after:border-[#718096] after:border-[#7B8CB2] react-resizable-handle react-resizable-handle-se opacity-0 group-hover:opacity-100',
                className
            )}
            {...props}
        />
    );
}

export default ResizeHandleArea;
