import classNames from 'classnames';
import React from 'react';

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={classNames('p-6 bg-white dark:bg-transparent border border-transparent dark:border-divider-dark w-full rounded-xl', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
