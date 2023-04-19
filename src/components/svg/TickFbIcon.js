import React from 'react';

const TickFbIcon = ({ size = 16, color = '#0068FF' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: `${size}px` }}
        className="rounded-full"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <g clip-path="url(#rbw97vp9aa)">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="#19A65B" />
            <g mask="url(#5kh0v69a7b)">
                <path
                    d="M16.394 10.702c0-.341-.029-.676-.083-1L11.33 5l-1.739.595-1.06 2.221L5.728 5l-.937.595L4 11.5l6.062 4.952c.238.031.48.048.726.048 3.096 0 5.606-2.596 5.606-5.798z"
                    fill="#7EE6AE"
                />
            </g>
            <path d="M11.33 5v6.574H9.957V7.649l-1.556 3.815H6.926l-1.555-3.8v3.8H4V5h1.763l1.9 4.644L9.557 5h1.772z" fill="#fff" />
            <path d="M11.329 5v6.574H9.957V7.649l-1.555 3.815h-.738V9.64L9.557 5h1.772z" fill="#47CC85" fill-opacity=".1" />
        </g>
        <defs>
            <clipPath id="rbw97vp9aa">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default TickFbIcon;
