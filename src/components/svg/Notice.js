const Notice = ({
    color = '#FFC632',
    size = 14,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return (
        <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox="0 0 14 14">
            <path
                d="M7.09904 0.333984C3.42304 0.333984 0.432373 3.32465 0.432373 7.00065C0.432373 10.6767 3.42304 13.6673 7.09904 13.6673C10.775 13.6673 13.7657 10.6767 13.7657 7.00065C13.7657 3.32465 10.775 0.333984 7.09904 0.333984ZM7.76571 10.334H6.43237V6.33398H7.76571V10.334ZM7.76571 5.00065H6.43237V3.66732H7.76571V5.00065Z"
                fill={color}/>
        </svg>

    );
};

export default Notice;
