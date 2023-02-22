const HelpCircle = ({
    color = '#47CC85',
    size = 16,
    fill = 'none',
    style,
    className,
    onClick
}) => {
    return <svg width={size} height={size} style={style} className={className} onClick={onClick} viewBox='0 0 16 16'
                fill={fill} xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#617f9k37qa)'>
            <path
                d='M8 1.333A6.67 6.67 0 0 0 1.335 8a6.67 6.67 0 0 0 6.667 6.667A6.67 6.67 0 0 0 14.667 8a6.67 6.67 0 0 0-6.666-6.667zm.667 11.334H7.334v-1.333h1.333v1.333zm1.38-5.167-.6.614c-.333.34-.573.646-.693 1.126a3.059 3.059 0 0 0-.087.76H7.334v-.333a2.665 2.665 0 0 1 .78-1.887l.827-.84c.306-.293.453-.733.366-1.2a1.327 1.327 0 0 0-.926-1.02 1.344 1.344 0 0 0-1.647.847c-.08.247-.287.433-.547.433h-.2a.577.577 0 0 1-.546-.747 2.672 2.672 0 0 1 2.153-1.886c1.013-.16 1.98.366 2.58 1.2.787 1.087.553 2.253-.127 2.933z'
                fill={color} />
        </g>
        <defs>
            <clipPath id='617f9k37qa'>
                <path fill='#fff' d='M0 0h16v16H0z' />
            </clipPath>
        </defs>
    </svg>;
};

export default HelpCircle;
