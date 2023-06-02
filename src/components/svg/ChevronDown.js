import classNames from 'classnames';

const SvgChevronDown = ({ color, size = 16, fill, style, className, onClick }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            onClick={onClick}
            className={classNames(`transition ease-in-out rotate-180`, className)}
            viewBox="0 0 17 16"
            fill={fill || 'none'}
            style={style}
        >
            <g clipPath="url(#clip0_2093_28978)">
                <path d="M11.026 8.83333H6.77351L8.89974 6.70711L11.026 8.83333Z" fill={color || '#8694B3'} stroke={color || '#8694B3'} />
            </g>
            <defs>
                <clipPath id="clip0_2093_28978">
                    <rect width="16" height="16" fill="white" transform="translate(0.898438)" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default SvgChevronDown;
