const Candles = ({ color, size, fill, style, className, onClick }) => {
    return (
        <svg
            style={style || {}}
            className={className || {}}
            onClick={() => onClick && onClick()}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clip-path="url(#clip0_5097_39963)">
                <path
                    d="M11.273 15.7148L11.273 2.21484"
                    stroke="#718096"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M4.72754 15.7148L4.72754 0.286271"
                    stroke="#718096"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect
                    x="3.25742"
                    y="3.00059"
                    width="2.94026"
                    height="10"
                    rx="0.6"
                    fill="#FBFBFB"
                    stroke="#718096"
                    strokeWidth="0.8"
                />
                <rect
                    x="9.80286"
                    y="6.08652"
                    width="2.94026"
                    height="6.91429"
                    rx="0.6"
                    fill="#FBFBFB"
                    stroke="#718096"
                    strokeWidth="0.8"
                />
            </g>
            <defs>
                <clipPath id="clip0_5097_39963">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default Candles;
