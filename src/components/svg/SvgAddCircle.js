const SvgAddCircle = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg width={size || '16'} height={size || '16'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#h6utuztika)">
                    <path
                        d="M8 1.333A6.67 6.67 0 0 0 1.333 8 6.67 6.67 0 0 0 8 14.667 6.67 6.67 0 0 0 14.667 8 6.67 6.67 0 0 0 8 1.333zm3.333 7.334H8.667v2.666H7.333V8.667H4.667V7.333h2.666V4.667h1.334v2.666h2.666v1.334z"
                        fill={color ? color : '#47CC85'}
                    />
                </g>
                <defs>
                    <clipPath id="h6utuztika">
                        <path fill="#fff" d="M0 0h16v16H0z" />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export default SvgAddCircle;
