const CalendarIcon = ({
    size = 16,
    color = '#768394'
}) => (
    <svg width={size} height={size} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M3.333 14.666h9.334c.735 0 1.333-.598 1.333-1.333V4c0-.736-.598-1.334-1.333-1.334h-1.334V1.333H10v1.333H6V1.333H4.667v1.333H3.333C2.598 2.666 2 3.264 2 4v9.333c0 .735.598 1.333 1.333 1.333zm0-10h9.334V6H3.333V4.666z'
            fill={color} />
    </svg>
);
export default CalendarIcon;
