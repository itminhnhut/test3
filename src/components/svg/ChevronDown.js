

const SvgChevronDown = ({color, size, fill, style, className, onClick}) => {
    return (
        <div style={style || {}} className={className || ""} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size ? `${size}` : '20'} height={size ? `${size}` : '20'}
                 viewBox="0 0 20 20" fill={fill || 'none'}>
                <path d="M5 7.5L10 12.5L15 7.5" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgChevronDown
