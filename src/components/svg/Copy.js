const Copy = ({
    color = '#8694B3',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 24 24'
                fill={fill} xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#yqetmnqdja)'>
            <path
                d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'
                fill={color} />
        </g>
        <defs>
            <clipPath id='yqetmnqdja'>
                <path fill='#fff' d='M0 0h24v24H0z' />
            </clipPath>
        </defs>
    </svg>;
};

export default Copy;
