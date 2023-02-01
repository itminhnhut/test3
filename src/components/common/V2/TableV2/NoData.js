import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import { useSelector } from 'react-redux';
import { getLoginUrl } from 'src/redux/actions/utils';

const NoData = ({ text, loading = false, isSearch = false, className = '' }) => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const user = useSelector((state) => state.auth.user);

    const isDark = currentTheme === THEME_MODE.DARK;
    if (loading)
        return (
            <Spiner isDark={isDark}>
                <div className="spinner"></div>
            </Spiner>
        );

    return (
        <div className={`flex flex-col space-y-3 items-center justify-center ${className}`}>
            {!user ? (
                <>
                    <img className="max-h-[124px]" src="/images/icon/ic_login.png" />
                    <a href={getLoginUrl('sso')}>
                        <span dangerouslySetInnerHTML={{ __html: t('common:sign_in_to_continue') }} />
                    </a>
                </>
            ) : (
                <>
                    {isSearch ? <NotFoundIcon /> : <NoDataIcon isDark={isDark} />}
                    <span className={'text-darkBlue-5 text-sm sm:text-base'}>{text ?? isSearch ? t('common:no_results_found') : t('common:no_data')}</span>
                </>
            )}
        </div>
    );
};

export default NoData;

const Spiner = styled.div`
    .spinner {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }

    .spinner::before,
    .spinner::after {
        content: '';
        position: absolute;
        border-radius: inherit;
    }

    .spinner::before {
        width: 100%;
        height: 100%;
        background-image: ${() => `linear-gradient(0deg, ${colors.teal} 0%, #212121 50%)`};
        animation: spin 0.5s infinite linear;
    }

    .spinner::after {
        width: 85%;
        height: 85%;
        background-color: ${({ isDark }) => (isDark ? colors.dark.dark : '#fff')};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const NoDataIcon = ({ isDark }) => (
    <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill={isDark ? '#0C0E14' : '#fff'} d="M0 0h124v124H0z" />
        <path
            opacity=".8"
            d="m103.34 96.61-94.195 5.268-2.296-54.22-.35-8.802v-.2a1.692 1.692 0 0 1 0-.187l-.298-6.561c-.03-.672.21-1.329.667-1.825a2.563 2.563 0 0 1 1.771-.822l39.595-1.636a2.573 2.573 0 0 1 1.843.681 2.537 2.537 0 0 1 .81 1.78l.188 4.423 27.364-1.127v9.363h22.878l.208 6.6 1.815 47.265z"
            fill="#F7FAFF"
        />
        <path
            d="m117.736 51.336-14.104 48.07a2.244 2.244 0 0 1-2.133 1.506l-39.861 1.468-1.758.065-33.006 1.21-15.006.554a2.47 2.47 0 0 1-1.77-.539 2.434 2.434 0 0 1-.888-1.612v-.186l15.2-46.834.447-1.371c.16-.426.446-.793.82-1.055a2.287 2.287 0 0 1 1.274-.414h.649l73.925-2.827 13.851-.521c1.549-.09 2.717 1.198 2.36 2.486z"
            fill="url(#hxqc3qsbba)"
        />
        <path
            d="M101.318 42.745H78.441V33.35l19.901-.818a2.544 2.544 0 0 1 1.834.657 2.495 2.495 0 0 1 .818 1.758l.072 1.706.077 1.694.169 4.173.006.225z"
            fill="url(#4ei8iprxeb)"
        />
        <path
            opacity=".8"
            d="M117.783 19.782v22.963h-16.465v-.226l-.168-4.172-.078-1.694-.071-1.706a2.497 2.497 0 0 0-.818-1.758 2.537 2.537 0 0 0-1.834-.657l-19.908.818V19.782h39.342z"
            fill="#F7FAFF"
        />
        <path d="M102.627 22.744H83.109v.567h19.518v-.567zM96.752 25.185H83.11v.567h13.643v-.567zM96.752 27.625H83.11v.567h13.643v-.567z" fill="#fff" />
        <defs>
            <linearGradient id="hxqc3qsbba" x1="60.483" y1="90.397" x2="75.014" y2="21.557" gradientUnits="userSpaceOnUse">
                <stop offset=".01" stopColor="#9FA4AB" />
                <stop offset=".26" stopColor="#9FA4AB" />
                <stop offset=".35" stopColor="#A2A7AE" stopOpacity=".96" />
                <stop offset=".46" stopColor="#ABAFB6" stopOpacity=".86" />
                <stop offset=".6" stopColor="#BABDC2" stopOpacity=".7" />
                <stop offset=".74" stopColor="#CFD1D4" stopOpacity=".47" />
                <stop offset=".89" stopColor="#E9EAEB" stopOpacity=".18" />
                <stop offset=".98" stopColor="#F9F9F9" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="4ei8iprxeb" x1="70.102" y1="37.639" x2="108.05" y2="37.639" gradientUnits="userSpaceOnUse">
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

const NotFoundIcon = () => (
    <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M53.636 60.49c0 8.972-5.271 16.71-12.87 20.265-7.652-2.78-13.13-10.136-13.13-18.752 0-9.903 7.246-18.144 16.703-19.683a22.348 22.348 0 0 1 9.297 18.17z"
            fill="url(#nva20nnh7a)"
        />
        <path
            d="M33.945 82.694c-.865.11-1.742.162-2.639.162-12.329 0-22.322-10.013-22.322-22.365 0-12.353 9.993-22.372 22.328-22.372 2.323 0 4.562.356 6.671 1.015-8.915 3.762-15.186 12.592-15.186 22.863 0 8.642 4.432 16.256 11.148 20.697z"
            fill="url(#60vw3hys5b)"
        />
        <path
            d="M40.764 80.748a21.483 21.483 0 0 1-6.82 1.946c-6.715-4.44-11.147-12.055-11.147-20.697 0-10.272 6.27-19.108 15.186-22.863a22.17 22.17 0 0 1 6.349 3.18c-9.452 1.532-16.703 9.78-16.703 19.683.006 8.616 5.484 15.978 13.135 18.751z"
            fill="#C2C7CF"
        />
        <path
            d="m65.75 70.064 4.6 1.577c-3.76 8.887-12.567 15.151-22.799 15.151-5.032 0-9.703-1.5-13.606-4.092a21.483 21.483 0 0 0 6.82-1.945 19.726 19.726 0 0 0 6.786 1.196c8.11-.007 15.103-4.894 18.2-11.887zM72.294 61.996c0 1.713-.18 3.394-.51 5.01L67.16 65.43c.193-1.112.296-2.263.296-3.433.007-10.995-8.922-19.94-19.902-19.94-1.097 0-2.168.09-3.213.265a22.005 22.005 0 0 0-6.348-3.18 24.386 24.386 0 0 1 9.561-1.933c13.645 0 24.741 11.117 24.741 24.788z"
            fill="#C2C7CF"
        />
        <path d="M71.79 67.006a24.909 24.909 0 0 1-1.432 4.635l-4.6-1.578a19.694 19.694 0 0 0 1.413-4.634l4.619 1.577z" fill="#C2C7CF" />
        <path d="m115.021 81.743-1.555 4.59L70.352 71.64a24.926 24.926 0 0 0 1.432-4.635l43.237 14.737z" fill="#C2C7CF" />
        <defs>
            <linearGradient id="nva20nnh7a" x1="7.348" y1="61.535" x2="57.326" y2="61.535" gradientUnits="userSpaceOnUse">
                <stop offset=".056" stopColor="#E2E8F0" />
                <stop offset=".135" stopColor="#D8DEE5" stopOpacity=".91" />
                <stop offset=".272" stopColor="#BDC2C9" stopOpacity=".753" />
                <stop offset=".451" stopColor="#91959A" stopOpacity=".548" />
                <stop offset=".666" stopColor="#545659" stopOpacity=".303" />
                <stop offset=".908" stopColor="#080808" stopOpacity=".026" />
                <stop offset=".931" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="60vw3hys5b" x1=".991" y1="60.489" x2="47.933" y2="60.489" gradientUnits="userSpaceOnUse">
                <stop offset=".056" stopColor="#E2E8F0" />
                <stop offset=".138" stopColor="#D9DFE7" stopOpacity=".911" />
                <stop offset=".273" stopColor="#C1C6CD" stopOpacity=".764" />
                <stop offset=".447" stopColor="#9A9EA4" stopOpacity=".576" />
                <stop offset=".65" stopColor="#64676A" stopOpacity=".354" />
                <stop offset=".877" stopColor="#202122" stopOpacity=".108" />
                <stop offset=".977" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);
