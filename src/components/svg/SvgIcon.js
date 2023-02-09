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

const AddCircleIcon = () => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#p8h6ijxpna)">
            <path
                d="M8.4 1.678a6.67 6.67 0 0 0-6.668 6.666A6.67 6.67 0 0 0 8.4 15.011a6.67 6.67 0 0 0 6.667-6.667 6.67 6.67 0 0 0-6.667-6.666zm3.332 7.333H9.066v2.667H7.732V9.01H5.066V7.678h2.666V5.01h1.334v2.667h2.666V9.01z"
                fill="#8694B3"
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
        <g clip-path="url(#zfktez410a)">
            <path d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm2.5 5.5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z" fill="#47CC85" />
        </g>
        <defs>
            <clipPath id="zfktez410a">
                <path fill="#fff" d="M0 0h12v12H0z" />
            </clipPath>
        </defs>
    </svg>
);

export { ArrowDownIcon, TrendIcon, SeeIcon, HideIcon, CheckCircleIcon, SwapIcon, CloseIcon, ArrowDropDownIcon, AddCircleIcon, AddCircleColorIcon };
