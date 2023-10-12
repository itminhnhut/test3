const Upload = ({
    color = '#47CC85',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 32 32'
                fill={fill} xmlns='http://www.w3.org/2000/svg'>
        <path d='M14.666 20h2.667v-8h4l-5.334-6.667L10.666 12h4v8z' fill={color} />
        <path
            d='M26.666 24H5.333v-9.334H2.666V24a2.67 2.67 0 0 0 2.667 2.666h21.333A2.67 2.67 0 0 0 29.333 24v-9.334h-2.667V24z'
            fill={color} />
    </svg>;
};

export default Upload;
