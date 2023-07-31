import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const FutureInsurance = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12.231 2.4 5.6 6.261V9.27l6.631-3.956 6.625 3.956V6.261l-6.625-3.86z" fill={'#EB2B3D'} />
        <path
            d="M18.884 10.322v2.534a8.718 8.718 0 0 1-3.928 7.214c-.678.48-2.71 1.53-2.71 1.53l-2.648-1.483c.928-.325 1.815-.76 2.641-1.294l.258-.162a8.568 8.568 0 0 0 3.712-7.072V9.02l2.675 1.301z"
            fill={'#EB2B3D'}
        />
        <path
            d="M11.73 18.457c-.823.53-1.702.966-2.622 1.301l-.528-.42a8.576 8.576 0 0 1-2.98-6.503v-2.242l2.71-1.572v2.561a8.582 8.582 0 0 0 3.42 6.875z"
            fill={'#EB2B3D'}
        />
    </svg>
);

const ArrowDownIcon = ({ className = '', color = '#8694B3' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_295_61062)">
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

const SeeIcon = ({ className, color, size }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#8694b2' : '#768394';

    return (
        <svg className={className || ''} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                fill={color || defaultColor}
            />
        </svg>
    );
};

const HideIcon = ({ className = '', color, size }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#8694b2' : '#768394';

    return (
        <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#5aan4m2usa)" fill={color || defaultColor}>
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M23 2 2 23l-.884-.884 21-21L23 2z" />
            </g>
            <defs>
                <clipPath id="5aan4m2usa">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const CheckCircleIcon = ({ className = '', color, size }) => (
    <svg
        className={className}
        style={{ minWidth: size }}
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"
            fill={color || '#1F2633'}
        />
    </svg>
);

const SwapIcon = ({ className = '', color, size = 16 }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E';

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#8slfkmybya)" fill={color || defaultColor}>
                <path d="M14.667 5.334 12 2.667v2H2V6h10v2l2.667-2.666zM1.333 10.667 4 13.333v-2h10V10H4V8l-2.667 2.667z" />
            </g>
            <defs>
                <clipPath id="8slfkmybya">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const CloseIcon = ({ className, onClick, color, size }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#8694b2' : '#768394';

    return (
        <svg
            className={className || ''}
            onClick={onClick}
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill={color || defaultColor}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#l6hcoftsra)">
                <path
                    d="M6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41 17.59 5 12 10.59 6.41 5z"
                    fill={color || defaultColor}
                />
            </g>
            <defs>
                <clipPath id="l6hcoftsra">
                    <path fill="#fff" transform="rotate(-90 12 12)" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const ArrowDropDownIcon = ({ className = '', color, size = 32, isFilled = true, ...props }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E';

    return (
        <svg {...props} className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isFilled ? (
                <g clipPath="url(#ixety35iha)">
                    <path d="M4.666 6.667 7.999 10l3.334-3.333H4.666z" fill={color || defaultColor} />
                </g>
            ) : (
                <g clipPath="url(#evihhgi6wb)">
                    <path d="m18 10-1.41-1.41L12 13.17 7.41 8.59 6 10l6 6 6-6z" fill={color || defaultColor} />
                </g>
            )}
            <defs>
                <clipPath id="n2w0qfepha">
                    <path fill="#fff" transform="translate(48)" d="M0 0h24v24H0z" />
                </clipPath>
                <clipPath id="evihhgi6wb">
                    <path fill="#fff" transform="rotate(90 12 12)" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const BxsUserIcon = ({ size = 24, className, color }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.5 6.5C7.5 8.981 9.519 11 12 11C14.481 11 16.5 8.981 16.5 6.5C16.5 4.019 14.481 2 12 2C9.519 2 7.5 4.019 7.5 6.5ZM20 21H21V20C21 16.141 17.859 13 14 13H10C6.14 13 3 16.141 3 20V21H4H5H19H20Z"
            fill="currentColor"
        />
    </svg>
);

const BxsUserCircle = ({ color = '#8694B3', size = 24, fill = 'none', style, className, onClick }) => {
    return (
        <svg
            width={size}
            height={size}
            style={style}
            className={className}
            onClick={onClick}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2A6.969 6.969 0 0 1 12 19a6.969 6.969 0 0 1-5.106-2.228z"
                fill="#8694B3"
            />
        </svg>
    );
};

const BxsBellIcon = ({ size = 24, className, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 25 24" fill={color || 'currentColor'}>
        <path
            d="M12.8984 22C14.2094 22 15.3054 21.166 15.7164 20H10.0804C10.4914 21.166 11.5874 22 12.8984 22ZM19.8984 14.586V10C19.8984 6.783 17.7134 4.073 14.7534 3.258C14.4604 2.52 13.7444 2 12.8984 2C12.0524 2 11.3364 2.52 11.0434 3.258C8.08344 4.074 5.89844 6.783 5.89844 10V14.586L4.19144 16.293C4.00344 16.48 3.89844 16.734 3.89844 17V18C3.89844 18.553 4.34544 19 4.89844 19H20.8984C21.4514 19 21.8984 18.553 21.8984 18V17C21.8984 16.734 21.7934 16.48 21.6054 16.293L19.8984 14.586Z"
            fill={color || 'currentColor'}
        />
    </svg>
);

const FutureWalletIcon = ({ size = 36, ...props }) => (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" {...props}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.3843 8.87444H16.7535C17.2935 7.04862 16.8435 5.00994 15.4117 3.57713C13.3252 1.48113 9.93788 1.47294 7.84327 3.56075C6.40323 4.99357 5.94504 7.04862 6.48505 8.87444H10.8543L11.6152 9.63587L12.3843 8.87444ZM12.3836 8.86211L13.9065 7.34641L11.6222 5.06056L9.33787 7.33821L10.8526 8.86211L11.6058 9.62407L12.3836 8.86211Z"
            fill="#9FF2C6"
        />
        <path
            d="M16.7559 8.84961C16.5184 9.6853 16.0599 10.4718 15.3967 11.1355C13.3007 13.2247 9.90287 13.2165 7.81504 11.1191C7.16822 10.4554 6.71791 9.66891 6.48047 8.84961H10.8526L11.6141 9.61156L12.3837 8.84961H16.7559Z"
            fill="#0D994E"
        />
        <path d="M11.6048 9.63709L10.8516 8.84961H12.3826L11.6048 9.63709Z" fill="#0D994E" />
        <path
            d="M18.7634 13.3691V17.0453H20.3426V20.9998H2.89844V8.8578H6.48217C6.72763 9.68473 7.16947 10.4707 7.82403 11.1175C9.91045 13.2135 13.306 13.2217 15.4006 11.1339C16.0552 10.4789 16.5134 9.69292 16.7588 8.84961H20.3426V13.3691H18.7634Z"
            fill="#5BD891"
        />
        <path d="M20.3419 13.3809H18.7617V17.0595H20.3419V13.3809Z" fill="#9FF2C6" />
        <path d="M21.8998 13.3809H20.3359V17.0595H21.8998V13.3809Z" fill="#0D994E" />
    </svg>
);
const FutureTransferIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M14.4142 14.9962V15.0572H9.58984L12.0291 12.3672L14.4142 14.9962Z" fill="#0D994E" />
        <path d="M9.58984 9.68555L12.0291 12.3823L14.4142 15.0181V9.7533V9.68555H9.58984Z" fill="#9FF2C6" />
        <path d="M9.58594 7.0362V9.68555H18.4555V7.0362H9.58594Z" fill="#5BD891" />
        <path d="M21.5969 8.39197L17.6602 4.80078V11.9764L21.5969 8.39197Z" fill="#5BD891" />
        <path d="M5.54297 15.046V17.6953H14.4125V15.046H5.54297Z" fill="#5BD891" />
        <path d="M2.39844 16.3627L6.32842 12.7715V19.9471L2.39844 16.3627Z" fill="#5BD891" />
    </svg>
);

const FutureExchangeIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M7.191 21.6H2.398V16.81L7.191 21.6zM16.805 2.398h4.793V7.19l-4.793-4.792z" fill="#5BD891" />
        <path
            d="M16.035 8.941c.688.273 1.31.691 1.823 1.226a5.415 5.415 0 0 1-3.98 9.025 5.418 5.418 0 0 1-3.76-1.46 5.295 5.295 0 0 1-1.188-1.847 6.054 6.054 0 0 0 7.105-6.951v.007z"
            fill="#9FF2C6"
        />
        <path
            d="M6.285 6.1a5.415 5.415 0 0 1 7.652.084 5.215 5.215 0 0 1 1.391 2.547 5.407 5.407 0 0 0-6.608 6.471 5.225 5.225 0 0 1-2.518-1.444 5.405 5.405 0 0 1 .083-7.657z"
            fill="#0D994E"
        />
        <path d="M10.2 10.118a5.396 5.396 0 0 1 5.13-1.377 5.4 5.4 0 0 1-3.865 6.466c-.9.24-1.847.243-2.748.01a5.37 5.37 0 0 1 1.483-5.099z" fill="#5BD891" />
    </svg>
);

const FutureSwapIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path
            d="M7.188 21.599h-4.79v-4.787l4.79 4.787zM16.809 2.406h4.79v4.787l-4.79-4.787zM6.347 11.37a4.473 4.473 0 0 1-2.656-1.313l6.403-6.303A4.494 4.494 0 0 1 6.34 11.37h.007z"
            fill="#5BD891"
        />
        <path
            d="m20.31 13.847-6.423 6.304-8.489-8.402c.287.09.582.154.881.19.207.026.415.04.623.04a5.084 5.084 0 0 0 5-4.257 5.072 5.072 0 0 0-.17-2.35l8.578 8.475z"
            fill="#5BD891"
        />
        <path
            d="M11.361 7.449a4.487 4.487 0 0 1-2.944 3.686 4.495 4.495 0 0 1-4.725-1.087 4.494 4.494 0 1 1 6.745-5.918 4.507 4.507 0 0 1 .924 3.312v.007z"
            fill="#04B569"
        />
        <path
            d="M17.1 21.49a4.497 4.497 0 0 0 4.499-4.495A4.497 4.497 0 0 0 17.1 12.5a4.497 4.497 0 0 0-4.498 4.495 4.497 4.497 0 0 0 4.498 4.496z"
            fill="#BDFEE7"
        />
    </svg>
);

const FutureReferralIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path
            d="m13.158 8.815-3.986 4.734L3.43 7.8c1.08 1.015 2.77 1.082 3.985.136 1.351-1.083 1.554-2.976.473-4.329 0-.067-.067-.135-.067-.203l5.337 5.41zM14.905 10.508l-3.988 4.799 5.647 5.61c-1.03-1.065-1.126-2.755-.2-3.988 1.058-1.37 2.946-1.604 4.315-.544.067 0 .088.063.155.062l-5.929-5.94z"
            fill="#5BD891"
        />
        <path
            d="M7.888 3.585s-.068-.068-.068-.136l-.27-.203c-1.148-1.014-2.77-1.082-3.986-.135-1.35 1.082-1.553 2.976-.472 4.329.135.135.202.27.337.405C4.51 8.86 6.2 8.927 7.415 7.981a3.122 3.122 0 0 0 .473-4.396zm-2.365 3.11-.54-.608-.473-.541 1.013-1.217.473.608.473.609-.946 1.15z"
            fill="#9FF2C6"
        />
        <path d="m14.91 10.505-3.986 4.801-1.756-1.826 3.986-4.734 1.756 1.758z" fill="#0D994E" />
        <path d="m9.173 13.484 1.757 1.826-5.134 6.29H2.418l6.755-8.116zM21.597 2.4l-6.688 8.116-1.757-1.758L18.49 2.4h3.108z" fill="#5BD891" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.594 18.482a3.11 3.11 0 0 1-3.108 3.111 3.11 3.11 0 0 1-3.107-3.11 3.11 3.11 0 0 1 3.107-3.112 3.11 3.11 0 0 1 3.108 3.111zm-2.097.006-1.014-1.15-1.013 1.15 1.014 1.218 1.013-1.218z"
            fill="#9FF2C5"
        />
    </svg>
);

const FutureIcon = ({ size = 36, ...props }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            {' '}
            <path d="M3.2 28.796h25.595V10.361l-10.459 9.434-8.643-2.211-6.494 6.139v5.073z" fill="#9FF2C5" />
            <path d="M28.799 9.772h-2.594v9.603H28.8V9.772z" fill="#0D994E" />
            <path d="M20.059 9.754v2.854h8.74V9.754h-8.74z" fill="#5BD891" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.825 8.639a5.44 5.44 0 0 1-5.44 5.438 5.44 5.44 0 1 1 0-10.877 5.44 5.44 0 0 1 5.44 5.439zm-5.605 2.673v-.57a1.41 1.41 0 0 1-.685-.172 1.807 1.807 0 0 1-.606-.515l.452-.451c.11.156.248.29.407.397.131.082.28.131.434.145h.117a.903.903 0 0 0 .362-.055.389.389 0 0 0 .19-.099.47.47 0 0 0 .207-.406.56.56 0 0 0-.108-.353.842.842 0 0 0-.28-.208 2.775 2.775 0 0 0-.38-.153h-.1l-.316-.118a2.796 2.796 0 0 1-.397-.216 1.175 1.175 0 0 1-.271-.344 1.074 1.074 0 0 1-.109-.524c-.004-.22.06-.438.181-.623.124-.172.293-.306.488-.388.13-.069.27-.114.414-.136v-.542h.48v.542c.385.053.734.25.977.551l-.443.46a1.87 1.87 0 0 0-.37-.315.38.38 0 0 0-.163-.073.66.66 0 0 0-.226 0l-.253.01a.579.579 0 0 0-.262.108.416.416 0 0 0-.172.38.497.497 0 0 0 .1.306c.082.083.18.147.289.19l.343.127.136.054.289.1c.143.06.277.143.397.243a.902.902 0 0 1 .28.352c.102.165.164.35.181.542a1.11 1.11 0 0 1-.388.904 1.31 1.31 0 0 1-.687.28l-.029.003v.567h-.479z"
                fill="#5BD891"
            />
        </svg>
    );
};

const FutureLaunchpadIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <g clipPath="url(#tpw7y5yj6a)">
            <path d="m6.654 12.285-1.682.994-1.234 5.963 6.168-2.76-3.252-4.197zM17.64 12.285l1.682.994 1.234 5.963-6.056-2.76 3.14-4.197z" fill="#9FF2C6" />
            <path d="m12.143 2.371 5.94 10.152-6.052 9.048-5.828-8.938 5.94-10.262zM8.11 19.383H6.988v1.104H8.11v-1.104z" fill="#5BD891" />
            <path d="M3.52 20.465H2.398v1.104H3.52v-1.104z" fill="#0D994E" />
            <path d="M16.215 20.625h1.12v-1.104h-1.12v1.104z" fill="#5BD891" />
            <path d="M20.797 21.629h1.121v-1.104h-1.121v1.104z" fill="#0D994E" />
        </g>
        <defs>
            <clipPath id="tpw7y5yj6a">
                <path fill="#fff" transform="translate(2.398 2.398)" d="M0 0h19.5v19.2H0z" />
            </clipPath>
        </defs>
    </svg>
);

const FuturePortfolioIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path
            d="M21.249 11.31h-4.993a.346.346 0 0 1-.336-.267 4.019 4.019 0 0 0-2.98-2.97.346.346 0 0 1-.268-.336v-4.99c0-.207.179-.366.384-.345a9.554 9.554 0 0 1 5.774 2.765 9.554 9.554 0 0 1 2.763 5.758.346.346 0 0 1-.344.384z"
            fill="#2D9CDB"
        />
        <path
            opacity=".1"
            d="M12.672 7.736V6.71a5.318 5.318 0 0 1 4.614 4.6h-1.03a.346.346 0 0 1-.336-.266 4.019 4.019 0 0 0-2.98-2.97.346.346 0 0 1-.268-.337z"
            fill="#223050"
        />
        <path
            d="M21.597 12.991a9.531 9.531 0 0 1-2.068 5.012.347.347 0 0 1-.515.029l-2.795-2.796-.735-.735a.346.346 0 0 1-.049-.427c.225-.365.393-.768.493-1.197a.346.346 0 0 1 .337-.27h4.988c.206 0 .365.18.344.384z"
            fill="#FFD912"
        />
        <path
            d="M17.293 12.607a5.285 5.285 0 0 1-1.074 2.63l-.735-.736a.346.346 0 0 1-.049-.427c.225-.365.393-.768.493-1.197a.346.346 0 0 1 .337-.27h1.028z"
            fill="#FFC846"
        />
        <path
            d="M18.099 18.95a.346.346 0 0 1-.029.514 9.553 9.553 0 0 1-6.046 2.135 9.565 9.565 0 0 1-6.806-2.82 9.562 9.562 0 0 1-2.82-6.762 9.637 9.637 0 0 1 2.82-6.85 9.552 9.552 0 0 1 5.774-2.765.346.346 0 0 1 .384.344v4.99c0 .162-.112.3-.269.337a4.012 4.012 0 0 0-3.089 3.9 4.01 4.01 0 0 0 4.006 4.006c.777 0 1.502-.222 2.117-.606a.346.346 0 0 1 .429.047l3.529 3.53z"
            fill="#47CC85"
        />
        <path
            opacity=".1"
            d="m14.57 15.42.738.737a5.295 5.295 0 0 1-3.292 1.143 5.297 5.297 0 0 1-5.317-5.301 5.316 5.316 0 0 1 4.678-5.292v1.03c0 .161-.112.3-.269.337a4.012 4.012 0 0 0-3.089 3.9 4.01 4.01 0 0 0 4.006 4.005c.777 0 1.502-.222 2.117-.606a.346.346 0 0 1 .429.048z"
            fill="#223050"
        />
    </svg>
);

const FutureSimpleIcon = ({ size, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="2.5" y="2.5" width="19" height="3.16667" fill="#9FF2C5" />
        <rect x="2.5" y="7.25" width="14.25" height="14.25" fill="#5BD891" />
        <rect x="18.332" y="7.25" width="3.16667" height="14.25" fill="#0D994E" />
    </svg>
);

const FutureAdvanceIcon = ({ size, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21.5 2.5H2.5V5.66667H21.5V2.5Z" fill="#9FF2C5" />
        <path d="M21.5013 7.25H12.793V21.5H21.5013V7.25Z" fill="#9FF2C5" />
        <path d="M19.124 13.9007L15.6406 16.6715V11.209L19.124 13.9007Z" fill="#5BD891" />
        <path d="M11.2083 7.25H2.5V21.5H11.2083V7.25Z" fill="#5BD891" />
        <path d="M8.27917 11.1289V16.5914L4.875 13.8997L8.27917 11.1289Z" fill="#0D994E" />
    </svg>
);

const SuccessfulTransactionIcon = ({ size = 36, ...props }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    return isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M11.9501 14.6654V12.7252C10.8714 12.6763 9.87446 12.2198 9.13901 11.4209C7.60272 9.72523 7.60272 7.14916 9.13901 5.46983C9.85812 4.67092 10.8714 4.2144 11.9501 4.16549V1.83398H1.80078V22.1001H3.81103C4.07252 20.0621 5.0368 18.1871 6.55674 16.785C8.02765 15.4317 9.95618 14.6817 11.9501 14.6654Z"
                fill="url(#paint0_linear_395_205101)"
            />
            <path d="M20.5132 22.1334C19.9412 17.8616 16.2803 14.666 11.9656 14.666V22.1007H3.41797V22.1334H20.5132Z" fill="#E2E8F0" />
            <path d="M11.95 14.666C7.63531 14.6823 3.97437 17.8616 3.40234 22.1334H11.9663L11.95 14.666Z" fill="#0C0E14" />
            <path d="M16.2312 8.43772C16.2312 6.07361 14.319 4.16602 11.9492 4.16602V12.7257C14.319 12.7094 16.2312 10.8018 16.2312 8.43772Z" fill="#E2E8F0" />
            <path d="M7.66797 8.43772C7.66797 10.8018 9.58016 12.7094 11.95 12.7257V4.16602C9.58016 4.16602 7.66797 6.07361 7.66797 8.43772Z" fill="#0C0E14" />
            <path d="M22.1965 22.1817H17.6367V20.16H20.17V17.6328H22.1965V22.1817Z" fill="#47ED95" />
            <path d="M6.36062 22.1817H1.80078V17.6328H3.82738V20.16H6.36062V22.1817Z" fill="#47ED95" />
            <path d="M3.82738 6.38355H1.80078V1.81836H6.36062V3.84008H3.82738V6.38355Z" fill="#47ED95" />
            <path d="M22.1965 6.38355H20.17V3.84008H17.6367V1.81836H22.1965V6.38355Z" fill="#47ED95" />
            <defs>
                <linearGradient id="paint0_linear_395_205101" x1="4.64917" y1="8.69963" x2="25.1992" y2="13.4996" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#BDFEE7" />
                    <stop offset="0.891338" stopColor="#60F1A6" stopOpacity="0.93" />
                    <stop offset="1" stopColor="#47ED95" />
                </linearGradient>
            </defs>
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M11.95 14.665v-1.94a4.036 4.036 0 0 1-2.811-1.304 4.418 4.418 0 0 1 0-5.951 4.005 4.005 0 0 1 2.811-1.305V1.834H1.8V22.1h2.011a8.726 8.726 0 0 1 2.746-5.315 8.066 8.066 0 0 1 5.393-2.12z"
                fill="url(#6xmltrwi7a)"
            />
            <path
                d="M20.513 22.133c-.572-4.271-4.233-7.467-8.547-7.467v7.435H3.418v.032h17.095zM16.231 8.438a4.27 4.27 0 0 0-4.282-4.272v8.56c2.37-.017 4.282-1.924 4.282-4.288z"
                fill="#7EE6AE"
            />
            <path
                d="M22.197 22.182h-4.56V20.16h2.533v-2.527h2.026v4.549zM6.36 22.182H1.8v-4.55h2.027v2.528h2.534v2.022zM3.827 6.384H1.801V1.818h4.56V3.84H3.827v2.544zM22.197 6.384H20.17V3.84h-2.533V1.818h4.56v4.566z"
                fill="#30BF73"
            />
            <defs>
                <linearGradient id="6xmltrwi7a" x1="4.649" y1="8.7" x2="25.199" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#BDFEE7" />
                    <stop offset=".891" stop-color="#60F1A6" stopOpacity=".93" />
                    <stop offset="1" stop-color="#47ED95" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const AddCircleIcon = ({ color = '#768394', ...props }) => (
    <svg {...props} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#p8h6ijxpna)">
            <path
                d="M8.4 1.678a6.67 6.67 0 0 0-6.668 6.666A6.67 6.67 0 0 0 8.4 15.011a6.67 6.67 0 0 0 6.667-6.667 6.67 6.67 0 0 0-6.667-6.666zm3.332 7.333H9.066v2.667H7.732V9.01H5.066V7.678h2.666V5.01h1.334v2.667h2.666V9.01z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="p8h6ijxpna">
                <path fill="#fff" transform="translate(.398 .344)" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const AddCircleColorIcon = (props) => (
    <svg {...props} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#zfktez410a)">
            <path d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm2.5 5.5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z" fill="#47CC85" />
        </g>
        <defs>
            <clipPath id="zfktez410a">
                <path fill="#fff" d="M0 0h12v12H0z" />
            </clipPath>
        </defs>
    </svg>
);

const AppleIcon = ({ size = 24, color, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
        <g clipPath="url(#ik9gb490da)">
            <path
                d="M22.292 18.703c-.363.839-.793 1.61-1.29 2.32-.679.968-1.234 1.637-1.662 2.01-.664.61-1.375.922-2.137.94-.546 0-1.206-.156-1.973-.471-.77-.314-1.478-.47-2.124-.47-.679 0-1.407.156-2.185.47-.78.315-1.407.48-1.888.496-.73.031-1.458-.29-2.184-.966-.464-.404-1.044-1.098-1.739-2.08-.745-1.049-1.358-2.265-1.838-3.652-.514-1.497-.772-2.948-.772-4.352 0-1.608.348-2.995 1.044-4.158A6.122 6.122 0 0 1 5.73 6.58a5.88 5.88 0 0 1 2.955-.835c.58 0 1.34.18 2.285.532.943.354 1.548.533 1.813.533.199 0 .871-.21 2.01-.628 1.078-.388 1.988-.548 2.733-.485 2.02.163 3.536.96 4.545 2.393-1.806 1.094-2.699 2.627-2.681 4.593.016 1.531.572 2.806 1.663 3.817.495.47 1.048.833 1.663 1.09-.134.387-.274.758-.424 1.113zM17.661.48c0 1.2-.439 2.321-1.313 3.358-1.054 1.234-2.33 1.946-3.714 1.834a3.742 3.742 0 0 1-.027-.455c0-1.152.501-2.386 1.392-3.394.445-.51 1.01-.935 1.696-1.273.685-.334 1.332-.518 1.94-.55.019.16.026.32.026.48z"
                fill={color || '#fff'}
            />
        </g>
        <defs>
            <clipPath id="ik9gb490da">
                <path fill={color || '#fff'} transform="translate(.5)" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const GooglePlayIcon = ({ size = 24, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 26" fill="none" {...props}>
        <path d="M10.745 12.283.098 23.583a2.873 2.873 0 0 0 4.238 1.741l.034-.02 11.984-6.915-5.61-6.106z" fill="#EB4335" />
        <path d="m21.517 10.36-.01-.006-5.174-3-5.83 5.186 5.85 5.849 5.147-2.97a2.876 2.876 0 0 0 .017-5.059z" fill="#FABC13" />
        <path d="M.098 2.137a2.818 2.818 0 0 0-.098.74v19.967c0 .257.033.505.098.74l11.013-11.011L.098 2.137z" fill="#547DBF" />
        <path d="m10.823 12.86 5.51-5.509L4.364.411A2.878 2.878 0 0 0 .098 2.134v.003L10.823 12.86z" fill="#30A851" />
    </svg>
);

const AndroidIcon = ({ size = 24, color = 'currentColor', ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <g clip-path="url(#vtok890oea)">
            <path
                d="m17.6 9.482 1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0l-1.88-3.24a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83l1.84 3.18a10.78 10.78 0 0 0-5.4 8.52h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.252a1.25 1.25 0 1 1 0-2.501 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.501 1.25 1.25 0 0 1 0 2.5z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="vtok890oea">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const LogoIcon = ({ size = 24, ...props }) => (
    <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.058 2.85c0 .26-.076.514-.22.73a1.305 1.305 0 0 1-.583.486 1.287 1.287 0 0 1-1.419-.286 1.322 1.322 0 0 1-.282-1.435c.099-.24.265-.446.48-.591a1.29 1.29 0 0 1 1.643.164c.244.247.381.582.381.931zM13.27 2.849c.001.262-.075.519-.218.738a1.293 1.293 0 0 1-2.014.204 1.328 1.328 0 0 1-.283-1.445c.1-.242.269-.449.485-.594a1.297 1.297 0 0 1 1.647.167c.244.247.381.581.383.93zM10.649 7.405c0 .263-.075.52-.218.738-.143.219-.348.39-.587.49a1.293 1.293 0 0 1-1.428-.285 1.328 1.328 0 0 1-.282-1.446c.1-.242.268-.448.484-.593a1.297 1.297 0 0 1 1.648.167c.243.247.381.58.383.93zM5.486 7.405c0 .26-.076.516-.22.732a1.305 1.305 0 0 1-.583.485 1.287 1.287 0 0 1-1.418-.285A1.322 1.322 0 0 1 2.982 6.9c.099-.24.266-.446.48-.59a1.29 1.29 0 0 1 1.643.163c.244.247.381.582.381.931z"
            fill="#47CC85"
        />
        <path
            d="M15.88 7.405c.001.263-.075.52-.218.738-.143.219-.347.39-.587.49a1.294 1.294 0 0 1-1.428-.285 1.328 1.328 0 0 1-.282-1.446c.1-.242.268-.448.484-.593a1.297 1.297 0 0 1 1.648.167c.244.247.381.58.383.93z"
            fill="#BFBFBF"
        />
        <path
            d="M21.092 7.405c0 .26-.076.516-.22.732a1.287 1.287 0 0 1-2.002.2 1.322 1.322 0 0 1-.282-1.436c.098-.24.265-.446.48-.59a1.29 1.29 0 0 1 1.643.163c.244.247.38.582.38.931zM18.476 2.849c.002.262-.074.519-.217.738a1.31 1.31 0 0 1-.587.49 1.293 1.293 0 0 1-1.428-.286 1.338 1.338 0 0 1-.282-1.445c.1-.242.268-.449.484-.594a1.297 1.297 0 0 1 1.647.167c.244.247.382.581.383.93z"
            fill="#47CC85"
        />
        <path
            d="M8.058 11.975c0 .26-.076.515-.22.731a1.306 1.306 0 0 1-.583.486 1.287 1.287 0 0 1-1.419-.286 1.322 1.322 0 0 1-.282-1.435c.099-.241.265-.447.48-.591a1.29 1.29 0 0 1 1.222-.124 1.292 1.292 0 0 1 .705.714c.065.16.098.331.097.505z"
            fill="#BFBFBF"
        />
        <path
            d="M2.87 11.975c.002.262-.074.518-.217.737a1.293 1.293 0 0 1-2.013.207 1.328 1.328 0 0 1-.286-1.443 1.32 1.32 0 0 1 .482-.595 1.297 1.297 0 0 1 1.651.16 1.318 1.318 0 0 1 .384.934zM13.27 11.975c.001.262-.075.519-.218.737a1.31 1.31 0 0 1-.586.49 1.292 1.292 0 0 1-1.428-.285 1.328 1.328 0 0 1-.283-1.445c.1-.242.269-.45.485-.594.216-.145.47-.222.729-.22.345 0 .676.138.92.385s.381.582.381.932zM10.649 16.506c.012.267-.056.531-.195.758a1.312 1.312 0 0 1-.583.515 1.294 1.294 0 0 1-1.453-.275 1.329 1.329 0 0 1-.272-1.471c.107-.244.284-.45.508-.59a1.296 1.296 0 0 1 1.615.187c.23.234.366.546.38.876zM5.486 16.506c0 .26-.076.515-.22.732a1.305 1.305 0 0 1-.583.485 1.287 1.287 0 0 1-1.418-.285 1.323 1.323 0 0 1-.283-1.436c.099-.24.266-.446.48-.591a1.29 1.29 0 0 1 1.645.162 1.312 1.312 0 0 1 .38.933z"
            fill="#47CC85"
        />
        <path
            d="M15.88 16.506c.001.262-.075.519-.218.738-.143.218-.347.389-.587.49a1.293 1.293 0 0 1-1.428-.286 1.328 1.328 0 0 1-.282-1.445c.1-.242.268-.449.484-.594a1.297 1.297 0 0 1 1.65.165c.244.248.38.583.38.932z"
            fill="#BFBFBF"
        />
        <path
            d="M21.092 16.506c0 .26-.076.515-.22.732a1.304 1.304 0 0 1-.584.485 1.287 1.287 0 0 1-1.418-.285 1.323 1.323 0 0 1-.282-1.436c.098-.24.265-.446.48-.591a1.29 1.29 0 0 1 1.644.162 1.312 1.312 0 0 1 .38.933zM18.476 11.975c.002.262-.074.519-.217.737a1.31 1.31 0 0 1-.587.49 1.293 1.293 0 0 1-1.428-.285 1.338 1.338 0 0 1-.282-1.445c.1-.242.268-.45.484-.594.216-.145.47-.222.729-.22.345 0 .676.138.92.385s.381.582.381.932zM23.726 11.975c.002.262-.074.519-.217.737a1.31 1.31 0 0 1-.587.49 1.293 1.293 0 0 1-1.428-.285 1.337 1.337 0 0 1 .202-2.039c.216-.145.47-.222.729-.22.345 0 .676.138.92.385s.381.582.381.932zM8.058 21.138c0 .26-.076.515-.22.732a1.305 1.305 0 0 1-.583.485 1.286 1.286 0 0 1-1.419-.285 1.322 1.322 0 0 1-.282-1.436c.099-.24.265-.446.48-.591a1.29 1.29 0 0 1 1.643.164c.244.247.381.582.381.931zM13.27 21.138c.001.263-.075.52-.218.738a1.31 1.31 0 0 1-.586.49 1.293 1.293 0 0 1-1.428-.286 1.328 1.328 0 0 1-.283-1.445c.1-.242.269-.449.485-.594a1.296 1.296 0 0 1 1.647.168c.244.246.381.58.383.93zM18.476 21.138c.002.263-.074.52-.217.738a1.31 1.31 0 0 1-.587.49 1.293 1.293 0 0 1-1.428-.286 1.338 1.338 0 0 1-.282-1.445c.1-.242.268-.449.484-.593a1.296 1.296 0 0 1 1.647.167c.244.246.382.58.383.93z"
            fill="#47CC85"
        />
    </svg>
);

const BxChevronDown = ({ size = 24, color, ...props }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1e1e1e';
    return (
        <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293 1.414 1.414z" fill={color || defaultColor} />
        </svg>
    );
};

const SyncAltIcon = ({ size, color, bgColor, ...props }) => {
    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#0dcfa1hmna)">
                <path fill={bgColor || 'undefined'} d="M0 24V0h24v24z" />
                <path d="M8 2 4 6h3v15h2V6h3L8 2zM16 22l4-4h-3V3h-2v15h-3l4 4z" fill={color || '#47CC85'} />
            </g>
            <defs>
                <clipPath id="0dcfa1hmna">
                    <path fill="#fff" transform="rotate(-90 12 12)" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const ArrowRightIcon = ({ color, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 8" fill="none">
        <path d="M12.01 3L0 3L0 5L12.01 5L12.01 8L16 4L12.01 0V3Z" fill={color || '#47CC85'} />
    </svg>
);

const CheckedDoubleIcon = ({ color, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 11" fill="none">
        <path
            d="M0.394043 6.74204L5.13704 10.362L12.753 1.65804L11.247 0.342041L4.86304 7.63804L1.60604 5.15204L0.394043 6.74204ZM19.753 1.65804L18.247 0.342041L11.878 7.62104L11.125 7.01904L9.87504 8.58104L12.122 10.379L19.753 1.65804Z"
            fill={color || '#47CC85'}
        />
    </svg>
);

const BxsBookIcon = ({ size, color, isButton, className, ...props }) => (
    <svg
        {...props}
        className={`${!isButton ? (color ? color : 'text-[#8694B3]') : ''} ${className}`}
        width={size || 12}
        height={size || 12}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.006 9H10.5V2a1 1 0 0 0-1-1H3c-.603 0-1.5.4-1.5 1.5v7c0 1.1.897 1.5 1.5 1.5h7.5v-1H3.006c-.231-.006-.506-.098-.506-.5s.275-.494.506-.5zM4 3h4.5v1H4V3z"
            fill="currentColor"
        />
    </svg>
);

const BxsStarIcon = ({ size, fill, ...props }) => {
    return (
        <svg {...props} width={size || 16} height={size || 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M14.632 6.12a.667.667 0 0 0-.579-.45l-3.8-.303-1.645-3.64a.665.665 0 0 0-1.215-.001L5.748 5.367l-3.8.302a.666.666 0 0 0-.413 1.142L4.344 9.55l-.994 4.302a.667.667 0 0 0 1.02.704L8 12.135l3.63 2.42a.668.668 0 0 0 1.012-.737l-1.22-4.267 3.024-2.721a.668.668 0 0 0 .186-.71z"
                fill={fill || '#8694B3'}
            />
        </svg>
    );
};

const TuneIcon = ({ size = 16, color, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#11nt6htp3a)">
            <path
                d="M2 11.333v1.334h4v-1.334H2zm0-8v1.334h6.667V3.333H2zM8.667 14v-1.333H14v-1.334H8.667V10H7.333v4h1.334zm-4-8v1.333H2v1.334h2.667V10H6V6H4.667zM14 8.667V7.333H7.333v1.334H14zM10 6h1.333V4.667H14V3.333h-2.667V2H10v4z"
                fill="#8694B3"
            />
        </g>
        <defs>
            <clipPath id="11nt6htp3a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const PartnersIcon = ({ size, color, ...props }) => {
    return (
        <svg {...props} width={size || 32} height={size || 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M23.707 22.587a2.571 2.571 0 0 1-1.582 2.381c-.312.13-.647.197-.984.197a2.564 2.564 0 0 1-1.596 2.38c-.314.128-.65.192-.989.188a3.615 3.615 0 0 1-5.133 0l-7.7-7.715 5.134-5.147a3.615 3.615 0 0 1 5.142 0l-3.85 3.853a3.613 3.613 0 0 0 5.133 0l1.274-1.284 5.151 5.147z"
                fill="#9FF2C5"
            />
            <path d="m26.279 20.018-2.576 2.569-7.708-7.716a3.616 3.616 0 0 1 3.964-.795c.441.184.841.454 1.178.795l5.142 5.147z" fill="#5BD891" />
            <path d="M10.015 14.817 5.316 19.52l-2.123-2.134 4.699-4.704 2.123 2.135z" fill="#9FF2C5" />
            <path d="m7.892 12.691 2.123 2.126-4.699 4.703-2.123-2.134 4.699-4.695z" fill="#9FF2C5" />
            <path d="m24.095 12.674-2.121 2.123 4.697 4.701 2.121-2.123-4.697-4.701z" fill="#5BD891" />
            <path d="m18.557 17.44-1.284 1.284a3.615 3.615 0 0 1-5.132 0l3.85-3.853 2.566 2.569z" fill="#0D994E" />
            <path d="m15.993 3.204-3.75 3.754 3.75 3.754 3.751-3.754-3.75-3.754z" fill="#5BD891" />
            <path d="m8.249 5.689-1.26 1.26 1.26 1.26 1.259-1.26-1.26-1.26zM23.605 5.685l-1.259 1.26 1.26 1.26 1.258-1.26-1.259-1.26z" fill="#0D994E" />
        </svg>
    );
};

const BxsDonateHeart = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
            d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753 2.606 2.606 0 0 0-.73 1.818c0 .71.279 1.354.73 1.818L15 12l4.258-4.61z"
            fill={color || '#768394'}
        />
    </svg>
);

const BxsGift = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
            d="M5 12H4v8a2 2 0 0 0 2 2h5V12H5zm13 0h-5v10h5a2 2 0 0 0 2-2v-8h-2zm.791-5A4.92 4.92 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2 6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H2v4h9V9h2v2h9V7h-3.209zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5zM15.5 4c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.477c.51-1.576 1.251-3 1.977-3z"
            fill={color || '#768394'}
        />
    </svg>
);

const BxsLogoutCircle = ({ size, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="m2 12 5 4v-3h9v-2H7V8l-5 4z" fill={color || '#768394'} />
        <path
            d="M13 3a8.938 8.938 0 0 0-6.363 2.637L8.05 7.051A6.955 6.955 0 0 1 13 5c1.87 0 3.628.729 4.95 2.051a6.955 6.955 0 0 1 2.05 4.95c0 1.87-.728 3.628-2.05 4.95A6.955 6.955 0 0 1 13 19.002a6.955 6.955 0 0 1-4.95-2.051l-1.414 1.414A8.938 8.938 0 0 0 13 21.002a8.938 8.938 0 0 0 6.364-2.637 8.938 8.938 0 0 0 2.637-6.364 8.938 8.938 0 0 0-2.637-6.364A8.938 8.938 0 0 0 13 3z"
            fill={color || '#768394'}
        />
    </svg>
);

const CopyIcon = ({ color = '#8694B3', ...props }) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#piv8lb9sya)">
            <path d="M10.665.666H1.332v10.667h1.333V1.999h8V.666zM14 3.333h-10v12h10v-12zm-1.334 10.666H5.332V4.666h7.333v9.333z" fill={color} />
        </g>
        <defs>
            <clipPath id="piv8lb9sya">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const ContentCopyIcon = ({ color = 'currentColor', size = 12 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12 12" fill="none">
        <g clipPath="url(#63l1ohfwla)">
            <path
                d="M8 .5H2c-.55 0-1 .45-1 1v7h1v-7h6v-1zm1.5 2H4c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1h5.5c.55 0 1-.45 1-1v-7c0-.55-.45-1-1-1zm0 8H4v-7h5.5v7z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="63l1ohfwla">
                <path fill="#fff" d="M0 0h12v12H0z" />
            </clipPath>
        </defs>
    </svg>
);

const CheckedIcon = ({ size = 24, color = '#8694B3', ...props }) => {
    return (
        <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99997 15.586L6.70697 12.293L5.29297 13.707L9.99997 18.414L19.707 8.70697L18.293 7.29297L9.99997 15.586Z" fill={color} />
        </svg>
    );
};

const PortfolioIconNoColor = ({ className, color, size = 24 }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#8694B3' : '#47cc85';

    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20.674 11.353h-4.68a.324.324 0 0 1-.316-.25 3.768 3.768 0 0 0-2.794-2.784.324.324 0 0 1-.251-.316V3.324c0-.193.168-.342.36-.322a8.958 8.958 0 0 1 5.414 2.592 8.957 8.957 0 0 1 2.59 5.398.325.325 0 0 1-.323.36zM21 12.93a8.936 8.936 0 0 1-1.939 4.699.325.325 0 0 1-.483.027l-2.62-2.62-.69-.69a.324.324 0 0 1-.045-.401 3.73 3.73 0 0 0 .462-1.122.325.325 0 0 1 .315-.253h4.677c.194 0 .343.168.323.36z"
                fill={color || defaultColor}
            />
            <path
                d="M16.965 12.57a4.956 4.956 0 0 1-1.007 2.465l-.69-.69a.325.325 0 0 1-.045-.4c.211-.342.369-.72.462-1.122A.324.324 0 0 1 16 12.57h.965z"
                fill={color || defaultColor}
            />
            <path
                d="M17.72 18.516a.325.325 0 0 1-.026.482A8.957 8.957 0 0 1 12.024 21a8.967 8.967 0 0 1-6.38-2.643A8.965 8.965 0 0 1 3 12.017a9.035 9.035 0 0 1 2.643-6.423 8.956 8.956 0 0 1 5.414-2.592c.192-.02.36.13.36.322v4.68a.325.325 0 0 1-.252.315 3.762 3.762 0 0 0-2.896 3.656 3.76 3.76 0 0 0 3.756 3.756c.728 0 1.408-.208 1.984-.568a.325.325 0 0 1 .402.044l3.309 3.309z"
                fill={color || defaultColor}
            />
        </svg>
    );
};

const PortfolioIcon = ({ className, size = 24, isNoColor = false }) => (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#qj2barczia)">
            <path
                d="M23.565 11.137h-6.24a.432.432 0 0 1-.42-.333 5.024 5.024 0 0 0-3.727-3.712.432.432 0 0 1-.334-.42V.431c0-.257.224-.457.48-.43a11.945 11.945 0 0 1 7.218 3.456 11.944 11.944 0 0 1 3.453 7.198.433.433 0 0 1-.43.481z"
                fill="#2D9CDB"
            />
            <path
                opacity=".1"
                d="M12.844 6.672V5.387a6.648 6.648 0 0 1 5.768 5.75h-1.288a.432.432 0 0 1-.42-.332 5.024 5.024 0 0 0-3.726-3.713.432.432 0 0 1-.334-.42z"
                fill="#223050"
            />
            <path
                d="M24 13.24a11.916 11.916 0 0 1-2.585 6.264.433.433 0 0 1-.644.037l-3.494-3.495-.92-.919a.433.433 0 0 1-.06-.534c.281-.456.492-.96.616-1.497a.433.433 0 0 1 .42-.336h6.237c.257 0 .456.223.43.48z"
                fill="#FFD912"
            />
            <path
                d="M18.62 12.76a6.607 6.607 0 0 1-1.343 3.286l-.92-.919a.433.433 0 0 1-.06-.534c.281-.456.492-.96.616-1.497a.433.433 0 0 1 .42-.336h1.287z"
                fill="#FFC846"
            />
            <path
                d="M19.627 20.688a.433.433 0 0 1-.035.643A11.942 11.942 0 0 1 12.032 24a11.957 11.957 0 0 1-8.509-3.524A11.953 11.953 0 0 1 0 12.022a12.047 12.047 0 0 1 3.525-8.564A11.941 11.941 0 0 1 10.743.002a.433.433 0 0 1 .48.43v6.24c0 .2-.14.374-.336.42a5.016 5.016 0 0 0-3.862 4.875 5.014 5.014 0 0 0 5.008 5.008c.97 0 1.878-.278 2.646-.758a.433.433 0 0 1 .536.06l4.412 4.41z"
                fill="#47CC85"
            />
            <path
                opacity=".1"
                d="m15.215 16.277.922.921a6.62 6.62 0 0 1-4.116 1.428 6.622 6.622 0 0 1-6.646-6.627 6.646 6.646 0 0 1 5.847-6.615v1.288c0 .201-.139.375-.335.42a5.016 5.016 0 0 0-3.862 4.876 5.014 5.014 0 0 0 5.008 5.008c.97 0 1.878-.278 2.646-.758a.433.433 0 0 1 .536.059z"
                fill="#223050"
            />
        </g>
        <defs>
            <clipPath id="qj2barczia">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const MoreHorizIcon = ({ size, color, onClick }) => {
    return (
        <svg onClick={onClick} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#xn8eyetpua)">
                <path
                    d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    fill={color || '#8694B3'}
                />
            </g>
            <defs>
                <clipPath id="xn8eyetpua">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const BxsInfoCircle = ({ size = 24, color }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#8694b2' : '#768394';

    return (
        <svg style={{ minWidth: size }} width={size} height={size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.398 2.344c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zm1 15h-2v-6h2v6zm0-8h-2v-2h2v2z"
                fill={color ?? defaultColor}
            />
        </svg>
    );
};

const ShareIcon = ({ color = '#1E1E1E', size = 20, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17.0658 15.3444V17.0111H3.73242V15.3444H17.0658ZM9.56575 7.00273V13.6777H11.2324V7.00273H13.7324L10.3991 3.67773L7.06575 7.00273H9.56575Z"
            fill={color}
        />
    </svg>
);

const FireIcon = ({ size = '20' }) => (
    <svg width={size} height={size} viewBox={`0 0 20 20`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M13.813 2.896a.295.295 0 0 0-.493.167c-.092.547-.284 1.435-.647 2.251 0 0-.718-3.946-5.496-5.302a.295.295 0 0 0-.373.326c.173 1.173.486 4.481-.851 7.65-.696-1.414-1.808-1.966-2.515-2.18a.295.295 0 0 0-.362.391c.619 1.542-.771 3.468-.771 6.095a7.706 7.706 0 1 0 15.412 0c0-5.23-2.82-8.38-3.904-9.398z"
            fill="#FFC632"
        />
        <path
            d="M15.263 13.583c-.034-2.518-1.03-4.26-1.57-5.022a.318.318 0 0 0-.544.043c-.165.33-.431.747-.793.964 0 0-1.534-1.236-1.605-3.088a.317.317 0 0 0-.42-.286c-.812.276-2.535 1.204-2.952 4.16-.342-.617-1.154-.797-1.676-.847a.317.317 0 0 0-.339.391c.398 1.553-.604 2.48-.604 3.815a5.252 5.252 0 0 0 5.237 5.252c2.937.009 5.305-2.445 5.266-5.382z"
            fill="#CC1F1F"
        />
    </svg>
);

const SettingIcon = ({ size = 24, color = '#8694B3', ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 14.727a2.727 2.727 0 1 0 0-5.455 2.727 2.727 0 0 0 0 5.455z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
            d="M19.727 14.727a1.5 1.5 0 0 0 .3 1.655l.055.054a1.816 1.816 0 0 1 0 2.573 1.818 1.818 0 0 1-2.573 0l-.055-.055a1.5 1.5 0 0 0-1.654-.3 1.5 1.5 0 0 0-.91 1.373v.155a1.818 1.818 0 1 1-3.636 0V20.1a1.5 1.5 0 0 0-.981-1.373 1.5 1.5 0 0 0-1.655.3l-.054.055a1.818 1.818 0 0 1-3.106-1.287 1.818 1.818 0 0 1 .533-1.286l.054-.055a1.5 1.5 0 0 0 .3-1.654 1.5 1.5 0 0 0-1.372-.91h-.155a1.818 1.818 0 1 1 0-3.636H4.9a1.5 1.5 0 0 0 1.373-.981 1.5 1.5 0 0 0-.3-1.655l-.055-.054A1.818 1.818 0 1 1 8.491 4.99l.054.054a1.5 1.5 0 0 0 1.655.3h.073a1.5 1.5 0 0 0 .909-1.372v-.155a1.818 1.818 0 0 1 3.636 0V3.9a1.499 1.499 0 0 0 .91 1.373 1.5 1.5 0 0 0 1.654-.3l.054-.055a1.817 1.817 0 0 1 2.573 0 1.819 1.819 0 0 1 0 2.573l-.055.054a1.5 1.5 0 0 0-.3 1.655v.073a1.5 1.5 0 0 0 1.373.909h.155a1.818 1.818 0 0 1 0 3.636H21.1a1.499 1.499 0 0 0-1.373.91v0z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const NavbarSettingIcon = ({ size, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#pwkbsvwbka)">
            <path
                d="m19.44 12.99-.01.02c.04-.33.08-.67.08-1.01 0-.34-.03-.66-.07-.99l.01.02 2.44-1.92-2.43-4.22-2.87 1.16.01.01c-.52-.4-1.09-.74-1.71-1h.01L14.44 2H9.57l-.44 3.07h.01c-.62.26-1.19.6-1.71 1l.01-.01-2.88-1.17-2.44 4.22 2.44 1.92.01-.02c-.04.33-.07.65-.07.99 0 .34.03.68.08 1.01l-.01-.02-2.1 1.65-.33.26 2.43 4.2 2.88-1.15-.02-.04c.53.41 1.1.75 1.73 1.01h-.03L9.58 22h4.85s.03-.18.06-.42l.38-2.65h-.01c.62-.26 1.2-.6 1.73-1.01l-.02.04 2.88 1.15 2.43-4.2s-.14-.12-.33-.26l-2.11-1.66zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="pwkbsvwbka">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const ArrowCompareIcon = ({ color, size = 24, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} {...props} viewBox="0 0 32 32" fill="none">
        <g clipPath="url(#kvn1hu363a)">
            <path
                d="M12.013 18.667H2.667v2.667h9.346v4L17.333 20l-5.32-5.333v4zm7.974-1.333v-4h9.346v-2.667h-9.346v-4L14.667 12l5.32 5.334z"
                fill={color || '#47CC85'}
            />
        </g>
        <defs>
            <clipPath id="kvn1hu363a">
                <path fill="#fff" d="M0 0h32v32H0z" />
            </clipPath>
        </defs>
    </svg>
);

const TimeLapseIcon = ({ size, color = '#FFC632' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
        <g clipPath="url(#jnxbzu5ofa)">
            <path
                d="M54.133 25.866c-3.9-3.9-9-5.866-14.134-5.866v20L25.866 54.133c7.8 7.8 20.467 7.8 28.3 0 7.8-7.8 7.8-20.467-.033-28.267zm-14.134-19.2C21.6 6.666 6.666 21.6 6.666 40c0 18.4 14.933 33.333 33.333 33.333S73.333 58.4 73.333 40 58.399 6.666 39.999 6.666zm0 60c-14.733 0-26.666-11.933-26.666-26.666s11.933-26.667 26.666-26.667c14.734 0 26.667 11.934 26.667 26.667 0 14.733-11.933 26.666-26.667 26.666z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="jnxbzu5ofa">
                <path fill="transparent" d="M0 0h80v80H0z" />
            </clipPath>
        </defs>
    </svg>
);

const BxsErrorIcon = ({ size, color = '#FFC632' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
        <path
            d="M42.947 8.44c-1.154-2.18-4.74-2.18-5.894 0l-30 56.666A3.333 3.333 0 0 0 10 70h60c1.17 0 2.254-.613 2.853-1.613a3.32 3.32 0 0 0 .09-3.276L42.948 8.44zM43.333 60h-6.666v-6.667h6.666V60zm-6.666-13.334V30h6.666l.004 16.666h-6.67z"
            fill={color}
        />
    </svg>
);

const CancelIcon = ({ color = '#F93636', size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
        <path
            d="M40 6.667C21.565 6.667 6.665 21.567 6.665 40s14.9 33.333 33.333 33.333c18.434 0 33.334-14.9 33.334-33.333S58.433 6.667 39.999 6.667zm16.666 45.3-4.7 4.7L39.999 44.7 28.033 56.667l-4.7-4.7L35.299 40 23.333 28.033l4.7-4.7L39.999 35.3l11.967-11.967 4.7 4.7L44.699 40l11.967 11.967z"
            fill={color}
        />
    </svg>
);

const FutureSupportIcon = ({ size = 16, className = '', isDark }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M13.55 7.01a2.149 2.149 0 0 0-1.361-.49v.027a3.534 3.534 0 0 0-3.392-3.058H7.2a3.541 3.541 0 0 0-3.396 3.058v-.028a2.14 2.14 0 0 0-1.36.49c.1-2.721 2.199-4.876 4.76-4.876h1.597c2.567 0 4.662 2.164 4.748 4.876z"
            fill={isDark ? '#47CC85' : '#30BF73'}
        />
        <path d="M3.814 6.52v.027a4.085 4.085 0 0 0-.054.672v4.92a2.125 2.125 0 0 1-1.317-.485V7.009c.386-.318.871-.491 1.371-.49z" fill="#9FF2C6" />
        <path d="M2.449 7.012v4.643a2.31 2.31 0 0 1-.85-1.815V8.8a2.301 2.301 0 0 1 .85-1.788z" fill="#0D994E" />
        <path d="M12.711 10.05v3.578H8.26v-.454h3.993V10.05h.458z" fill="#5BD891" />
        <path d="M12.188 6.52v.027c.04.221.06.446.058.672v4.92c.481-.009.945-.18 1.317-.485V7.009a2.152 2.152 0 0 0-1.376-.49z" fill="#9FF2C6" />
        <path d="M13.55 7.012v4.643a2.312 2.312 0 0 0 .85-1.815V8.8a2.3 2.3 0 0 0-.85-1.788zM8.263 13.168H7.105v.454h1.158v-.454z" fill="#0D994E" />
        <path d="M8.263 12.8H7.105v.373h1.158v-.372zM8.263 13.61H7.105v.34h1.158v-.34z" fill="#9FF2C6" />
    </svg>
);

const QrCodeScannIcon = ({ size = 16, color = '#47CC85' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#1dj1n52n6a)">
            <path
                d="M6.332 4.332v2h-2v-2h2zm1-1h-4v4h4v-4zm-1 6.333v2h-2v-2h2zm1-1h-4v4h4v-4zm4.333-4.333v2h-2v-2h2zm1-1h-4v4h4v-4zm-4 5.333h1v1h-1v-1zm1 1h1v1h-1v-1zm1-1h1v1h-1v-1zm-2 2h1v1h-1v-1zm1 1h1v1h-1v-1zm1-1h1v1h-1v-1zm1-1h1v1h-1v-1zm0 2h1v1h-1v-1zm3-7h-1.333v-2h-2V1.332h3.333v3.333zm0 10v-3.333h-1.333v2h-2v1.333h3.333zm-13.333 0h3.333v-1.333h-2v-2H1.332v3.333zm0-13.333v3.333h1.333v-2h2V1.332H1.332z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="1dj1n52n6a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const CancelCircleFillIcon = ({ size = 16, color = '#F93636' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 1.332a6.674 6.674 0 0 0-6.666 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.667 8a6.674 6.674 0 0 0-6.666-6.667zm2.805 8.529-.942.942L8 8.941l-1.862 1.862-.943-.942 1.862-1.862-1.862-1.862.943-.943L8 7.056l1.862-1.862.942.943-1.862 1.862 1.862 1.862z"
            fill={color}
        />
    </svg>
);

const BxsErrorAltIcon = ({ size = 16, color = '#F93636' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.139 1.527a.664.664 0 0 0-.472-.195H5.334a.664.664 0 0 0-.471.195L1.529 4.861a.664.664 0 0 0-.195.471v5.333c0 .178.07.347.195.472l3.334 3.333a.664.664 0 0 0 .471.195h5.333c.178 0 .347-.07.472-.195l3.333-3.333a.664.664 0 0 0 .195-.472V5.332a.664.664 0 0 0-.195-.471l-3.333-3.334zm-2.472 9.805H7.334V9.999h1.333v1.333zm0-2.667H7.334v-4h1.333v4z"
            fill={color}
        />
    </svg>
);

const ArrowForwardIcon = ({ size = 24, color = '#fff', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
        <path d="m8 2.667-.94.94 3.72 3.726H2.665v1.333h8.113l-3.72 3.727.94.94L13.333 8 7.999 2.667z" fill={color} />
    </svg>
);

const CalendarFillIcon = ({ size = 24, color = 'currentColor', className = '' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
            d="M3.333 14.667h9.334c.735 0 1.333-.598 1.333-1.334V4c0-.735-.598-1.333-1.333-1.333h-1.334V1.333H10v1.334H6V1.333H4.667v1.334H3.333C2.598 2.667 2 3.265 2 4v9.333c0 .736.598 1.334 1.333 1.334zm0-10h9.334V6H3.333V4.667z"
            fill={color}
        />
    </svg>
);

const ContactIcon = ({ size = 24, color = 'currentColor', className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <g clipPath="url(#2ocmtc1tna)">
            <path
                d="M10.307 2 9.9 5.513l1.68 1.68a10.03 10.03 0 0 1-4.393 4.394L5.5 9.9l-3.5.407v3.673C8.787 14.367 14.367 8.787 13.98 2h-3.673z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="2ocmtc1tna">
                <path fill="#fff" transform="rotate(-90 8 8)" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const PartnerIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#loddpdwmxa)">
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36-1.3 0-2.36-1.06-2.36-2.36 0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM12 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15C18.28 17.88 15.39 20 12 20z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="loddpdwmxa">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const OrderIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <g clipPath="url(#g1zqepm55a)">
            <path
                d="M10.35 2H3.306a.647.647 0 0 0-.64.654v11.358c0 .362.286.655.64.655h9.387c.353 0 .64-.293.64-.655V5.305a.662.662 0 0 0-.166-.44l-2.343-2.65A.635.635 0 0 0 10.35 2zm.21 10.374H5.44a.647.647 0 0 1-.64-.655v-.6c0-.361.286-.654.64-.654h5.12c.353 0 .64.293.64.655v.6a.647.647 0 0 1-.64.654zm0-3.388H5.44a.647.647 0 0 1-.64-.654v-.6c0-.362.286-.655.64-.655h5.12c.353 0 .64.293.64.655v.6a.647.647 0 0 1-.64.654z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="g1zqepm55a">
                <path fill="#fff" transform="translate(2.666 2)" d="M0 0h10.667v12.667H0z" />
            </clipPath>
        </defs>
    </svg>
);

const BxsTimeIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
            d="M8 1.332a6.674 6.674 0 0 0-6.666 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.667 8a6.674 6.674 0 0 0-6.666-6.667zm0 12a5.34 5.34 0 0 1-5.333-5.333 5.34 5.34 0 0 1 5.334-5.334A5.34 5.34 0 0 1 13.334 8a5.34 5.34 0 0 1-5.333 5.333z"
            fill={color}
        />
        <path d="M8.667 4.668H7.334v4h4V7.335H8.667V4.668z" fill="#8694B3" />
    </svg>
);

const TimerIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
            d="M10 .664H6v1.333h4V.664zM7.333 9.331h1.334v-4H7.333v4zm5.354-4.407.946-.947c-.286-.34-.6-.66-.94-.94l-.946.947A5.975 5.975 0 0 0 8 2.664a6 6 0 1 0 6 6 5.975 5.975 0 0 0-1.313-3.74zM8 13.331a4.663 4.663 0 0 1-4.667-4.667A4.663 4.663 0 0 1 8 3.997a4.663 4.663 0 0 1 4.667 4.667A4.663 4.663 0 0 1 8 13.331z"
            fill={color}
        />
    </svg>
);

const StarPurpleIcon = ({ size, color = '#FFC632', ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
        <path d="m8 11.516 4.12 2.487-1.094-4.687 3.64-3.153-4.793-.407L8 1.336l-1.874 4.42-4.793.407 3.64 3.153-1.093 4.687L8 11.516z" fill={color} />
    </svg>
);

const MoneyIcon = ({ size, color = 'currentColor', ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <g clipPath="url(#qeqr7ytgha)">
            <path
                d="M7.999 1.332a6.67 6.67 0 0 0-6.667 6.667 6.67 6.67 0 0 0 6.667 6.666A6.67 6.67 0 0 0 14.665 8 6.67 6.67 0 0 0 8 1.332zm.94 10.727v1.273h-1.78v-1.287c-1.14-.24-2.107-.973-2.18-2.266h1.306c.067.7.547 1.246 1.767 1.246 1.307 0 1.6-.653 1.6-1.06 0-.553-.293-1.073-1.78-1.426-1.653-.4-2.787-1.08-2.787-2.447 0-1.147.927-1.893 2.074-2.14V2.665h1.78v1.3c1.24.3 1.86 1.24 1.9 2.26H9.532c-.033-.74-.427-1.246-1.48-1.246-1 0-1.6.453-1.6 1.093 0 .56.433.927 1.78 1.273 1.347.347 2.787.927 2.787 2.607-.007 1.22-.92 1.887-2.08 2.107z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="qeqr7ytgha">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const BxsImage = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
            d="M13.332 2.664H2.665c-.735 0-1.333.598-1.333 1.333v8c0 .736.598 1.334 1.333 1.334h10.667c.735 0 1.333-.598 1.333-1.334v-8c0-.735-.598-1.333-1.333-1.333zm-9 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3.667 6.667H3.332l2.667-3.334 1 1.334 2-2.667 3.666 4.667H8z"
            fill={color}
        />
    </svg>
);

const SaveAlt = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 17 16" fill="none">
        <path
            d="M13.167 8v4.667H3.833V8H2.5v4.667C2.5 13.4 3.1 14 3.833 14h9.334c.733 0 1.333-.6 1.333-1.333V8h-1.333zm-4 .447 1.726-1.72.94.94L8.5 11 5.167 7.667l.94-.94 1.726 1.72V2h1.334v6.447z"
            fill={color}
        />
    </svg>
);

const VietnamFlagIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#vietnamFlag)">
            <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#D80027" />
            <path d="m12 6.26 1.295 3.987h4.191l-3.39 2.463 1.294 3.986L12 14.232l-3.39 2.464 1.295-3.986-3.39-2.463h4.19L12 6.26z" fill="#FFDA44" />
        </g>
        <defs>
            <clipPath id="vietnamFlag">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const USAFlagIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#usaFlag)">
            <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#F0F0F0" />
            <path
                d="M11.479 12H24a12.01 12.01 0 0 0-.413-3.13H11.479V12zM11.479 5.74h10.76a12.064 12.064 0 0 0-2.769-3.131h-7.991v3.13zM12 24c2.824 0 5.42-.976 7.47-2.609H4.53A11.948 11.948 0 0 0 12 24zM1.761 18.26H22.24a11.93 11.93 0 0 0 1.348-3.13H.414c.3 1.117.758 2.168 1.347 3.13z"
                fill="#D80027"
            />
            <path
                d="M5.559 1.874h1.093l-1.017.739.389 1.196-1.018-.74-1.017.74.336-1.033c-.896.746-1.68 1.62-2.328 2.594h.35l-.647.47c-.1.168-.197.34-.29.513l.31.951-.578-.419C1 7.19.868 7.5.75 7.817l.34 1.048h1.258l-1.017.74.388 1.195-1.017-.739-.61.443C.033 10.994 0 11.494 0 12h12V0C9.63 0 7.42.688 5.559 1.874zm.465 8.926-1.018-.739-1.017.739.389-1.196-1.017-.739h1.257l.388-1.195.389 1.195h1.257l-1.017.74.389 1.195zm-.389-4.691.389 1.195-1.018-.739-1.017.74.389-1.196-1.017-.74h1.257l.388-1.195.389 1.196h1.257l-1.017.739zm4.693 4.691-1.017-.739-1.017.739.388-1.196-1.017-.739h1.257l.389-1.195.388 1.195h1.258l-1.018.74.389 1.195zm-.389-4.691.389 1.195-1.017-.739-1.017.74.388-1.196-1.017-.74h1.257l.389-1.195.388 1.196h1.258l-1.018.739zm0-3.496.389 1.196-1.017-.74-1.017.74.388-1.196-1.017-.739h1.257L9.311.678l.388 1.196h1.258l-1.018.739z"
                fill="#0052B4"
            />
        </g>
        <defs>
            <clipPath id="usaFlag">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);
const NotInterestedIcon = ({ size }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E';

    return (
        <svg width={size || 80} height={size || 80} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#k3bfy9rdta)">
                <path
                    d="M40 73.333C58.4 73.333 73.333 58.4 73.333 40S58.4 6.666 40 6.666 6.667 21.6 6.667 40C6.667 58.4 21.6 73.333 40 73.333zm0-60c14.733 0 26.667 11.934 26.667 26.667 0 6.166-2.1 11.833-5.634 16.333L23.667 18.967A26.341 26.341 0 0 1 40 13.333zM18.967 23.666l37.366 37.367A26.341 26.341 0 0 1 40 66.666c-14.733 0-26.667-11.933-26.667-26.666 0-6.167 2.1-11.834 5.634-16.334z"
                    fill={defaultColor}
                />
            </g>
            <defs>
                <clipPath id="k3bfy9rdta">
                    <path fill="#fff" d="M0 0h80v80H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

const SaveAltIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#6cukkge35a)">
            <g clipPath="url(#cnojdb08tb)">
                <path
                    d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67 2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"
                    fill={color}
                />
            </g>
        </g>
        <defs>
            <clipPath id="6cukkge35a">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
            <clipPath id="cnojdb08tb">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const FacebookIcon = ({ size = 24, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#qk5jpw3tia)">
            <path
                d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
                fill="#1877F2"
            />
            <path
                d="M16.671 15.469 17.203 12h-3.328V9.75c0-.949.465-1.875 1.956-1.875h1.513V4.922s-1.374-.234-2.686-.234c-2.741 0-4.533 1.66-4.533 4.668V12H7.078v3.469h3.047v8.385a12.13 12.13 0 0 0 3.75 0V15.47h2.796z"
                fill="#fff"
            />
        </g>
        <defs>
            <clipPath id="qk5jpw3tia">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const TwitterIcon = ({ size = 24, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.548 21.751c9.056 0 14.01-7.503 14.01-14.01 0-.213 0-.425-.015-.636A10.02 10.02 0 0 0 24 4.555a9.815 9.815 0 0 1-2.828.775 4.94 4.94 0 0 0 2.165-2.723 9.865 9.865 0 0 1-3.127 1.195 4.929 4.929 0 0 0-8.391 4.491A13.98 13.98 0 0 1 1.67 3.148a4.928 4.928 0 0 0 1.525 6.573A4.88 4.88 0 0 1 .96 9.105v.063a4.926 4.926 0 0 0 3.95 4.826 4.914 4.914 0 0 1-2.223.085 4.93 4.93 0 0 0 4.6 3.42A9.88 9.88 0 0 1 0 19.538a13.941 13.941 0 0 0 7.548 2.208"
            fill="#1DA1F2"
        />
    </svg>
);

const TelegramIcon = ({ size = 24, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#imvo5tb4ca)">
            <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="url(#gdmzl1l29b)" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.431 11.872c3.498-1.524 5.831-2.529 6.998-3.014 3.333-1.387 4.025-1.627 4.476-1.635.1-.002.322.023.465.14a.506.506 0 0 1 .171.324c.016.094.036.306.02.473-.18 1.897-.962 6.502-1.36 8.627-.167.9-.499 1.2-.82 1.23-.696.064-1.225-.46-1.9-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.213-.07-.062-.174-.04-.248-.024-.107.024-1.794 1.14-5.062 3.346-.48.329-.913.49-1.302.48-.428-.009-1.252-.242-1.865-.44-.751-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663z"
                fill="#fff"
            />
        </g>
        <defs>
            <linearGradient id="gdmzl1l29b" x1="12" y1="0" x2="12" y2="23.822" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2AABEE" />
                <stop offset="1" stopColor="#229ED9" />
            </linearGradient>
            <clipPath id="imvo5tb4ca">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

export const RedditIcon = ({ size = 28, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#kee7rahoia)">
            <path d="M14 28c7.732 0 14-6.268 14-14S21.732 0 14 0 0 6.268 0 14s6.268 14 14 14z" fill="#FF4500" />
            <path
                d="M23.333 14c0-1.13-.917-2.047-2.047-2.047-.556 0-1.048.213-1.408.573-1.392-.999-3.324-1.654-5.453-1.736l.934-4.372 3.03.639a1.46 1.46 0 0 0 2.914-.066 1.46 1.46 0 0 0-1.458-1.457c-.573 0-1.064.328-1.293.819l-3.39-.72a.408.408 0 0 0-.278.049.398.398 0 0 0-.164.229l-1.031 4.88c-2.178.065-4.127.703-5.535 1.735a2.066 2.066 0 0 0-1.408-.573c-1.13 0-2.047.917-2.047 2.047 0 .835.491 1.539 1.212 1.866-.033.197-.05.41-.05.623 0 3.143 3.652 5.681 8.172 5.681 4.519 0 8.17-2.538 8.17-5.681 0-.213-.016-.41-.049-.606A2.119 2.119 0 0 0 23.334 14zm-14 1.457A1.46 1.46 0 0 1 10.79 14a1.46 1.46 0 0 1 1.458 1.457 1.46 1.46 0 0 1-1.458 1.457 1.46 1.46 0 0 1-1.457-1.457zm8.138 3.848c-.999.999-2.898 1.064-3.455 1.064-.556 0-2.472-.082-3.455-1.064a.385.385 0 0 1 0-.54.385.385 0 0 1 .54 0c.623.622 1.965.851 2.932.851.966 0 2.292-.23 2.93-.851a.385.385 0 0 1 .54 0 .421.421 0 0 1-.032.54zm-.262-2.39a1.46 1.46 0 0 1-1.457-1.458A1.46 1.46 0 0 1 17.209 14a1.46 1.46 0 0 1 1.457 1.457 1.46 1.46 0 0 1-1.457 1.457z"
                fill="#fff"
            />
        </g>
        <defs>
            <clipPath id="kee7rahoia">
                <path fill="#fff" d="M0 0h28v28H0z" />
            </clipPath>
        </defs>
    </svg>
);

export const LinkedInIcon = ({ size = 28, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 14C0 6.268 6.268 0 14 0s14 6.268 14 14-6.268 14-14 14S0 21.732 0 14z" fill="#1877F2" />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.102 8.647c0 .915-.688 1.647-1.795 1.647h-.02c-1.065 0-1.754-.732-1.754-1.647 0-.935.71-1.647 1.795-1.647 1.086 0 1.754.712 1.774 1.647zm-.208 2.948v9.533H6.72v-9.533h3.173zm11.441 9.533v-5.466c0-2.928-1.565-4.29-3.652-4.29-1.685 0-2.44.925-2.86 1.574v-1.35H11.65c.041.894 0 9.532 0 9.532h3.173v-5.323c0-.285.02-.57.104-.774.23-.569.752-1.158 1.628-1.158 1.149 0 1.608.874 1.608 2.155v5.1h3.172z"
            fill="#fff"
        />
    </svg>
);

export const DiscordIcon = ({ size = 28, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#xntuxjze0a)">
            <path
                d="M23.703 4.848a23.09 23.09 0 0 0-5.7-1.767.086.086 0 0 0-.09.043 16.06 16.06 0 0 0-.71 1.458 21.316 21.316 0 0 0-6.402 0 14.768 14.768 0 0 0-.72-1.458.09.09 0 0 0-.092-.043c-2 .344-3.914.947-5.7 1.767a.082.082 0 0 0-.037.032C.622 10.304-.372 15.593.116 20.818c.002.025.016.05.036.065a23.22 23.22 0 0 0 6.992 3.534.09.09 0 0 0 .098-.032 16.599 16.599 0 0 0 1.43-2.326.089.089 0 0 0-.048-.124 15.29 15.29 0 0 1-2.184-1.04.09.09 0 0 1-.01-.15c.148-.11.294-.224.435-.34a.087.087 0 0 1 .09-.012c4.582 2.092 9.543 2.092 14.072 0a.086.086 0 0 1 .091.011c.14.116.287.231.435.341a.09.09 0 0 1-.008.15c-.697.407-1.422.751-2.185 1.04a.09.09 0 0 0-.047.124c.42.814.9 1.59 1.429 2.325a.089.089 0 0 0 .098.033 23.143 23.143 0 0 0 7.003-3.534.09.09 0 0 0 .036-.064c.584-6.04-.977-11.287-4.14-15.937a.071.071 0 0 0-.036-.034zM9.357 17.637c-1.38 0-2.517-1.267-2.517-2.822 0-1.556 1.115-2.823 2.517-2.823 1.412 0 2.538 1.278 2.516 2.822 0 1.556-1.115 2.823-2.516 2.823zm9.303 0c-1.379 0-2.516-1.267-2.516-2.822 0-1.556 1.115-2.823 2.517-2.823 1.412 0 2.538 1.278 2.516 2.822 0 1.556-1.104 2.823-2.517 2.823z"
                fill="#5865F2"
            />
        </g>
        <defs>
            <clipPath id="xntuxjze0a">
                <path fill="#fff" d="M0 0h28v28H0z" />
            </clipPath>
        </defs>
    </svg>
);

export const SocialFireIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M13.813 2.896a.295.295 0 0 0-.493.167c-.092.547-.284 1.435-.647 2.251 0 0-.718-3.946-5.496-5.302a.295.295 0 0 0-.373.326c.173 1.173.486 4.481-.851 7.65-.696-1.414-1.808-1.966-2.515-2.18a.295.295 0 0 0-.362.391c.619 1.542-.771 3.468-.771 6.095a7.706 7.706 0 1 0 15.412 0c0-5.23-2.82-8.38-3.904-9.398z"
            fill="#FFC632"
        />
        <path
            d="M15.262 13.583c-.033-2.519-1.03-4.26-1.57-5.022a.318.318 0 0 0-.543.043c-.166.33-.432.747-.794.964 0 0-1.533-1.236-1.605-3.088a.317.317 0 0 0-.42-.286c-.812.276-2.535 1.204-2.952 4.16-.342-.617-1.154-.797-1.676-.847a.317.317 0 0 0-.339.391c.398 1.553-.604 2.48-.604 3.815a5.252 5.252 0 0 0 5.237 5.252c2.938.009 5.305-2.445 5.266-5.382z"
            fill="#F93636"
        />
    </svg>
);

export const WarningFilledIcon = ({ size = 16, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.59 1.688c-.231-.436-.949-.436-1.18 0l-6 11.334A.666.666 0 0 0 2 14h12a.665.665 0 0 0 .589-.978l-6-11.334zM8.666 12H7.333v-1.333h1.334V12zM7.333 9.334V6h1.334v3.334H7.333z"
            fill="#FFC632"
        />
    </svg>
);

export const RemoveCircleIcon = ({ size = 16, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#4oup610i4a)">
            <path
                d="M8 1.332a6.67 6.67 0 0 0-6.667 6.667A6.67 6.67 0 0 0 8 14.665 6.67 6.67 0 0 0 14.667 8 6.67 6.67 0 0 0 8 1.332zm3.333 7.333H4.667V7.332h6.666v1.333z"
                fill="#8694B3"
            />
        </g>
        <defs>
            <clipPath id="4oup610i4a">
                <rect width="16" height="16" rx="8" fill="#fff" />
            </clipPath>
        </defs>
    </svg>
);

const FutureNaoIcon = ({ size = 20, ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.96 2a7.967 7.967 0 0 0-4.407 1.338H8.44a2.342 2.342 0 0 1 2.042 1.183l1.337 2.309 1.83 3.182-1.852 3.19h2.666a2.342 2.342 0 0 0 2.043-1.183l1.469-2.499a8.007 8.007 0 0 0-2.513-5.354A7.997 7.997 0 0 0 9.96 2z"
            fill="#3FEED9"
        />
        <path
            d="M3.08 14a8.03 8.03 0 0 0 3.386 3.184l-1.475-2.513a2.379 2.379 0 0 1 0-2.365L6.333 9.99l1.844-3.19h3.688l-1.342-2.315A2.352 2.352 0 0 0 8.473 3.3H5.588A8.018 8.018 0 0 0 3.08 14z"
            fill="#40C2EB"
        />
        <path
            d="M16.943 13.986a7.92 7.92 0 0 0 1.04-4.485l-1.476 2.5a2.35 2.35 0 0 1-2.006 1.176H8.144L6.3 10.001l-1.343 2.316a2.369 2.369 0 0 0 0 2.36l1.476 2.5a8.055 8.055 0 0 0 5.887.476 8.027 8.027 0 0 0 4.623-3.667z"
            fill="#1A6AD2"
        />
    </svg>
);

export const HelpIcon = ({ size = 16, color = '#E2E8F0', ...props }) => (
    <svg {...props} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 1.334a6.674 6.674 0 0 0-6.666 6.667 6.674 6.674 0 0 0 6.667 6.666 6.674 6.674 0 0 0 6.666-6.666 6.674 6.674 0 0 0-6.666-6.667zm.667 10.667H7.334v-1.334h1.333v1.334zm.651-3.257c-.13.105-.257.206-.357.306-.272.271-.293.518-.294.529v.088H7.334v-.111c0-.079.02-.785.684-1.45.13-.13.291-.261.46-.399.49-.396.811-.686.811-1.084a1.29 1.29 0 0 0-2.578 0H5.378a2.626 2.626 0 0 1 2.623-2.622 2.626 2.626 0 0 1 2.622 2.622c0 1.065-.786 1.7-1.305 2.121z"
            fill={color}
        />
    </svg>
);

export const FilterIcon = ({ size = 24, color = '#E2E8F0', className = '', ...props }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E';
    return (
        <svg {...props} className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20 3H4a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L9 13.414V21a1.001 1.001 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1zm-6.707 9.293A.996.996 0 0 0 13 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L5 6.59V5h14.001l.002 1.583-5.71 5.71z"
                fill={defaultColor}
            />
        </svg>
    );
};

export const MonetizationOnIcon = ({ size = 24, color = '#47CC85', className = '', ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"
            fill={color}
        />
    </svg>
);

export const DwPartnerIconMulti = ({ size = 16 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#h8pv48o2za)">
                <path
                    d="M15.998 12.138a3.53 3.53 0 0 1-3.52 3.543h-1.715a3.516 3.516 0 0 1-3.52-3.476h1.534V8.617h3.7c1.941 0 3.521 1.58 3.521 3.52z"
                    fill="#0D994E"
                />
                <path d="M11.443 7.317a1.92 1.92 0 1 0 0-3.84 1.92 1.92 0 0 0 0 3.84zM8.753 8.617H7.22v3.588h1.534V8.617z" fill="#9FF2C5" />
                <path
                    d="M8.756 8.616H7.221v3.588h-3.7C1.58 12.204 0 10.624 0 8.684V8.66c0-1.94 1.58-3.52 3.52-3.52h1.716c1.94 0 3.52 1.557 3.52 3.475z"
                    fill="#5BD891"
                />
                <path d="M4.225 3.84a1.92 1.92 0 1 0 0-3.84 1.92 1.92 0 0 0 0 3.84z" fill="#9FF2C5" />
            </g>
            <defs>
                <clipPath id="h8pv48o2za">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export const DwPartnerIconSingle = ({ size = 16 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.753 8.616h.003c0-1.918-1.58-3.475-3.52-3.475H3.52C1.58 5.14 0 6.72 0 8.66v.023c0 1.94 1.58 3.52 3.52 3.52H8.753V8.615z"
                fill="#5BD891"
            />
            <path d="M4.225 3.84a1.92 1.92 0 1 0 0-3.84 1.92 1.92 0 0 0 0 3.84z" fill="#9FF2C5" />
        </svg>
    );
};

export const SystemInfoCircleFilled = ({ size = 80 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M39.997 6.668c-18.38 0-33.333 14.953-33.333 33.333s14.953 33.334 33.333 33.334S73.331 58.38 73.331 40c0-18.38-14.954-33.333-33.334-33.333zm3.334 50h-6.667v-20h6.667v20zm0-26.667h-6.667v-6.666h6.667V30z"
                fill="#47CC85"
            />
        </svg>
    );
};

const ProfitStats = ({ className, color, size = 24 }) => {
    const [currentTheme] = useDarkMode();
    const defaultColor = currentTheme === THEME_MODE.DARK ? '#8694B3' : '#47cc85';

    return (
        <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 6.5h1v10h-1v-10zm4-3h1v13h-1v-13zm-8 6h1v7h-1v-7zm-5 10h15v1h-15v-1zm1-7h1v4h-1v-4z" fill={color || defaultColor} stroke="#8694B3" />
        </svg>
    );
};

export {
    FutureInsurance,
    ArrowDownIcon,
    TrendIcon,
    SeeIcon,
    HideIcon,
    CheckCircleIcon,
    SwapIcon,
    CloseIcon,
    ArrowDropDownIcon,
    BxsUserIcon,
    BxsBellIcon,
    FutureWalletIcon,
    FutureTransferIcon,
    FutureExchangeIcon,
    FutureSwapIcon,
    FutureReferralIcon,
    FutureIcon,
    FutureLaunchpadIcon,
    FuturePortfolioIcon,
    SuccessfulTransactionIcon,
    AddCircleIcon,
    AddCircleColorIcon,
    FutureSimpleIcon,
    FutureAdvanceIcon,
    AppleIcon,
    GooglePlayIcon,
    AndroidIcon,
    LogoIcon,
    BxChevronDown,
    SyncAltIcon,
    ArrowRightIcon,
    CheckedDoubleIcon,
    BxsBookIcon,
    BxsStarIcon,
    TuneIcon,
    PartnersIcon,
    PortfolioIcon,
    MoreHorizIcon,
    BxsDonateHeart,
    BxsGift,
    BxsLogoutCircle,
    CopyIcon,
    CheckedIcon,
    BxsInfoCircle,
    ShareIcon,
    FireIcon,
    SettingIcon,
    NavbarSettingIcon,
    ArrowCompareIcon,
    BxsUserCircle,
    TimeLapseIcon,
    BxsErrorIcon,
    CancelIcon,
    FutureSupportIcon,
    QrCodeScannIcon,
    CancelCircleFillIcon,
    BxsErrorAltIcon,
    ArrowForwardIcon,
    CalendarFillIcon,
    ContactIcon,
    PartnerIcon,
    OrderIcon,
    BxsTimeIcon,
    StarPurpleIcon,
    TimerIcon,
    MoneyIcon,
    BxsImage,
    SaveAlt,
    USAFlagIcon,
    VietnamFlagIcon,
    NotInterestedIcon,
    SaveAltIcon,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    FutureNaoIcon,
    PortfolioIconNoColor,
    ProfitStats,
    ContentCopyIcon
};
