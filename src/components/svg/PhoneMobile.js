const PhoneMobile = ({
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
            d='M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z'
            fill={color} />
    </svg>;
};

export default PhoneMobile;
