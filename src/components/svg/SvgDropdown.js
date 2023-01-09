const SvgDropDown = ({ color, size, fill }) => {
    return (
        <svg width={size || 16} height={size || 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#baehgefnfa)">
                <path d="M4.667 6.667 8 10l3.333-3.333H4.667z" fill={fill || '#000'} />
            </g>
            <defs>
                <clipPath id="baehgefnfa">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default SvgDropDown;
