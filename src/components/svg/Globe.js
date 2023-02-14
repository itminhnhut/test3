const SvgGlobe = ({ type = 1, color, size, fill, style, className, onClick }) => {
    return type === 1 ? (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24" fill={fill || 'none'}>
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke={color || '#718096'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M2 12H22" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="M16 12C15.9228 8.29203 14.5013 4.73835 12 2C9.49872 4.73835 8.07725 8.29203 8 12C8.07725 15.708 9.49872 19.2616 12 22C14.5013 19.2616 15.9228 15.708 16 12Z"
                    stroke={color || '#718096'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || '24'}
            height={size || '24'}
            viewBox="0 0 24 24"
            fill="none"
            style={style || {}}
            className={className || {}}
            onClick={() => onClick && onClick()}
        >
            <path
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.344-.026.519-.026.179 0 .354.016.53.027zm-3.842.7C7.704 6.618 7.136 8.762 7.03 11H4.069a8.013 8.013 0 0 1 4.619-6.273zM4.069 13h2.974c.136 2.379.665 4.478 1.556 6.23A8.01 8.01 0 0 1 4.069 13zm7.381 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972-.182.012-.364.028-.551.028-.186 0-.367-.016-.55-.027zm4.011-.772c.955-1.794 1.538-3.901 1.691-6.201h2.778a8.005 8.005 0 0 1-4.469 6.201z"
                fill="#8694B3"
            />
        </svg>
    );
};

export default SvgGlobe;
