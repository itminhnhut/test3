import { MOBILE_NAV_DATA } from 'src/components/common/NavBar/constants';
import SvgIcon from 'src/components/svg';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { memo, useCallback, useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { X } from 'react-feather';
import { useSelector } from 'react-redux';
import { getS3Url, getLoginUrl } from 'redux/actions/utils';
import colors from 'styles/colors';
import { useWindowSize } from 'utils/customHooks';
import { PulseLoader } from 'react-spinners';
import { PATHS } from 'constants/paths';
import FuturesSetting from '../../screens/Futures/FuturesSetting';
import { AppleIcon, GooglePlayIcon, SuccessfulTransactionIcon, USAFlagIcon, VietnamFlagIcon } from '../../svg/SvgIcon';
import { KYC_STATUS, DefaultAvatar } from 'redux/actions/const';
import NavbarIcons from './Icons';
import Image from 'next/image';
import ButtonV2 from '../V2/ButtonV2/Button';
import TagV2 from '../V2/TagV2';
import { buildLogoutUrl } from 'src/utils';
import { useRouter } from 'next/router';

const PocketNavDrawer = memo(({ isActive, onClose, loadingVipLevel, vipLevel, page, spotState, resetDefault, onChangeSpotState }) => {
    const [state, set] = useState({
        navActiveLv1: {}
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const router = useRouter();

    const { user: auth } = useSelector((state) => state.auth) || null;
    const isNotVerified = auth?.kyc_status === KYC_STATUS.NO_KYC;
    const isVerified = auth?.kyc_status >= KYC_STATUS.APPROVED;
    const isPartner = auth?.partner_type === 2;

    useEffect(() => {
        if (isActive) {
            document.body.classList.add('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [isActive]);

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
            const { key, title, spaceLine, localized, isNew, url, child_lv1 } = nav;

            if ((title === 'Wallet' || title === 'Profile') && !auth) return null;

            if (child_lv1 && child_lv1.length) {
                const itemsLevel1 = [];
                child_lv1.forEach((item) => {
                    const { localized, notSameOrigin } = item;
                    const Icon = NavbarIcons?.[localized];
                    if (localized === 'partner' && !isPartner) return;
                    itemsLevel1.push(
                        <Link href={item.url} key={`${item.key}_${item.title}`}>
                            <a
                                className="mal-pocket-navbar__drawer__navlink__group___item__lv1__item mal-pocket-nabar__item___hover  !px-12"
                                onClick={() => onClose()}
                                target={notSameOrigin ? '_blank' : '_self'}
                            >
                                <div className="text-txtSecondary dark:text-txtSecondary-dark">{Icon ? <Icon size={24} /> : getIcon(localized)}</div>
                                <span className="ml-3 font-medium text-sm text-txtPrimary  dark:text-txtPrimary-dark">
                                    {t(`navbar:submenu.${item.localized}`)}
                                </span>
                            </a>
                        </Link>
                    );
                });

                return (
                    <>
                        <div key={`${title}_${key}`}>
                            <div
                                className={`relative mal-pocket-navbar__drawer__navlink__group___item ${spaceLine ? '!mb-0 ' : ' '}
                                    ${!state.navActiveLv1[`${title}_${key}`] ? 'mal-pocket-nabar__item___hover ' : 'bg-hover dark:bg-hover-dark'}`}
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
                        {spaceLine && <hr className="my-6 border-divider dark:border-divider-dark" />}
                    </>
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
            <div className={`mal-overlay !fixed ${isActive ? 'mal-overlay__active left' : ''}`} onClick={onClose} />
            <Div100vh className={`mal-pocket-navbar__drawer ${isActive ? 'mal-pocket-navbar__drawer__active' : ''}`}>
                <div className="mal-pocket-navbar__drawer__content___wrapper">
                    <div className="absolute right-4">
                        <X style={{ cursor: 'pointer' }} onClick={onClose} />
                    </div>

                    {!auth ? (
                        <>
                            <div className="pl-4">
                                <Image
                                    // src={getS3Url('/images/logo/nami-logo-v2.png')}
                                    src={getS3Url(`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`)}
                                    width={94}
                                    height={30}
                                />
                            </div>

                            <div className="flex flex-row justify-center items-center user__button py-4 mx-4 relative">
                                <div className="rounded-xl w-full h-full left-0 absolute z-[-1]">
                                    <Image
                                        className="rounded-xl"
                                        layout="fill"
                                        src={getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)}
                                    />
                                </div>
                                <ButtonV2
                                    className=" max-w-[132px] !text-sm"
                                    variants="text"
                                    onClick={() => {
                                        window.open(getLoginUrl('sso', 'login'), '_self');
                                    }}
                                >
                                    {t('common:sign_in')}
                                </ButtonV2>

                                <ButtonV2
                                    onClick={() => window.open(getLoginUrl('sso', 'register'), '_self')}
                                    className="ml-4 py-2 max-w-[132px] !h-[36px] rounded-md !text-sm"
                                >
                                    {t('common:sign_up')}
                                </ButtonV2>
                            </div>

                            <div className="my-4" />
                        </>
                    ) : (
                        <Link href={PATHS.ACCOUNT.PROFILE}>
                            <a className="flex items-center px-4 mb-6">
                                <img
                                    width={58}
                                    height={58}
                                    className="rounded-full min-w-[58px] max-w-[58px] min-h-[58px] max-h-[58px] w-full h-full object-cover"
                                    src={auth?.avatar || DefaultAvatar}
                                    alt="avatar_user"
                                />

                                <div className="ml-3">
                                    <div className="flex text-sm items-center font-semibold text-txtPrimary dark:text-txtPrimary-dark mb-2">
                                        {auth?.username || auth?.name || auth?.email}
                                    </div>

                                    <div className="text-txtSecondary text-xs items-center flex">
                                        <span className="pr-1">{auth?.code}</span>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    )}
                    {auth && (
                        <>
                            <hr className="border-divider dark:border-divider-dark mx-4 my-6 " />
                            <div className="flex items-center justify-between px-4 mb-4">
                                <div className="flex items-center ">
                                    <SuccessfulTransactionIcon size={24} />
                                    <div className="text-dominant font-semibold ml-2">
                                        {loadingVipLevel ? <PulseLoader size={3} color={colors.teal} /> : `VIP ${vipLevel || '0'}`}
                                    </div>
                                </div>
                                {!isNotVerified ? (
                                    <TagV2 type={isVerified ? 'success' : 'warning'} className="py-2 px-3 ml-[22px]">
                                        <div className={`text-sm ${isVerified ? 'text-dominant' : 'text-yellow-100'}`}>
                                            {isVerified ? t('navbar:verified') : t('navbar:pending_approval')}
                                        </div>
                                    </TagV2>
                                ) : (
                                    <ButtonV2 onClick={() => window.open(PATHS.ACCOUNT.IDENTIFICATION)} className="max-w-[150px] !text-sm">
                                        {t('navbar:verify_account')}
                                    </ButtonV2>
                                )}
                            </div>
                        </>
                    )}

                    {width < 992 && <div className="mal-pocket-navbar__drawer__navlink__group">{renderNavItem()}</div>}
                    <hr className="border-divider dark:border-divider-dark my-6" />
                    <div>
                        {page === 'futures' ? (
                            <div className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark ">
                                <div>{t('navbar:menu.mode')}</div>
                                <FuturesSetting spotState={spotState} resetDefault={resetDefault} onChangeSpotState={onChangeSpotState} className="px-0" />
                            </div>
                        ) : (
                            <a className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark " onClick={themeToggle}>
                                <div className="flex flex-row items-center">{t('navbar:menu.mode')}</div>
                                <div>{currentTheme !== 'dark' ? <SvgIcon name="sun" size={24} /> : <SvgIcon name="moon" size={24} />}</div>
                            </a>
                        )}
                        <a className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark " onClick={onChangeLang}>
                            <div className="flex flex-row items-center">{t('navbar:menu.lang')}</div>
                            <div className="rounded-full">{language === LANGUAGE_TAG.EN ? <USAFlagIcon size={24} /> : <VietnamFlagIcon size={24} />}</div>
                        </a>
                        <a className="mal-pocket-navbar__drawer__navlink__group___item text-txtPrimary dark:text-txtPrimary-dark hover:text-dominant mb-4">
                            <div className="flex flex-row items-center">{t('navbar:menu.download_app')}</div>
                        </a>
                        <div className="flex flex-row items-center gap-4 px-4">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a className="py-[6px] text-txtPrimary dark:text-txtPrimary-dark flex items-center justify-center w-1/2 border rounded-md border-divider dark:border-divider-dark">
                                    <AppleIcon color="currentColor" />

                                    <div className="ml-4">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">App Store</div>
                                    </div>
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a className="py-[6px] text-txtPrimary dark:text-txtPrimary-dark flex items-center justify-center w-1/2 border rounded-md border-divider dark:border-divider-dark ">
                                    <GooglePlayIcon />

                                    <div className="ml-4">
                                        <div className="text-xs mb-1">{t('navbar:trade_on')}</div>
                                        <div className="text-sm font-semibold ">CH Play</div>
                                    </div>
                                </a>
                            </Link>
                        </div>
                        {auth && (
                            <div className="px-4 w-full flex justify-center mt-8">
                                <ButtonV2 onClick={() => router.push(buildLogoutUrl())} variants="secondary" className=" font-semibold text-txtPrimary">
                                    {t('navbar:menu.user.logout')}
                                </ButtonV2>
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
            return <Image src={getS3Url('/images/icon/ic_exchange.png')} width="32" height="32" />;
        case 'swap':
            return <Image src={getS3Url('/images/icon/ic_swap.png')} width="32" height="32" />;
        case 'futures':
            return <Image src={getS3Url('/images/icon/ic_futures.png')} width="32" height="32" />;
        case 'launchpad':
            return <Image src={getS3Url('/images/icon/ic_rocket.png')} width="32" height="32" />;
        case 'copytrade':
            return <Image src={getS3Url('/images/icon/ic_copytrade.png')} width="32" height="32" />;
        case 'staking':
            return <Image src={getS3Url('/images/icon/ic_staking.png')} width="32" height="32" />;
        case 'farming':
            return <Image src={getS3Url('/images/icon/ic_farming.png')} width="32" height="32" />;
        case 'referral':
            return <Image src={getS3Url('/images/icon/ic_referral.png')} width="32" height="32" />;
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
