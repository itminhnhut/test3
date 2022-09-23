const SvgWallet = ({
    color = '#F6F6F6',
    size = 16,
    onClick
}) => {
    return (
        <svg width={size} height={size} onClick={onClick} viewBox="0 0 18 18" 
            xmlns="http://www.w3.org/2000/svg">
            <path d="M11.668 0.999023H17.0013V6.33162" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.33333 16.9967H1V11.6641" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.9996 0.999023L10.7773 7.22038" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1 16.9967L7.22222 10.7754" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export default SvgWallet;

