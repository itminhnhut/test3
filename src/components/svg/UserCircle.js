const UserCircle = ({ color = '#8694B3', size = 24, fill = 'none', style, className, onClick }) => {
    return (
        <svg
            width={size}
            height={size}
            style={style}
            className={className}
            onClick={onClick}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2A6.969 6.969 0 0 1 12 19a6.969 6.969 0 0 1-5.106-2.228z"
                fill={color}
            />
        </svg>
    );
};

export default UserCircle;
