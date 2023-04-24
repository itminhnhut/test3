import { useTranslation } from 'next-i18next';
import React from 'react';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useSelector } from 'react-redux';
import { getLoginUrl, getS3Url } from 'src/redux/actions/utils';
import Spiner from 'components/common/V2/LoaderV2/Spiner';

const NoData = ({ text, loading = false, isSearch = false, className = '', isAuth = false }) => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const user = useSelector((state) => state.auth.user) || isAuth;

    const isDark = currentTheme === THEME_MODE.DARK;
    if (loading) return <Spiner isDark={isDark} />;

    return (
        <div className={`flex flex-col space-y-3 items-center justify-center ${className}`}>
            {!user && !isSearch ? (
                <>
                    <img className="max-h-[124px]" src={getS3Url('/images/icon/ic_login.png')} />
                    <div className="flex space-x-1 text-txtSecondary dark:text-darkBlue-5 truncate overflow-x-auto">
                        <a href={getLoginUrl('sso')}>
                            <span
                                className="text-teal hover:underline cursor-pointer font-semibold"
                                dangerouslySetInnerHTML={{ __html: t('common:sign_in') }}
                            />
                        </a>
                        <div>{t('common:or')}</div>
                        <a href={getLoginUrl('sso', 'register')}>
                            <span
                                className="text-teal hover:underline cursor-pointer font-semibold"
                                dangerouslySetInnerHTML={{ __html: t('common:sign_up') }}
                            />
                        </a>
                        <div>{t('common:to_experience')}</div>
                    </div>
                </>
            ) : (
                <>
                    {isSearch ? isDark ? <NotFoundDarkIcon /> : <NotFoundLightIcon /> : isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
                    <span className={'text-txtSecondary dark:text-darkBlue-5 text-sm sm:text-base'}>
                        {text ?? (isSearch ? t('common:no_results_found') : t('common:no_data'))}
                    </span>
                </>
            )}
        </div>
    );
};

export default NoData;

export const NoDataLightIcon = ({ size }) => {
    const tempId = Date.now();
    const tempId_01 = 'ls10512bha' + tempId;
    const tempId_02 = 'xhrnpzl8nb' + tempId;

    return (
        <svg width={size ?? 124} height={size ?? 124} viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={tempId_01} x1="82.539" y1="106.923" x2="144.736" y2="30.209" gradientUnits="objectBoundingBox">
                    <stop offset=".008" stop-color="#C6CEDE" />
                    <stop offset=".22" stop-color="#D1D8E4" />
                    <stop offset=".315" stop-color="#D8DEE8" />
                    <stop offset=".852" stop-color="#F7F8FA" stop-opacity=".513" />
                    <stop offset=".977" stop-color="#fff" stop-opacity=".4" />
                </linearGradient>
                <linearGradient id={tempId_02} x1="103.243" y1="56.27" x2="146.839" y2="48.191" gradientUnits="objectBoundingBox">
                    <stop offset=".008" stop-color="#C6CEDE" />
                    <stop offset=".017" stop-color="#C7CFDE" />
                    <stop offset=".65" stop-color="#EFF2F6" />
                    <stop offset=".977" stop-color="#fff" />
                </linearGradient>
            </defs>
            {/* <path fill="#fff" d="M0 0h16x8v168H0z" /> */}
            <path
                d="m134.92 126.737-116.025 6.605-2.779-67.914-.463-11.017v-.263c0-.058-.029-.146-.029-.234l-.347-8.182c-.087-1.753 1.274-3.244 3.01-3.302l48.778-2.046c1.737-.058 3.184 1.286 3.271 3.04l.232 5.552 33.696-1.403V59.35h28.166l.261 8.27 2.229 59.117z"
                fill="#E9EEF4"
            />
            <path
                d="m152.641 70.042-17.369 60.198c-.319 1.082-1.39 1.841-2.635 1.9h-.028l-49.126 1.841-2.17.088-40.673 1.519-18.469.702c-1.737.058-3.184-1.14-3.271-2.689v-.234l18.787-58.65.55-1.724v-.03c.348-1.022 1.39-1.752 2.577-1.81l.81-.03 91.042-3.536 17.051-.672c1.939-.088 3.387 1.49 2.924 3.127z"
                fill={`url(#${tempId_01})`}
            />
            <path
                d="M132.434 59.3h-28.167V47.525l24.519-1.023c1.737-.087 3.185 1.286 3.271 3.01l.087 2.133.087 2.134.203 5.23v.293z"
                fill={`url(#${tempId_02})`}
            />
            <path
                d="M152.726 30.542v28.755h-20.292v-.292l-.203-5.23-.087-2.134-.087-2.133a3.11 3.11 0 0 0-3.271-3.01l-24.519 1.023V30.542h48.459z"
                fill="#E9EEF4"
            />
            <path d="M134.055 34.262H110v.701h24.055v-.701zM126.818 37.297H110V38h16.818v-.702zM126.818 40.37H110v.7h16.818v-.7z" fill="#fff" />
        </svg>
    );
};

export const NoDataDarkIcon = ({ size }) => {
    const id_01 = 'ky4xxhhbva' + Math.floor(Math.random() * 10000000000);
    const id_02 = 'ot2ez301nb' + Math.floor(Math.random() * 10000000000);

    return (
        <svg width={size ?? 124} height={size ?? 124} viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="m140.01 130.891-127.62 7.137-3.11-73.459-.475-11.926v-.27a2.286 2.286 0 0 1 0-.253l-.404-8.89c-.04-.91.285-1.8.904-2.472a3.471 3.471 0 0 1 2.4-1.114l53.645-2.216a3.485 3.485 0 0 1 2.496.923 3.438 3.438 0 0 1 1.097 2.41l.255 5.993 37.075-1.527v12.686h30.995l.282 8.942 2.46 64.036z"
                fill="#E2E8F0"
            />
            <path
                d="m159.513 69.552-19.108 65.126a3.024 3.024 0 0 1-1.116 1.482 3.06 3.06 0 0 1-1.775.56l-54.005 1.989-2.38.087-44.72 1.641-20.33.75a3.348 3.348 0 0 1-2.397-.73 3.3 3.3 0 0 1-1.205-2.184v-.253l20.594-63.452.606-1.858a3.065 3.065 0 0 1 1.11-1.43 3.099 3.099 0 0 1 1.728-.56h.879l100.155-3.83 18.766-.706c2.1-.122 3.682 1.623 3.198 3.368z"
                fill={`url(#${id_01})`}
            />
            <path
                d="M137.27 57.912h-30.996V45.184l26.963-1.108a3.453 3.453 0 0 1 2.485.89 3.39 3.39 0 0 1 1.109 2.381l.096 2.312.106 2.295.228 5.653.009.305z"
                fill={`url(#${id_02})`}
            />
            <path
                d="M159.577 26.801v31.111H137.27v-.305l-.228-5.653-.106-2.295-.096-2.312a3.39 3.39 0 0 0-1.109-2.381 3.43 3.43 0 0 0-2.485-.89l-26.972 1.108V26.8h53.303z"
                fill="#E2E8F0"
            />
            <path
                d="M139.043 30.814h-26.444v.768h26.444v-.768zM131.084 34.121h-18.485v.768h18.485v-.768zM131.084 37.428h-18.485v.768h18.485v-.768z"
                fill="#fff"
            />
            <defs>
                <linearGradient id={id_01} x1="81.945" y1="122.473" x2="101.632" y2="29.207" gradientUnits="userSpaceOnUse">
                    <stop offset=".01" stop-color="#9FA4AB" />
                    <stop offset=".26" stop-color="#9FA4AB" />
                    <stop offset=".35" stop-color="#A2A7AE" stop-opacity=".96" />
                    <stop offset=".46" stop-color="#ABAFB6" stop-opacity=".86" />
                    <stop offset=".6" stop-color="#BABDC2" stop-opacity=".7" />
                    <stop offset=".74" stop-color="#CFD1D4" stop-opacity=".47" />
                    <stop offset=".89" stop-color="#E9EAEB" stop-opacity=".18" />
                    <stop offset=".98" stop-color="#F9F9F9" stop-opacity="0" />
                </linearGradient>
                <linearGradient id={id_02} x1="94.976" y1="50.994" x2="146.389" y2="50.994" gradientUnits="userSpaceOnUse">
                    <stop offset=".01" stop-color="#9FA4AB" />
                    <stop offset=".19" stop-color="#9FA4AB" />
                    <stop offset=".33" stop-color="#A5AAB0" />
                    <stop offset=".52" stop-color="#B6BABF" />
                    <stop offset=".74" stop-color="#D2D4D7" />
                    <stop offset=".98" stop-color="#F9F9F9" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const NotFoundDarkIcon = () => (
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

const NotFoundLightIcon = () => (
    <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M54.559 61.674c0 8.567-5.044 15.953-12.318 19.345-7.317-2.65-12.563-9.68-12.563-17.904 0-9.456 6.932-17.324 15.976-18.793 5.393 3.882 8.905 10.204 8.905 17.352z"
            fill="url(#y413son5ja)"
        />
        <path
            d="M25.054 63.116c0-9.805 6.002-18.24 14.529-21.828a21.43 21.43 0 0 0-6.386-.972c-11.8 0-21.363 9.561-21.363 21.36 0 11.798 9.562 21.359 21.363 21.359.853 0 1.7-.05 2.525-.154-6.429-4.245-10.668-11.512-10.668-19.765z"
            fill="url(#fd0c64skgb)"
        />
        <path
            d="M71.928 67.906c.293-1.567.49-3.161.49-4.79 0-13.072-10.626-23.66-23.693-23.66-3.224 0-6.323.65-9.163 1.825-8.506 3.58-14.5 12.022-14.5 21.834 0 8.246 4.238 15.513 10.66 19.75a23.42 23.42 0 0 0 13.003 3.91c9.814 0 18.222-5.965 21.839-14.47l41.228 14.044 1.497-4.4-41.361-14.043zM67.5 66.409a18.226 18.226 0 0 1-1.336 4.4c-2.966 6.679-9.681 11.344-17.439 11.344-2.245 0-4.462-.392-6.484-1.14-7.303-2.637-12.549-9.68-12.549-17.89 0-9.45 6.911-17.338 15.97-18.807 1.007-.161 2.021-.231 3.063-.231 10.528 0 19.069 8.532 19.069 19.03 0 1.105-.098 2.217-.294 3.294z"
            fill="#C2C7CF"
        />
        <defs>
            <linearGradient id="y413son5ja" x1="22.261" y1="65.079" x2="53.663" y2="61.591" gradientUnits="userSpaceOnUse">
                <stop offset=".008" stopColor="#C6CEDE" />
                <stop offset=".209" stopColor="#D1D8E4" />
                <stop offset=".299" stopColor="#D8DEE8" />
                <stop offset=".505" stopColor="#DEE3EC" stopOpacity=".816" />
                <stop offset=".787" stopColor="#F0F2F6" stopOpacity=".562" />
                <stop offset=".967" stopColor="#fff" stopOpacity=".4" />
            </linearGradient>
            <linearGradient id="fd0c64skgb" x1="51.232" y1="62.741" x2="2.649" y2="59.866" gradientUnits="userSpaceOnUse">
                <stop offset=".385" stopColor="#C6CEDE" />
                <stop offset=".525" stopColor="#CCD3E2" stopOpacity=".759" />
                <stop offset=".719" stopColor="#DEE3EC" stopOpacity=".427" />
                <stop offset=".943" stopColor="#FBFCFD" stopOpacity=".041" />
                <stop offset=".967" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);
