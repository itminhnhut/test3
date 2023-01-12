import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import { useSelector } from 'react-redux';
import { getLoginUrl } from 'src/redux/actions/utils';

const NoData = ({ text, loading = false }) => {
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
        <div className="flex flex-col space-y-3 items-center justify-center">
            {!user ? (
                <>
                    <img className="max-h-[124px]" src="/images/icon/ic_login.png" />
                    <a href={getLoginUrl('sso')}>
                        <span dangerouslySetInnerHTML={{ __html: t('common:sign_in_to_continue') }} />
                    </a>
                </>
            ) : (
                <>
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
                        <path
                            d="M102.627 22.744H83.109v.567h19.518v-.567zM96.752 25.185H83.11v.567h13.643v-.567zM96.752 27.625H83.11v.567h13.643v-.567z"
                            fill="#fff"
                        />
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
                    <span>{text ?? t('common:no_data')}</span>
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
