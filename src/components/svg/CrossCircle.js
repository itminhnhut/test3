const CrossCircle = ({ color = '#F93636', size = 16, fill = 'none', style, className, onClick }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill={fill}
            style={style}
            className={className}
            onClick={onClick}
        >
            <path
                d="M8 1.333A6.674 6.674 0 0 0 1.335 8a6.674 6.674 0 0 0 6.667 6.667A6.674 6.674 0 0 0 14.667 8a6.674 6.674 0 0 0-6.666-6.667zm2.805 8.529-.942.943L8 8.943l-1.862 1.862-.943-.943L7.058 8 5.196 6.138l.943-.943L8 7.057l1.862-1.862.942.943L8.943 8l1.862 1.862z"
                fill={color}
            />
        </svg>
    );
};

export default CrossCircle;
