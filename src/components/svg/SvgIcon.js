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

const SeeIcon = ({ className = '', color, size }) => (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            fill={color || '#8694b2'}
        />
    </svg>
);

const HideIcon = ({ className = '', color, size }) => (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#5aan4m2usa)" fill={color || '#8694b2'}>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23 2 2 23l-.884-.884 21-21L23 2z" />
        </g>
        <defs>
            <clipPath id="5aan4m2usa">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const CheckCircleIcon = ({ className = '', color, size }) => (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"
            fill={color || '#1F2633'}
        />
    </svg>
);

const SwapIcon = ({ className = '', color = '#E2E8F0', size = 16 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#8slfkmybya)" fill={color}>
            <path d="M14.667 5.334 12 2.667v2H2V6h10v2l2.667-2.666zM1.333 10.667 4 13.333v-2h10V10H4V8l-2.667 2.667z" />
        </g>
        <defs>
            <clipPath id="8slfkmybya">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

const CloseIcon = ({ className = '', onClick, color = '#8593a6', size = 24 }) => (
    <svg className={className} onClick={onClick} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#l6hcoftsra)">
            <path d="M6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41 17.59 5 12 10.59 6.41 5z" fill={color} />
        </g>
        <defs>
            <clipPath id="l6hcoftsra">
                <path fill="#fff" transform="rotate(-90 12 12)" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
);

const ArrowDropDownIcon = ({ className = '', color = '#8694B3', size = 32, isFilled = true }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isFilled ? (
            <g clip-path="url(#ixety35iha)">
                <path d="M4.666 6.667 7.999 10l3.334-3.333H4.666z" fill={color} />
            </g>
        ) : (
            <g clip-path="url(#evihhgi6wb)">
                <path d="m18 10-1.41-1.41L12 13.17 7.41 8.59 6 10l6 6 6-6z" fill={color} />
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

const BxsUserIcon = ({ size = 24, className, color }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.5 6.5C7.5 8.981 9.519 11 12 11C14.481 11 16.5 8.981 16.5 6.5C16.5 4.019 14.481 2 12 2C9.519 2 7.5 4.019 7.5 6.5ZM20 21H21V20C21 16.141 17.859 13 14 13H10C6.14 13 3 16.141 3 20V21H4H5H19H20Z"
            fill="currentColor"
        />
    </svg>
);

const BxsBellIcon = ({ size = 24, className, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M12 22C13.311 22 14.407 21.166 14.818 20H9.182C9.593 21.166 10.689 22 12 22ZM19 14.586V10C19 6.783 16.815 4.073 13.855 3.258C13.562 2.52 12.846 2 12 2C11.154 2 10.438 2.52 10.145 3.258C7.185 4.074 5 6.783 5 10V14.586L3.293 16.293C3.105 16.48 3 16.734 3 17V18C3 18.553 3.447 19 4 19H20C20.553 19 21 18.553 21 18V17C21 16.734 20.895 16.48 20.707 16.293L19 14.586Z"
            fill="currentColor"
        />
    </svg>
);

const FutureWalletIcon = ({ size = 36, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.976 14.02h6.623a8.083 8.083 0 0 0-2.034-8.03 8.107 8.107 0 0 0-11.472-.025 8.111 8.111 0 0 0-2.06 8.055h6.624l1.153 1.154 1.166-1.154zM17.975 14l2.308-2.297-3.462-3.465-3.463 3.452 2.296 2.31 1.142 1.155 1.179-1.155z"
            fill="#9FF2C6"
        />
        <path
            d="M24.607 13.982a7.999 7.999 0 0 1-2.06 3.465c-3.178 3.167-8.328 3.155-11.493-.024a8.23 8.23 0 0 1-2.023-3.44h6.627l1.155 1.154 1.166-1.155h6.628z"
            fill="#0D994E"
        />
        <path d="m16.794 15.176-1.142-1.194h2.321l-1.179 1.194z" fill="#0D994E" />
        <path
            d="M27.648 20.833v5.572h2.393V32.4H3.6V13.995h5.432a7.989 7.989 0 0 0 2.034 3.425c3.162 3.177 8.31 3.19 11.484.025a8.094 8.094 0 0 0 2.059-3.463h5.432v6.851h-2.393z"
            fill="#5BD891"
        />
        <path d="M30.04 20.852h-2.395v5.576h2.395v-5.576z" fill="#9FF2C6" />
        <path d="M32.4 20.852h-2.37v5.576h2.37v-5.576z" fill="#0D994E" />
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
            fill-rule="evenodd"
            clip-rule="evenodd"
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
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.825 8.639a5.44 5.44 0 0 1-5.44 5.438 5.44 5.44 0 1 1 0-10.877 5.44 5.44 0 0 1 5.44 5.439zm-5.605 2.673v-.57a1.41 1.41 0 0 1-.685-.172 1.807 1.807 0 0 1-.606-.515l.452-.451c.11.156.248.29.407.397.131.082.28.131.434.145h.117a.903.903 0 0 0 .362-.055.389.389 0 0 0 .19-.099.47.47 0 0 0 .207-.406.56.56 0 0 0-.108-.353.842.842 0 0 0-.28-.208 2.775 2.775 0 0 0-.38-.153h-.1l-.316-.118a2.796 2.796 0 0 1-.397-.216 1.175 1.175 0 0 1-.271-.344 1.074 1.074 0 0 1-.109-.524c-.004-.22.06-.438.181-.623.124-.172.293-.306.488-.388.13-.069.27-.114.414-.136v-.542h.48v.542c.385.053.734.25.977.551l-.443.46a1.87 1.87 0 0 0-.37-.315.38.38 0 0 0-.163-.073.66.66 0 0 0-.226 0l-.253.01a.579.579 0 0 0-.262.108.416.416 0 0 0-.172.38.497.497 0 0 0 .1.306c.082.083.18.147.289.19l.343.127.136.054.289.1c.143.06.277.143.397.243a.902.902 0 0 1 .28.352c.102.165.164.35.181.542a1.11 1.11 0 0 1-.388.904 1.31 1.31 0 0 1-.687.28l-.029.003v.567h-.479z"
                fill="#5BD891"
            />
        </svg>
    );
};

const FutureLaunchpadIcon = ({ size = 36, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <g clip-path="url(#tpw7y5yj6a)">
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

const SuccessfulTransactionIcon = ({ size = 36, ...props }) => (
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
                <stop stop-color="#BDFEE7" />
                <stop offset="0.891338" stop-color="#60F1A6" stop-opacity="0.93" />
                <stop offset="1" stop-color="#47ED95" />
            </linearGradient>
        </defs>
    </svg>
);

export {
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
    SuccessfulTransactionIcon
};
