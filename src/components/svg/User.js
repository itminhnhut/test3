const User = ({
    color = '#8694B3',
    size = 24,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 24 24'
                fill={fill} xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2a4.505 4.505 0 0 0-4.5 4.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z'
            fill={color} />
    </svg>;
};

export default User;
