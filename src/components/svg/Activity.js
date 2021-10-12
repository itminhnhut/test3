

const SvgActivity = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24"
                 fill={fill || 'none'}>
                <path d="M21 12H17.4L14.7 20L9.3 4L6.6 12H3" stroke={color || '#718096'} strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgActivity;
