const PlayFilled = ({
    color = '#768394',
    size = 16,
    fill = 'none',
    style,
    className = ''
}) => {
    return <svg width={size} height={size} style={style} className={className} viewBox='0 0 16 16' fill={fill}
                xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M8.0026 1.33203C4.3226 1.33203 1.33594 4.3187 1.33594 7.9987C1.33594 11.6787 4.3226 14.6654 8.0026 14.6654C11.6826 14.6654 14.6693 11.6787 14.6693 7.9987C14.6693 4.3187 11.6826 1.33203 8.0026 1.33203ZM6.66927 10.332V5.66536C6.66927 5.39203 6.9826 5.23203 7.2026 5.3987L10.3159 7.73203C10.4959 7.86537 10.4959 8.13203 10.3159 8.26536L7.2026 10.5987C6.9826 10.7654 6.66927 10.6054 6.66927 10.332Z'
            fill={color} />
    </svg>;
};

export default PlayFilled;
