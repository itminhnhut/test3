import classNames from 'classnames';
import React from 'react';

const Card = ({ children, className, ...props }) => {
    return (
        <div className={classNames('p-6 border-divider dark:border-divider-dark border  rounded-3xl', className)} {...props}>
            {children}
        </div>
    );
};

export default Card;
