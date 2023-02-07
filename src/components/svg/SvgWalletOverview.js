import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const SvgWalletOverview = ({ size, className = '' }) => {
    const [currentTheme] = useDarkMode();

    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.976 14.02h6.623a8.083 8.083 0 0 0-2.034-8.03 8.107 8.107 0 0 0-11.472-.025 8.111 8.111 0 0 0-2.06 8.055h6.624l1.153 1.154 1.166-1.154zM17.975 14l2.308-2.297-3.462-3.465-3.463 3.452 2.296 2.31 1.142 1.155 1.179-1.155z"
                fill="#9FF2C6"
            />
            <path
                d="M24.607 13.982a7.999 7.999 0 0 1-2.06 3.465c-3.178 3.167-8.328 3.155-11.493-.024a8.23 8.23 0 0 1-2.023-3.44h6.627l1.155 1.154 1.166-1.155h6.628z"
                fill="#0D994E"
            />
            <path d="m16.794 15.176-1.142-1.194h2.321l-1.179 1.194z" fill="#0D994E" />
            <path
                d="M27.648 20.833v5.572h2.393V32.4H3.6V13.995h5.432a7.989 7.989 0 0 0 2.034 3.425c3.162 3.177 8.31 3.19 11.484.025a8.094 8.094 0 0 0 2.059-3.463h5.432v6.851h-2.393z"
                fill="#5BD891"
            />
            <path d="M30.04 20.852h-2.395v5.576h2.395v-5.576z" fill="#9FF2C6" />
            <path d="M32.4 20.852h-2.37v5.576h2.37v-5.576z" fill="#0D994E" />
        </svg>
    );
};

export default SvgWalletOverview;
