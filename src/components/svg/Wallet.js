const SvgWallet = ({ color = 'currentColor', size = 16, fill = 'none', style, className, onClick }) => {
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
            <path d="M10.664 8h1.333v2.667h-1.333V8z" fill={color} />
            <path
                d="M13.336 4.667V3.333c0-.735-.598-1.333-1.333-1.333H3.336c-1.103 0-2 .897-2 2v8c0 1.467 1.196 2 2 2h10c.735 0 1.333-.598 1.333-1.333V6c0-.735-.598-1.333-1.333-1.333zm-10-1.334h8.667v1.334H3.336a.667.667 0 0 1 0-1.334zm10 9.334H3.344c-.308-.008-.675-.13-.675-.667V5.877c.21.075.432.123.667.123h10v6.667z"
                fill={color}
            />
        </svg>
    );
};

export default SvgWallet;
