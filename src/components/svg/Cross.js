const SvgCross = ({ color = "currentColor", size = 24, fill = "none", style, className, onClick }) => {
    return (
        <svg
            style={style}
            className={className}
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={fill}
        >
            <path d="M5 5L15 15" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15L15 5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default SvgCross;
