const SvgChevronDown = ({ color = '#8694B3', size = 16, fill, style, className, onClick }) => {
    return (
        <svg
            onClick={onClick}
            className={`transition ease-in-out rotate-180 ${className}`}
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clip-path="url(#clip0_295_61062)">
                <path d="M11.3333 9.33337L7.99992 6.00004L4.66659 9.33337L11.3333 9.33337Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_295_61062">
                    <rect width="16" height="16" fill="white" transform="translate(16 16) rotate(-180)" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default SvgChevronDown;
