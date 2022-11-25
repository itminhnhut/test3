import React from 'react';

const TickFbIcon = ({ size = 16, color = '#0068FF' }) => (
    <svg
        style={{ minWidth: `${size}px` }}
        className="rounded-full"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_17002_6765)">
            <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#0068FF" />
            <g mask="url(#mask0_17002_6765)">
                <path
                    d="M16.3942 10.7016C16.3942 10.3605 16.3654 10.0264 16.3108 9.70145L11.3315 5L9.59204 5.59527L8.53158 7.81608L5.72764 5L4.79128 5.59527L4 11.5L10.0616 16.4516C10.2995 16.4834 10.542 16.5 10.7883 16.5C13.8843 16.5 16.3942 13.904 16.3942 10.7016Z"
                    fill="#4591FF"
                />
            </g>
            <path
                d="M11.3291 5V11.5737H9.95783V7.64887L8.40241 11.4638H6.92643L5.37125 7.66353V11.4638H4V5H5.763L7.66336 9.64427L9.5571 5H11.3291Z"
                fill="#F6F6F6"
            />
            <path d="M11.3296 5V11.5737H9.95833V7.64887L8.40291 11.4638H7.66504V9.64144L9.5576 5H11.3296Z" fill="#D8E3F1" />
        </g>
        <defs>
            <clipPath id="clip0_17002_6765">
                <rect width="16" height="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default TickFbIcon;
