const SvgDropDown = ({ color, size, fill }) => {
    return (
        <svg width={size || 125} height={size || '124'} viewBox="0 0 125 124" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="m103.84 96.61-94.195 5.268-2.296-54.22L7 38.856v-.2a1.692 1.692 0 0 1 0-.187l-.298-6.561c-.03-.672.21-1.329.667-1.825a2.563 2.563 0 0 1 1.771-.822l39.595-1.636a2.573 2.573 0 0 1 1.843.681 2.537 2.537 0 0 1 .81 1.78l.188 4.423 27.364-1.127v9.363h22.878l.208 6.6 1.815 47.265z"
                fill={fill || '#E2E8F0'}
            />
            <path
                d="m118.236 51.336-14.104 48.07a2.244 2.244 0 0 1-2.133 1.506l-39.861 1.468-1.758.065-33.006 1.21-15.006.554a2.47 2.47 0 0 1-1.77-.539 2.434 2.434 0 0 1-.888-1.612v-.186l15.2-46.834.447-1.371c.16-.426.446-.793.82-1.055a2.287 2.287 0 0 1 1.274-.414h.649l73.925-2.827 13.851-.521c1.549-.09 2.717 1.198 2.36 2.486z"
                fill="url(#ozajrvvvfa)"
            />
            <path
                d="M101.818 42.745H78.941V33.35l19.901-.818a2.544 2.544 0 0 1 1.834.657 2.495 2.495 0 0 1 .818 1.758l.072 1.706.077 1.694.169 4.173.006.225z"
                fill="url(#g7bdevwrcb)"
            />
            <path
                d="M118.283 19.782v22.963h-16.465v-.226l-.168-4.172-.078-1.694-.071-1.706a2.497 2.497 0 0 0-.818-1.758 2.533 2.533 0 0 0-1.834-.657l-19.908.818V19.782h39.342z"
                fill={fill || '#E2E8F0'}
            />
            <path d="M103.127 22.744H83.609v.567h19.518v-.567zM97.252 25.185H83.61v.567h13.643v-.567zM97.252 27.625H83.61v.567h13.643v-.567z" fill="#fff" />
            <defs>
                <linearGradient id="ozajrvvvfa" x1="60.983" y1="90.397" x2="75.514" y2="21.557" gradientUnits="userSpaceOnUse">
                    <stop offset=".01" stopColor="#9FA4AB" />
                    <stop offset=".26" stopColor="#9FA4AB" />
                    <stop offset=".35" stopColor="#A2A7AE" stopOpacity=".96" />
                    <stop offset=".46" stopColor="#ABAFB6" stopOpacity=".86" />
                    <stop offset=".6" stopColor="#BABDC2" stopOpacity=".7" />
                    <stop offset=".74" stopColor="#CFD1D4" stopOpacity=".47" />
                    <stop offset=".89" stopColor="#E9EAEB" stopOpacity=".18" />
                    <stop offset=".98" stopColor="#F9F9F9" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="g7bdevwrcb" x1="70.602" y1="37.639" x2="108.55" y2="37.639" gradientUnits="userSpaceOnUse">
                    <stop offset=".01" stopColor="#9FA4AB" />
                    <stop offset=".19" stopColor="#9FA4AB" />
                    <stop offset=".33" stopColor="#A5AAB0" />
                    <stop offset=".52" stopColor="#B6BABF" />
                    <stop offset=".74" stopColor="#D2D4D7" />
                    <stop offset=".98" stopColor="#F9F9F9" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default SvgDropDown;
