const ArrowDownIcon = ({ className = '', color = '#8694B3' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const TrendIcon = ({ onClick }) => (
    <svg className="cursor-pointer" onClick={onClick} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.33323 6.39073L6.66656 9.05739L2.47123 4.86206L1.52856 5.80473L6.66656 10.9427L9.33323 8.27606L12.1952 11.1381L13.1379 10.1954L9.33323 6.39073Z"
            fill="#8694B3"
        />
    </svg>
);

export { ArrowDownIcon, TrendIcon };
