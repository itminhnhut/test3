import React from 'react';

const ErrorTriggers = ({ size = 16, color = '#F93636' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.334 6.667h1.333V10H7.334V6.667zm0 4h1.333V12H7.333v-1.333z" fill={color} />
            <path
                d="M9.179 2.8A1.332 1.332 0 0 0 8 2.092c-.495 0-.947.271-1.179.709L1.93 12.043c-.22.417-.207.907.036 1.312.244.404.67.645 1.142.645h9.786c.472 0 .899-.241 1.142-.645.243-.404.257-.895.036-1.312L9.18 2.8zm-6.072 9.867L8 3.425l4.896 9.242H3.107z"
                fill={color}
            />
        </svg>
    );
};

export default ErrorTriggers;
