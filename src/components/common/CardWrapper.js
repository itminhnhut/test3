import React from 'react';

const CardWrapper = ({ className = '', children, style = {} }) => {
    return (
        <div className={`bg-white dark:bg-dark-4 p-8 rounded-xl ${className}`} style={style}>
            {children}
        </div>
    );
};

export default CardWrapper;
