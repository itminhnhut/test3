const QRCodeScanFilled = ({
    color = '#E2E8F0',
    size = 28,
    onClick,
    className = ''
}) => {
    return (
        <svg width={size} height={size} onClick={onClick} className={className} viewBox='0 0 29 28' fill='none'
             xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M11.48 7.583v3.5h-3.5v-3.5h3.5zm1.75-1.75h-7v7h7v-7zm-1.75 11.084v3.5h-3.5v-3.5h3.5zm1.75-1.75h-7v7h7v-7zm7.584-7.584v3.5h-3.5v-3.5h3.5zm1.75-1.75h-7v7h7v-7zm-7 9.334h1.75v1.75h-1.75v-1.75zm1.75 1.75h1.75v1.75h-1.75v-1.75zm1.75-1.75h1.75v1.75h-1.75v-1.75zm-3.5 3.5h1.75v1.75h-1.75v-1.75zm1.75 1.75h1.75v1.75h-1.75v-1.75zm1.75-1.75h1.75v1.75h-1.75v-1.75zm1.75-1.75h1.75v1.75h-1.75v-1.75zm0 3.5h1.75v1.75h-1.75v-1.75zm5.25-12.25H23.73v-3.5h-3.5V2.333h5.834v5.834zm0 17.5v-5.834H23.73v3.5h-3.5v2.334h5.834zm-23.334 0h5.834v-2.334h-3.5v-3.5H2.73v5.834zm0-23.334v5.834h2.334v-3.5h3.5V2.333H2.73z'
                fill={color} />
        </svg>
    );
};

export default QRCodeScanFilled;
