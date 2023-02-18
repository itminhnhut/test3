import Button from 'src/components/common/Button';
import { MOBILE_NAV_DATA } from 'src/components/common/NavBar/constants';
import SvgIcon from 'src/components/svg';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { ChevronDown, X } from 'react-feather';
import { useSelector } from 'react-redux';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import { useWindowSize } from 'utils/customHooks';
import SvgCheckSuccess from 'components/svg/CheckSuccess';
import { PulseLoader } from 'react-spinners';
import { PATHS } from 'constants/paths';
import { buildLogoutUrl } from 'utils';
import FuturesSetting from '../../screens/Futures/FuturesSetting';
import { AppleIcon, GooglePlayIcon, SuccessfulTransactionIcon } from '../../svg/SvgIcon';
import { KYC_STATUS } from 'redux/actions/const';
import NavbarIcons from './Icons';
import AuthButton from './AuthButton';
import HrefButton from '../V2/ButtonV2/HrefButton';
import ButtonV2 from '../V2/ButtonV2/Button';

const PocketNavDrawer = memo(({ isActive, onClose, loadingVipLevel, vipLevel, page, spotState, resetDefault, onChangeSpotState }) => {
    const [state, set] = useState({
        navActiveLv1: {}
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const { user: auth } = useSelector((state) => state.auth) || null;
    const isVerified = useMemo(() => auth?.kyc_status >= KYC_STATUS.APPROVED, [auth]);
    const { width } = useWindowSize();
    const {
        t,
        i18n: { language }
    } = useTranslation(['navbar', 'common']);
    const [currentTheme, onThemeSwitch] = useDarkMode();
    const [, onChangeLang] = useLanguage();

    const themeToggle = () => {
        onThemeSwitch();
        onClose();
    };

    const renderNavItem = useCallback(() => {
        return MOBILE_NAV_DATA.map((nav) => {
            const { key, title, localized, isNew, url, child_lv1 } = nav;

            if ((title === 'Wallet' || title === 'Profile') && !auth) return null;

            if (child_lv1 && child_lv1.length) {
                const itemsLevel1 = [];
                child_lv1.map((item) => {
                    const Icon = NavbarIcons[item?.localized];
                    const { localized } = item;
                    itemsLevel1.push(
                        <Link href={item.url} key={`${item.key}_${item.title}`}>
                            <a
                                className="mal-pocket-navbar__drawer__navlink__group___item__lv1__item mal-pocket-nabar__item___hover  !px-12"
                                onClick={() => onClose()}
                            >
                                {Icon ? <Icon size={24} /> : getIcon(localized)}
                                <span className="ml-3 font-medium text-sm text-txtPrimary  dark:text-txtPrimary-dark">
                                    {t(`navbar:submenu.${item.localized}`)}
                                </span>
                            </a>
                        </Link>
                    );
                });

                return (
                    <div key={`${title}_${key}`}>
                        <div
                            className={`relative mal-pocket-navbar__drawer__navlink__group___item
                                    ${!state.navActiveLv1[`${title}_${key}`] ? 'mal-pocket-nabar__item___hover' : ''}`}
                            onClick={() =>
                                setState({
                                    navActiveLv1: {
                                        [`${title}_${key}`]: !state.navActiveLv1[`${title}_${key}`]
                                    }
                                })
                            }
                        >
                            <div className="flex flex-row items-center">
                                {t(`navbar:menu.${localized}`)} {isNew && <span className="mal-dot__newest" />}
                            </div>
                            <div className={`transition duration-200 ease-in-out ${state.navActiveLv1[`${title}_${key}`] ? 'rotate-180' : ''}`}>
                                <SvgIcon
                                    name="chevron_down"
                                    size={16}
                                    className="group-hover:rotate-[360deg]"
                                    color={currentTheme === THEME_MODE.DARK ? colors.darkBlue5 : colors.darkBlue}
                                />
                                {/* <ChevronDown size={16} color={currentTheme !== THEME_MODE.LIGHT ? colors.gray[4] : colors.darkBlue} /> */}
                            </div>
                        </div>
                        <div
                            className={`mal-pocket-navbar__drawer__navlink__group___item__lv1
                                            ${state.navActiveLv1[`${title}_${key}`] ? 'mal-pocket-navbar__drawer__navlink__group___item__lv1__active' : ''}`}
                        >
                            {itemsLevel1}
                        </div>
                    </div>
                );
            }

            if (localized === 'support') {
                return (
                    <a
                        key={`${title}_${key}`}
                        className="mal-pocket-navbar__drawer__navlink__group___item mal-pocket-nabar__item___hover"
                        onClick={() => {
                            onClose();
                            window.fcWidget?.open();
                        }}
                    >
                        <div className="flex flex-row items-center">
                            {t(`navbar:menu.${localized}`)} {isNew && <span className="mal-dot__newest" />}
                        </div>
                    </a>
                );
            }

            return (
                <Link key={`${title}_${key}`} href={url}>
                    <a
                        className="mal-pocket-navbar__drawer__navlink__group___item mal-pocket-nabar__item___hover"
                        onClick={(e) => {
                            // e.preventDefault()
                            onClose();
                        }}
                    >
                        <div className="flex flex-row items-center">
                            {t(`navbar:menu.${localized}`)} {isNew && <span className="mal-dot__newest" />}
                        </div>
                    </a>
                </Link>
            );
        });
    }, [auth, state.navActiveLv1, currentTheme]);

    return (
        <>
            <div className={`mal-overlay ${isActive ? 'mal-overlay__active' : ''}`} onClick={onClose} />
            <Div100vh className={`mal-pocket-navbar__drawer ${isActive ? 'mal-pocket-navbar__drawer__active' : ''}`}>
                <div className="mal-pocket-navbar__drawer__content___wrapper">
                    <div className="absolute right-4">
                        <X style={{ cursor: 'pointer', marginRight: 16 }} onClick={onClose} />
                        {/* <SvgIcon
                            name='cross'
                            size={20}
                           
                        /> */}
                    </div>

                    {!auth ? (
                        <>
                            <img
                                // src={getS3Url('/images/logo/nami-logo-v2.png')}
                                src={`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`}
                                className="pl-4"
                                width="94"
                                height="36"
                            />

                            <div
                                style={{ background: 'linear-gradient(328deg, rgba(47,75,63,1) 0%, rgba(19,24,31,1) 50%, rgba(47,75,63,1) 100%)' }}
                                className="flex flex-row justify-center items-center user__button py-4  mx-4 rounded-md"
                            >
                                <AuthButton t={t} />
                            </div>
                            {/* <div className="flex flex-row justify-between user__button">
                                <div>
                                    <Button
                                        title={t('common:sign_in')}
                                        componentType="button"
                                        onClick={() => window.open(getLoginUrl('sso', 'login'), '_self')}
                                        type="secondary"
                                    />
                                </div>
                                <div>
                                    <Button
                                        title={t('common:sign_up')}
                                        componentType="button"
                                        onClick={() => window.open(getLoginUrl('sso', 'register'), '_self')}
                                        type="primary"
                                    />
                                </div>
                            </div> */}
                            <div
                                className="border-b border-divider dark:border-divider-dark"
                                style={{
                                    paddingLeft: 16,
                                    paddingRight: 16,
                                    marginTop: 16,
                                    marginBottom: 16
                                }}
                            />
                        </>
                    ) : (
                        <Link href={PATHS.ACCOUNT.PROFILE}>
                            <a className="flex items-center px-4 mb-6">
                                <div className="w-[58px] h-[58px] rounded-full overflow-hidden">
                                    <img src={auth?.avatar} alt="" />
                                </div>
                                <div className="ml-3">
                                    <div className="flex text-sm items-center font-semibold text-txtPrimary dark:text-txtPrimary-dark mb-2">
                                        {!isVerified ? 'GUEST' : auth?.username || 'GUEST'}
                                    </div>

                                    <div className="text-txtSecondary text-xs items-center flex">
                                        <span className="pr-1">{auth?.code}</span>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    )}
                    {auth && <hr className="border-divider dark:border-divider-dark mx-4 my-6 " />}

                    <div className="flex items-center px-4 mb-4">
                        <SuccessfulTransactionIcon size={24} />
                        <div className="text-dominant font-semibold ml-2">
                            {loadingVipLevel ? <PulseLoader size={3} color={colors.teal} /> : `VIP ${vipLevel || '0'}`}
                        </div>
                    </div>

                    {width < 992 && <div className="mal-pocket-navbar__drawer__navlink__group">{renderNavItem()}</div>}
                    <hr className="border-divider dark:border-divider-dark my-6" />
                    <div>
                        {page === 'futures' ? (
                            <div className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark hover:text-dominant">
                                <div>{t('navbar:menu.mode')}</div>
                                <FuturesSetting spotState={spotState} resetDefault={resetDefault} onChangeSpotState={onChangeSpotState} className="px-0" />
                            </div>
                        ) : (
                            <a
                                className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark hover:text-dominant"
                                onClick={themeToggle}
                            >
                                <div className="flex flex-row items-center">{t('navbar:menu.mode')}</div>
                                <div>{currentTheme !== 'dark' ? <SvgIcon name="sun" size={18} /> : <SvgIcon name="moon" size={18} />}</div>
                            </a>
                        )}
                        <a
                            className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark hover:text-dominant"
                            onClick={onChangeLang}
                        >
                            <div className="flex flex-row items-center">{t('navbar:menu.lang')}</div>
                            <div className="rounded-full">
                                {language === LANGUAGE_TAG.EN ? (
                                    <img src={getS3Url('/images/icon/ic_us_flag.png')} width="20" height="20" />
                                ) : (
                                    <img src={getS3Url('/images/icon/ic_vn_flag.png')} width="20" height="20" />
                                )}
                            </div>
                        </a>
                        <a className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark hover:text-dominant mb-4">
                            <div className="flex flex-row items-center">{t('navbar:menu.download_app')}</div>
                        </a>
                        <div className="flex flex-row items-center gap-4 px-4">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a className="py-[6px] flex items-center justify-center w-1/2 border rounded-md border-divider dark:border-divider-dark">
                                    <AppleIcon color="currentColor" />

                                    <div className="ml-4">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">App Store</div>
                                    </div>
                                    {/* <img
                                        style={{
                                            height: 37,
                                            width: 'auto'
                                        }}
                                        src={getS3Url('/images/download_app_store.png')}
                                        alt="Nami Exchange"
                                    /> */}
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a className="py-[6px] flex items-center justify-center w-1/2 border rounded-md border-divider dark:border-divider-dark ">
                                    <GooglePlayIcon />

                                    <div className="ml-4">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">CH Play</div>
                                    </div>
                                    {/* <img
                                        style={{
                                            height: 37,
                                            width: 'auto'
                                        }}
                                        src={getS3Url('/images/download_play_store.png')}
                                        alt="Nami Exchange"
                                    /> */}
                                </a>
                            </Link>
                        </div>
                        {auth && (
                            <div className="mal-pocket-navbar__drawer__navlink__group___item mt-8">
                                <ButtonV2 color="dark" className="bg-gray-10 font-semibold text-txtPrimary">
                                    {t('navbar:menu.user.logout')}
                                </ButtonV2>
                                {/* <HrefButton variants="secondary" href={buildLogoutUrl()}>
                                    {t('navbar:menu.user.logout')}
                                </HrefButton> */}
                                {/* <a
                                    href={buildLogoutUrl()}
                                    className="w-full text-center mt-4 bg-red py-3 rounded-xl text-white hover:text-white hover:opacity-60"
                                >
                                    {t('navbar:menu.user.logout')}
                                </a> */}
                            </div>
                        )}
                    </div>
                </div>
            </Div100vh>
        </>
    );
});

const getIcon = (code) => {
    switch (code) {
        case 'market':
            return <SvgIcon name="activity" size={20} style={{ marginRight: 8 }} />;
        case 'spot':
            return <img src={getS3Url('/images/icon/ic_exchange.png')} width="32" height="32" />;
        case 'swap':
            return <img src={getS3Url('/images/icon/ic_swap.png')} width="32" height="32" />;
        case 'futures':
            return <img src={getS3Url('/images/icon/ic_futures.png')} width="32" height="32" />;
        case 'launchpad':
            return <img src={getS3Url('/images/icon/ic_rocket.png')} width="32" height="32" />;
        case 'copytrade':
            return <img src={getS3Url('/images/icon/ic_copytrade.png')} width="32" height="32" />;
        case 'staking':
            return <img src={getS3Url('/images/icon/ic_staking.png')} width="32" height="32" />;
        case 'farming':
            return <img src={getS3Url('/images/icon/ic_farming.png')} width="32" height="32" />;
        case 'referral':
            return <img src={getS3Url('/images/icon/ic_referral.png')} width="32" height="32" />;
        case 'language':
            return <SvgIcon name="globe" size={18} style={{ marginRight: 8, marginLeft: 2 }} />;
        case 'moon':
            return <SvgIcon name="moon" size={20} style={{ marginRight: 8 }} />;
        case 'sun':
            return <SvgIcon name="sun" size={20} style={{ marginRight: 8 }} />;
        default:
            return null;
    }
};

export default PocketNavDrawer;
