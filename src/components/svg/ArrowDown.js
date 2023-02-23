const ArrowDown = ({
    size = 16,
    color = '#768394',
    className = ''
}) => (
    <svg width={size} height={size} className={className} viewBox='0 0 16 16' fill='none'
         xmlns='http://www.w3.org/2000/svg'>
        <g clip-path='url(#chk03oyg7a)'>
            <path d='m4.668 6.668 3.333 3.333 3.334-3.333H4.668z' fill={color} />
        </g>
        <defs>
            <clipPath id='chk03oyg7a'>
                <path fill='#fff' d='M0 0h16v16H0z' />
            </clipPath>
        </defs>
    </svg>
);
export default ArrowDown;
