import React from 'react';
const TiktokFilled = ({ color = 'currentColor', size = 16, ...props }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
            <path
                d="M11.3804 0H8.6839V10.8985C8.6839 12.1971 7.64682 13.2638 6.35621 13.2638C5.06559 13.2638 4.02849 12.1971 4.02849 10.8985C4.02849 9.6232 5.04254 8.57969 6.28708 8.53333V5.79711C3.54451 5.84347 1.33203 8.09276 1.33203 10.8985C1.33203 13.7276 3.5906 16 6.37926 16C9.16788 16 11.4265 13.7044 11.4265 10.8985V5.31013C12.4405 6.05218 13.685 6.49276 14.9987 6.51596V3.77971C12.9706 3.71015 11.3804 2.04058 11.3804 0Z"
                fill={color}
            />
        </svg>
    );
};

export default TiktokFilled;
