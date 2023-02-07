import { useTranslation } from 'next-i18next';
import React from 'react';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useSelector } from 'react-redux';
import { getLoginUrl } from 'src/redux/actions/utils';
import Spiner from 'components/common/V2/LoaderV2/Spiner';

const NoData = ({ text, loading = false, isSearch = false, className = '' }) => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const user = useSelector((state) => state.auth.user);

    const isDark = currentTheme === THEME_MODE.DARK;
    if (loading) return <Spiner isDark={isDark} />;

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

const NoDataIcon = ({ isDark }) => (
    <svg width="125" height="124" viewBox="0 0 125 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            opacity="0.8"
            d="M103.343 96.6109L9.14743 101.878L6.85188 47.6588L6.50171 38.8562V38.6565C6.49827 38.5943 6.49827 38.532 6.50171 38.4698L6.20342 31.9081C6.17352 31.2361 6.41356 30.5798 6.87077 30.0835C7.32799 29.5873 7.96495 29.2916 8.64163 29.2615L48.2367 27.6259C48.5738 27.613 48.9102 27.6665 49.2264 27.7834C49.5426 27.9003 49.8324 28.0783 50.079 28.307C50.3256 28.5357 50.5241 28.8106 50.6631 29.1159C50.8021 29.4212 50.8788 29.7508 50.8889 30.0857L51.0769 34.5096L78.442 33.3827V42.7455H101.32L101.527 49.3459L103.343 96.6109Z"
            fill="#F7FAFF"
        />
        <path
            d="M117.738 51.3358L103.634 99.4057C103.482 99.8464 103.194 100.229 102.811 100.499C102.429 100.769 101.97 100.914 101.501 100.912L61.6401 102.381L59.8828 102.445L26.8761 103.656L11.8707 104.209C11.2327 104.266 10.5978 104.072 10.1012 103.671C9.60462 103.269 9.28558 102.691 9.21204 102.059V101.872L24.412 55.0384L24.8594 53.6668C25.0196 53.2415 25.3051 52.8739 25.6787 52.612C26.0523 52.3502 26.4967 52.2061 26.9539 52.1986H27.6024L101.527 49.3718L115.378 48.8502C116.928 48.76 118.095 50.0479 117.738 51.3358Z"
            fill="url(#paint0_linear_1016_120213)"
        />
        <path
            d="M101.321 42.7452H78.4432V33.3502L98.3445 32.5324C98.6788 32.5159 99.0131 32.5656 99.3279 32.6784C99.6427 32.7912 99.9319 32.965 100.179 33.1896C100.425 33.4142 100.625 33.6852 100.765 33.9869C100.906 34.2886 100.984 34.615 100.997 34.9471L101.068 36.6536L101.146 38.3471L101.314 42.5198L101.321 42.7452Z"
            fill="url(#paint1_linear_1016_120213)"
        />
        <path
            opacity="0.8"
            d="M117.785 19.7822V42.745H101.321V42.5196L101.152 38.3469L101.075 36.6534L101.003 34.9469C100.991 34.6148 100.912 34.2884 100.772 33.9867C100.631 33.685 100.432 33.414 100.185 33.1894C99.9384 32.9648 99.6492 32.791 99.3344 32.6782C99.0195 32.5654 98.6853 32.5158 98.351 32.5322L78.4432 33.35V19.7822H117.785Z"
            fill="#F7FAFF"
        />
        <path d="M102.63 22.7441H83.111V23.3108H102.63V22.7441Z" fill="white" />
        <path d="M96.7546 25.1855H83.111V25.7522H96.7546V25.1855Z" fill="white" />
        <path d="M96.7546 27.626H83.111V28.1926H96.7546V27.626Z" fill="white" />
        <defs>
            <linearGradient id="paint0_linear_1016_120213" x1="60.4859" y1="90.397" x2="75.0164" y2="21.5574" gradientUnits="userSpaceOnUse">
                <stop offset="0.01" stop-color="#9FA4AB" />
                <stop offset="0.26" stop-color="#9FA4AB" />
                <stop offset="0.35" stop-color="#A2A7AE" stop-opacity="0.96" />
                <stop offset="0.46" stop-color="#ABAFB6" stop-opacity="0.86" />
                <stop offset="0.6" stop-color="#BABDC2" stop-opacity="0.7" />
                <stop offset="0.74" stop-color="#CFD1D4" stop-opacity="0.47" />
                <stop offset="0.89" stop-color="#E9EAEB" stop-opacity="0.18" />
                <stop offset="0.98" stop-color="#F9F9F9" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_1016_120213" x1="70.104" y1="37.6388" x2="108.052" y2="37.6388" gradientUnits="userSpaceOnUse">
                <stop offset="0.01" stop-color="#9FA4AB" />
                <stop offset="0.19" stop-color="#9FA4AB" />
                <stop offset="0.33" stop-color="#A5AAB0" />
                <stop offset="0.52" stop-color="#B6BABF" />
                <stop offset="0.74" stop-color="#D2D4D7" />
                <stop offset="0.98" stop-color="#F9F9F9" />
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
