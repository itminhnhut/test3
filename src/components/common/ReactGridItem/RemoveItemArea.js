import classNames from 'classnames';
import { CloseIcon } from 'components/svg/SvgIcon';
import React from 'react';

const RemoveItemArea = ({ className, ...props }) => (
    <div
        className={classNames(
            'dark:bg-dark-dark bg-white absolute cursor-pointer text-txtSecondary dark:text-txtSecondary-dark hover:text-txtPrimary transition-all dark:hover:text-txtPrimary-dark hidden group-hover:block  z-[2] rounded-full p-[1px] border border-divider dark:border-divider-dark right-[3px] top-[3px]',
            className
        )}
        {...props}
    >
        <CloseIcon color="currentColor" size={10} />
    </div>
);
export default RemoveItemArea;
