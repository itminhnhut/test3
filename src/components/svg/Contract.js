

const SvgContract = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24"
                 fill={fill || 'none'}>
                <path
                    d="M6 2H14L20 8V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2Z"
                    stroke="#718096" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgContract;
