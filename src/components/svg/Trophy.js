import React from 'react'

const SvgTrophy = ({ size = 20, onClick, color = '#FFC632', className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} onClick={onClick}>
            <path
                d="M17.5 3.333H15v-.834a.833.833 0 0 0-.834-.833H5.833a.833.833 0 0 0-.834.833v.834H2.5a.833.833 0 0 0-.833.833v2.5c0 3.592 1.5 5.758 4.016 5.843a5.001 5.001 0 0 0 3.484 2.415v1.742H7.499v1.667h5v-1.667h-1.666v-1.742a5.008 5.008 0 0 0 3.484-2.415c2.517-.085 4.016-2.251 4.016-5.843v-2.5a.833.833 0 0 0-.834-.833zM3.332 6.666V4.999h1.666v5.692c-1.486-.627-1.666-2.942-1.666-4.025zm11.666 4.025V4.999h1.667v1.667c0 1.083-.18 3.398-1.667 4.025z"
                fill={color}
            />
        </svg>
    );
};

export default SvgTrophy