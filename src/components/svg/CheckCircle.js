const CheckCircle = ({
    color = '#47CC85',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 16 16'
                fill={fill} xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M8 1.333A6.674 6.674 0 0 0 1.335 8a6.674 6.674 0 0 0 6.667 6.667A6.674 6.674 0 0 0 14.667 8a6.674 6.674 0 0 0-6.666-6.667zm-1.332 9.609-2.475-2.47.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z'
            fill={color} />
    </svg>;
};

export default CheckCircle
