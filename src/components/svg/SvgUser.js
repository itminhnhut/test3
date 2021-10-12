

const SvgUser = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || ""} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24" fill={fill || 'none'}>
                <circle cx="12" cy="12" r="10" stroke={color || '#718096'}/>
                <path
                    d="M16.4443 17.0001V15.889C16.4443 15.2996 16.2102 14.7344 15.7934 14.3176C15.3767 13.9009 14.8115 13.6667 14.2221 13.6667H9.77764C9.18827 13.6667 8.62304 13.9009 8.20629 14.3176C7.78955 14.7344 7.55542 15.2996 7.55542 15.889V17.0001"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M12.0002 11.4444C13.2275 11.4444 14.2224 10.4495 14.2224 9.22222C14.2224 7.99492 13.2275 7 12.0002 7C10.7729 7 9.77795 7.99492 9.77795 9.22222C9.77795 10.4495 10.7729 11.4444 12.0002 11.4444Z"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgUser
