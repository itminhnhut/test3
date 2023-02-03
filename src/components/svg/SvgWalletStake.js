const SvgWalletStake = ({ size }) => {
    return (
        <svg width={size || 32} height={size || 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.79 22.422V28.8H3.2v-6.38h6.715l2.762 3.262 2.753-3.261h13.36z" fill="#5BD891" />
            <path d="M19.758 17.279 15.434 22.4H9.919L5.586 17.28l7.095-8.403 7.077 8.403z" fill="#9FF2C6" />
            <path d="m15.431 22.422-2.755 3.264-2.764-3.264h5.52z" fill="#0D994E" />
            <path d="M24.726 3.2 28.8 8.037l-4.074 4.846-4.101-4.846 4.1-4.837z" fill="#9FF2C6" />
        </svg>
    );
};

export default SvgWalletStake;
