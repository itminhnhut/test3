const WarningTriangle = ({
    color = '#FFC632',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return (
        <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 16 16'
             fill={fill} xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M8.59 1.688c-.23-.436-.948-.436-1.179 0l-6 11.333a.666.666 0 0 0 .59.98h12a.666.666 0 0 0 .588-.979L8.59 1.688zM8.667 12H7.334v-1.333h1.333V12zM7.334 9.333V6h1.333l.001 3.333H7.334z'
                fill={color} />
        </svg>
    );
};

export default WarningTriangle;
