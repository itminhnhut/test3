const FullScreenIcon = ({ color = '#8694B3', size = 16, ...props }) => {
    return (
        <svg {...props} width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="m14 10.23-1.414 1.413-2.115-2.114-.942.942 2.114 2.115L10.23 14H14v-3.77zM2 5.77l1.414-1.413L5.529 6.47l.942-.942-2.114-2.115L5.77 2H2v3.77zM14 2h-3.77l1.413 1.414L9.53 5.529l.942.942 2.115-2.114L14 5.77V2zM2 14h3.77l-1.413-1.414 2.114-2.115-.942-.942-2.115 2.114L2 10.23V14z"
                fill={color}
            />
        </svg>
    );
};

export default FullScreenIcon;
