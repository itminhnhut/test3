const SvgSun = ({ color = '#8694B3', size = 24, className, onClick }) => {
    return (
        <svg className={className} onClick={onClick} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.995 12a5.013 5.013 0 0 0 5.007 5.007A5.013 5.013 0 0 0 17.009 12a5.013 5.013 0 0 0-5.007-5.007A5.013 5.013 0 0 0 6.995 12zM11 19h2v3h-2v-3zm0-17h2v3h-2V2zm-9 9h3v2H2v-2zm17 0h3v2h-3v-2zM5.637 19.779l-1.414-1.415 2.121-2.121 1.414 1.414-2.12 2.122zM16.242 6.344l2.122-2.123 1.414 1.415-2.122 2.122-1.414-1.414zM6.344 7.759l-2.12-2.122 1.414-1.414 2.12 2.122-1.414 1.414zM19.778 18.363l-1.414 1.415-2.122-2.122 1.414-1.415 2.122 2.122z"
                fill={color}
            />
        </svg>
    );
};

export default SvgSun;
