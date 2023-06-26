import classNames from 'classnames';
import React from 'react';

const Card = ({ children, className, ...props }) => {
    return (
        <div {...props} className={classNames('rounded-xl p-6 md:p-8 bg-gray-12 dark:bg-bgContainer-dark', className)}>
            {children}
        </div>
    );
};

export default Card;
