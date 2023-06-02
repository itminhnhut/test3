const AddCircleOutline = ({ color = 'currentColor', size = 16, fill = 'none', style, className, onClick }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className={className}
            onClick={onClick}
            style={style}
        >
            <circle cx={8} cy={8} r="6.5" stroke={color} />
            <path stroke={color} strokeLinecap="round" d="M8 4.5v7M4.5 8h7" />
        </svg>
    );
};

export default AddCircleOutline;
