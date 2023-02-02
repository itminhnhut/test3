const Edit = ({
    color = '#8694B3',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return (
        <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 16 16'
             fill={fill} xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#b6972f97ia)'>
                <path
                    d='M4.498 14h-2.5v-2.5l7.374-7.373 2.5 2.5L4.498 14zm6.807-11.807c.26-.26.68-.26.94 0l1.56 1.56c.26.26.26.68 0 .94l-1.22 1.22-2.5-2.5 1.22-1.22z'
                    fill={color} />
            </g>
            <defs>
                <clipPath id='b6972f97ia'>
                    <path fill='#fff' transform='matrix(0 -1 -1 0 16 16)' d='M0 0h16v16H0z' />
                </clipPath>
            </defs>
        </svg>
    );
};

export default Edit;
