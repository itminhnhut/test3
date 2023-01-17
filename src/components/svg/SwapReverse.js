const SwapReverse = ({ size, color, bgColor }) => {
    return (
        <svg width={size ? size : 24} height={size ? size : 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#0dcfa1hmna)">
                <path fill={bgColor ? bgColor : 'undefined'} d="M0 24V0h24v24z" />
                <path d="M8 2 4 6h3v15h2V6h3L8 2zM16 22l4-4h-3V3h-2v15h-3l4 4z" fill={color ? color : '#47CC85'} />
            </g>
            <defs>
                <clipPath id="0dcfa1hmna">
                    <path fill="#fff" transform="rotate(-90 12 12)" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default SwapReverse;
