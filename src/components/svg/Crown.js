const Crown = ({ size = 16, fill = '#fff', style, className, onClick }) => {
    return (
        <svg
            width={size}
            height={size}
            style={style}
            className={className}
            onClick={onClick}
            viewBox="0 0 16 16"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#lx9ucaahla)">
                <path d="M14.67 11.159H7.995v-9.01l4.01 5.174 2.663-2.873v6.708z" fill={fill} />
                <path d="M7.996 2.15 4.062 7.51l-2.74-3.06v6.708h6.674l.312-3.625-.25-5.113-.062-.27z" fill={fill} />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="m4.697 5.702.773-.943-1.5-1.835-1.505 1.835.919 1.12h.007l.584.699.727-.876h-.005zM12.783 5.702l.773-.943-1.5-1.835-1.505 1.835.919 1.12h.007l.584.699.727-.876h-.005z"
                    fill={fill}
                />
                <path fill={fill} d="M-1.365 12.54h18.729v1.31H-1.365z" />
            </g>
            <defs>
                <clipPath id="lx9ucaahla">
                    <path fill={fill} d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default Crown;
