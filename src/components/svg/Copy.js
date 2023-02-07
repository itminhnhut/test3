const Copy = ({
    color = '#8694B3',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 16 16'
                fill={fill} xmlns='http://www.w3.org/2000/svg'>
        <g clip-path='url(#w2xn9x2ura)'>
            <path d='M10.667.667H1.334v10.666h1.333V2h8V.667zm3.334 2.666H4v12h10v-12zM12.667 14H5.334V4.667h7.333V14z'
                  fill={color} />
        </g>
        <defs>
            <clipPath id='w2xn9x2ura'>
                <path fill='#fff' d='M0 0h16v16H0z' />
            </clipPath>
        </defs>
    </svg>;
};

export default Copy;
