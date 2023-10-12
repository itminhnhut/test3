const FacebookFilled = ({
    color = '#E2E8F0',
    size = 28,
    onClick,
    className = ''
}) => {
    return (
        <svg width={size} height={size} onClick={onClick} className={className} viewBox='0 0 29 28' fill='none'
             xmlns='http://www.w3.org/2000/svg'>
            <path
                d='m21.108 15.631.77-5.029h-4.824V7.34c0-1.376.674-2.719 2.835-2.719h2.194V.34S20.092 0 18.188 0c-3.974 0-6.571 2.409-6.571 6.77v3.832H7.199v5.03h4.418v12.157c1.801.282 3.635.282 5.437 0V15.63h4.054z'
                fill={color} />
        </svg>
    );
};

export default FacebookFilled;
