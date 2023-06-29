const FacebookGroupFilled = ({ color = 'currentColor', size = 32, ...props }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={17} height={19} viewBox="0 0 17 19" fill="none" {...props}>
            <path
                d="m7.948 11.932.44-2.874H5.631V7.194c0-.786.385-1.553 1.62-1.553h1.254V3.194S7.367 3 6.279 3C4.01 3 2.524 4.376 2.524 6.868v2.19H0v2.874h2.524v6.947c1.03.161 2.078.161 3.107 0v-6.947h2.317z"
                fill={color}
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.334 2.668V0H12.67v2.668H10v1.664h2.67V7h1.664V4.332H17V2.668h-2.666z" fill={color} />
        </svg>
    );
};

export default FacebookGroupFilled;
