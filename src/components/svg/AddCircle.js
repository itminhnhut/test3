import React from 'react';

const AddCircle = ({ color = '#47CC85', size = 12, ...props }) => {
    return (
        <svg {...props} width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#d7w37kxo2a)">
                <path d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm2.5 5.5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z" fill={color} />
            </g>
            <defs>
                <clipPath id="d7w37kxo2a">
                    <path fill="#fff" d="M0 0h12v12H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default AddCircle;
