const Svg = ({ color, size = 16, fill, style, className, onClick }) => {
    return (
        <svg
            style={style || undefined}
            onClick={onClick}
            className={className}
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="7" height="7" rx="2" fill="#F93636" />
            <rect y="9" width="7" height="7" rx="2" fill="#47CC85" />
            <rect x="8" width="8" height="16" rx="2" fill="#8694B3" />
        </svg>
    );
};

export default Svg;
