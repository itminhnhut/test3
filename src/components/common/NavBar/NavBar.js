import Axios from 'axios';
import { NAV_DATA, SPOTLIGHT, USER_CP } from 'src/components/common/NavBar/constants';
import PocketNavDrawer from 'src/components/common/NavBar/PocketNavDrawer';
import NotificationList from 'src/components/notification/NotificationList';
import SvgIcon from 'src/components/svg';
import SvgMenu from 'src/components/svg/Menu';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import SvgDocument from 'src/components/svg/SvgDocument';
import SvgExit from 'src/components/svg/SvgExit';
import SvgIdentifyCard from 'src/components/svg/SvgIdentifyCard';
import SvgLayout from 'src/components/svg/SvgLayout';
import SvgLock from 'src/components/svg/SvgLock';
import SvgReward from 'src/components/svg/SvgReward';
import SvgUser from 'src/components/svg/SvgUser';
import SvgUserPlus from 'src/components/svg/SvgUserPlus';
import SpotSetting from 'src/components/trade/SpotSetting';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { useAsync } from 'react-use';
import { API_GET_VIP } from 'redux/actions/apis';
import { getMarketWatch } from 'redux/actions/market';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import { buildLogoutUrl } from 'src/utils';
import { useWindowSize } from 'utils/customHooks';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import GridLayoutSettings from './GridLayoutSettings';
import FuturesSetting from 'src/components/screens/Futures/FuturesSetting';
import HrefButton from 'src/components/common/V2/ButtonV2/HrefButton';
import LanguageSetting from './LanguageSetting';
import { KYC_STATUS } from 'redux/actions/const';
import Copy from 'components/svg/Copy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TagV2 from '../V2/TagV2';
import { ChevronRight } from 'react-feather';
import { BxsUserIcon, FutureExchangeIcon, FutureIcon, FuturePortfolioIcon, FutureWalletIcon, SuccessfulTransactionIcon } from '../../svg/SvgIcon';
import NavbarIcons from './Icons';
import AuthButton from './AuthButton';
import Button from '../V2/ButtonV2/Button';
import TextCopyable from 'components/screens/Account/TextCopyable';

export const NAVBAR_USE_TYPE = {
    FLUENT: 'fluent',
    LIGHT: THEME_MODE.LIGHT,
    DARK: THEME_MODE.DARK
};

const NAV_HIDE_THEME_BUTTON = ['maldives_landingpage'];

const NavBar = ({
    style,
    layoutStateHandler,
    useOnly,
    name,
    page,
    changeLayoutCb,
    useGridSettings,

    spotState,
    resetDefault,
    onChangeSpotState
}) => {
    // * Initial State
    const [state, set] = useState({
        isDrawer: false,
        hideOnScroll: true,
        pairsLength: '--',
        loadingVipLevel: false,
        vipLevel: null
    });
    const setState = (_state) => set((prevState) => ({ ...prevState, ..._state }));

    // * Use hooks
    const [currentTheme, onThemeSwitch] = useDarkMode();
    const [currentLocale, onChangeLang] = useLanguage();
    const router = useRouter();
    const isHomePage = useMemo(() => router.pathname === '/', [router]);
    const { user: auth } = useSelector((state) => state.auth) || null;
    const { width } = useWindowSize();
    const { t } = useTranslation(['navbar', 'common', 'profile']);
    const [isFromFrame, setIsFromFrame] = useState(false);

    // * Memmoized Variable
    const navTheme = useMemo(() => {
        const result = {
            wrapper: '',
            text: '',
            color: ''
        };
        switch (useOnly) {
            case NAVBAR_USE_TYPE.FLUENT:
                result.wrapper = '';
                result.text = 'text-txtPrimary-dark';
                result.color = colors.gray[4];
                break;
            case NAVBAR_USE_TYPE.DARK:
                result.wrapper = 'mal-navbar__wrapper__use__dark';
                result.text = 'text-txtPrimary-dark';
                result.color = colors.gray[4];
                break;
            case NAVBAR_USE_TYPE.LIGHT:
                result.wrapper = 'mal-navbar__wrapper__use__light';
                result.text = 'text-txtPrimary';
                result.color = colors.darkBlue;
                break;
            default: //'mal-navbar__wrapper__no__blur';
                result.wrapper = '';
                result.text = 'text-txtPrimary dark:text-txtPrimary-dark';
                result.color = currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue;
                break;
        }

        return result;
    }, [useOnly, currentTheme]);

    // * Helper
    const onDrawerAction = (status) => {
        setState({ isDrawer: status });
        layoutStateHandler && layoutStateHandler({ isDrawer: status });
    };

    const getVip = async () => {
        setState({ loadingVipLevel: true });
        try {
            const { data } = await Axios.get(API_GET_VIP);
            if (data?.status === 'ok' && data?.data) {
                setState({ vipLevel: data?.data.level });
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`);
        } finally {
            setState({ loadingVipLevel: false });
        }
    };

    // * Render Handler
    const renderDesktopNavItem = useCallback(() => {
        const feeNavObj = NAV_DATA.find((o) => o.localized === 'fee');

        return NAV_DATA.map((item) => {
            const { key, title, localized, isNew, url, child_lv1 } = item;

            if (item.hide) return null;

            if (localized === 'fee' && width < 1200) return null;

            if (localized === 'more') {
                if (width >= 1200) return null;
                const child_clone = [...child_lv1];
                child_clone.push({
                    ...feeNavObj,
                    key: 'fee_clone'
                });

                if (child_clone && child_clone.length) {
                    const itemsLevel1 = [];
                    const shouldDot = child_clone.findIndex((o) => o.isNew);

                    child_clone.map((child) => {
                        itemsLevel1.push(
                            <Link href={child.url} key={`${child.title}_${child.key}`}>
                                <a className="mal-navbar__link__group___item___childen__lv1___item">
                                    {t(`navbar:menu.${child.localized}`)}
                                    {child.isNew && <div className="mal-dot__newest" />}
                                </a>
                            </Link>
                        );
                    });

                    return (
                        <div className="h-full flex items-center" key={`${title}_${key}__withchild`}>
                            <div className="mal-navbar__link__group___item">
                                <div className="flex items-center">
                                    {t(`navbar:menu.${localized}`)}

                                    {shouldDot !== -1 && shouldDot >= 0 && <div className="mal-dot__newest" />}
                                </div>
                                <SvgIcon
                                    name="chevron_down"
                                    size={16}
                                    style={{
                                        paddingTop: 4,
                                        marginLeft: 8
                                    }}
                                    color={colors.gray[7]}
                                />
                                <div className="mal-navbar__link__group___item___childen__lv1">{itemsLevel1}</div>
                            </div>
                        </div>
                    );
                }
            }

            if (child_lv1 && child_lv1.length) {
                const itemsLevel1 = [];
                const itemsLevel1withIcon = [];
                const useDropdownWithIcon = localized === 'product' || localized === 'trade';
                const useOneCol = localized === 'trade';

                const shouldDot = child_lv1.findIndex((o) => o.isNew);

                child_lv1.map((child) => {
                    itemsLevel1.push(
                        <Link href={child.url} key={`${child.title}_${child.key}`}>
                            <a className="mal-navbar__link__group___item___childen__lv1___item">
                                {t(`navbar:submenu.${child.localized}`)} {child.isNew && <div className="mal-dot__newest" />}
                            </a>
                        </Link>
                    );
                });

                // DROPDOWN WITH ICON
                child_lv1.map((child) => {
                    const shouldReload = child?.localized === 'advance';

                    const Icon = NavbarIcons[child?.localized];
                    if (shouldReload) {
                        itemsLevel1withIcon.push(
                            <div
                                key={`${child.title}_${child.key}`}
                                className={
                                    useOneCol
                                        ? 'mal-navbar__link__group___item___childen__lv1___item2 min-w-[350px]'
                                        : 'mal-navbar__link__group___item___childen__lv1___item2'
                                }
                                onClick={() => window?.open(child.url, '_self')}
                            >
                                <div className="mal-navbar__link__group___item___childen__lv1___item2__icon">
                                    {Icon ? (
                                        <Icon size={24} />
                                    ) : (
                                        <img
                                            src={getS3Url(getIcon(child.localized))}
                                            width={width >= 2560 ? '38' : '32'}
                                            height={width >= 2560 ? '38' : '32'}
                                            alt=""
                                        />
                                    )}
                                </div>
                                <div className="mal-navbar__link__group___item___childen__lv1___item2___c">
                                    <div className="mal-navbar__link__group___item___childen__lv1___item2___c__title">
                                        {t(`navbar:submenu.${child.localized}`)}
                                        {/* {child.isNew && <div className="mal-dot__newest"/> */}
                                    </div>
                                    <div className="mal-navbar__link__group___item___childen__lv1___item2___c__description">
                                        {t(
                                            `navbar:submenu.${child.localized}_description`,
                                            child.localized === 'spot'
                                                ? {
                                                      pairsLength: state.pairsLength
                                                  }
                                                : undefined
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        itemsLevel1withIcon.push(
                            <Link href={child.url} key={`${child.title}_${child.key}`}>
                                <a
                                    className={
                                        useOneCol
                                            ? 'mal-navbar__link__group___item___childen__lv1___item2 min-w-[350px]'
                                            : 'mal-navbar__link__group___item___childen__lv1___item2'
                                    }
                                >
                                    <div className="mal-navbar__link__group___item___childen__lv1___item2__icon">
                                        {Icon ? (
                                            <Icon size={24} />
                                        ) : (
                                            <img
                                                src={getS3Url(getIcon(child.localized))}
                                                width={width >= 2560 ? '38' : '32'}
                                                height={width >= 2560 ? '38' : '32'}
                                                alt=""
                                            />
                                        )}
                                    </div>
                                    <div className="mal-navbar__link__group___item___childen__lv1___item2___c">
                                        <div className="mal-navbar__link__group___item___childen__lv1___item2___c__title">
                                            {t(`navbar:submenu.${child.localized}`)}
                                            {/* {child.isNew && <div className="mal-dot__newest"/> */}
                                        </div>
                                        <div className="mal-navbar__link__group___item___childen__lv1___item2___c__description">
                                            {t(
                                                `navbar:submenu.${child.localized}_description`,
                                                child.localized === 'spot'
                                                    ? {
                                                          pairsLength: state.pairsLength
                                                      }
                                                    : undefined
                                            )}
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        );
                    }
                });

                return (
                    <div className="h-full flex items-center" key={`${title}_${key}__withchild`}>
                        <div className="mal-navbar__link__group___item">
                            <div className="flex items-center">
                                {t(`navbar:menu.${localized}`)}

                                {shouldDot !== -1 && shouldDot >= 0 && <div className="mal-dot__newest" />}
                            </div>
                            <SvgIcon name="chevron_down" size={16} className="chevron__down !ml-1" color={colors.gray[7]} style={{ marginLeft: 4 }} />
                            <div
                                className={`mal-navbar__link__group___item___childen__lv1
                                           ${useDropdownWithIcon ? 'mal-navbar__link__group___item___childen__lv1__w__icon' : ''}
                                           ${
                                               useOneCol && useDropdownWithIcon
                                                   ? 'mal-navbar__link__group___item___childen__lv1__w__icon flex-col !min-w-0'
                                                   : ''
                                           }`}
                            >
                                {useDropdownWithIcon ? itemsLevel1withIcon : itemsLevel1}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <Link key={`${title}_${key}`} href={url}>
                    <a className="mal-navbar__link__group___item">
                        {t(`navbar:menu.${localized}`)} {isNew ? <div className="mal-dot__newest" /> : null}
                    </a>
                </Link>
            );
        });
    }, [width, router, state.pairsLength, navTheme.color]);

    const renderThemeButton = useCallback(() => {
        if (NAV_HIDE_THEME_BUTTON.includes(name)) return null;
        return (
            <div className="mal-navbar__svg_dominant cursor-pointer text-txtSecondary dark:text-txtSecondary-dark hover:text-dominant" onClick={onThemeSwitch}>
                {currentTheme !== THEME_MODE.LIGHT ? <SvgMoon size={20} color="currentColor" /> : <SvgSun size={20} color="currentColor" />}
            </div>
        );
    }, [name, currentTheme, navTheme.color]);

    const renderUserControl = useCallback(() => {
        const { avatar, username, code, email, kyc_status } = auth;
        const isNotVerified = kyc_status === KYC_STATUS.NO_KYC;
        const isVerifying = kyc_status === KYC_STATUS.PENDING_APPROVAL;
        const isVerified = kyc_status >= KYC_STATUS.APPROVED;

        const items = [];

        let color;
        if (useOnly === NAVBAR_USE_TYPE.FLUENT) {
            color = currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue;
        } else if (useOnly === NAVBAR_USE_TYPE.DARK) {
            color = colors.gray[4];
        } else if (useOnly === NAVBAR_USE_TYPE.LIGHT) {
            color = colors.darkBlue;
        } else {
            color = currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue;
        }

        // const getUserControlSvg = (localized) => {
        //     switch (localized) {
        //         case 'profile':
        //             return <SvgUser type={2} color={color} />;
        //         case 'identify':
        //             return <SvgIdentifyCard color={color} />;
        //         case 'referral':
        //             return <SvgUserPlus color={color} />;
        //         case 'reward_center':
        //             return <SvgReward color={color} />;
        //         case 'task_center':
        //             return <SvgDocument color={color} />;
        //         case 'logout':
        //             return <SvgExit color={color} />;
        //         case 'api_mng':
        //             return <SvgLayout color={color} />;
        //         case 'security':
        //             return <SvgLock color={color} />;
        //         default:
        //             return null;
        //     }
        // };

        USER_CP.map((item) => {
            if (item.hide) return null;
            const Icon = NavbarIcons?.[item.localized === 'referral' ? 'profile_referral' : item.localized];
            items.push(
                <Link key={`user_cp__${item.localized}`} href={item.localized === 'logout' ? buildLogoutUrl() : item.url}>
                    <a className="mal-navbar__dropdown___item rounded-xl justify-between !text-base">
                        <div className="flex items-center font-normal">
                            <div className="dark:text-txtSecondary-dark text-txtSecondary">
                                <Icon color="currentColor" size={24} />
                            </div>

                            {t(`navbar:menu.user.${item.localized}`)}
                        </div>
                        <ChevronRight className="!mr-0" size={16} />
                    </a>
                </Link>
            );
        });

        return (
            <div className="mal-navbar__dropdown">
                <div className="mal-navbar__dropdown__wrapper  min-w-[436px] !p-6">
                    <div className="mal-navbar__dropdown__user__info justify-between items-center ">
                        <div className="flex items-center">
                            <div className="mal-navbar__dropdown__user__info__avt">
                                <img src={avatar} alt="" />
                            </div>
                            <div className="mal-navbar__dropdown__user__info__summary">
                                <div className="mal-navbar__dropdown__user__info__username">{!isVerified ? 'GUEST' : username || 'GUEST'}</div>
                                <div className="text-txtSecondary items-center flex">
                                    <TextCopyable text={code} />
                                </div>
                            </div>
                        </div>
                        {!isNotVerified && (
                            <TagV2 type={isVerified ? 'success' : 'warning'} className="py-2 px-3 ml-[22px]">
                                <div className={`text-sm ${isVerified ? 'text-dominant' : 'text-yellow-100'}`}>
                                    {isVerified ? t('navbar:verified') : t('navbar:pending_approval')}
                                </div>
                            </TagV2>
                        )}
                    </div>
                    {isNotVerified && (
                        <Button onClick={() => window.open(PATHS.ACCOUNT.IDENTIFICATION)} className="mb-6 ">
                            {t('navbar:verify_account')}
                        </Button>
                    )}

                    <hr className="border-divider dark:border-divider-dark mb-6" />
                    {/* <UserVip loadingVipLevel={state.loadingVipLevel} vipLevel={state.vipLevel} t={t} /> */}
                    <Link href={PATHS.FEE_STRUCTURES.TRADING}>
                        <div className="flex items-center px-4 justify-between mb-6">
                            <div className="flex items-center ">
                                <SuccessfulTransactionIcon size={24} />
                                <div className="text-dominant font-semibold ml-2">
                                    {state.loadingVipLevel ? <PulseLoader size={3} color={colors.teal} /> : `VIP ${state.vipLevel || '0'}`}
                                </div>
                            </div>
                            <div className="flex items-center ">
                                <div className=" ">
                                    {t('navbar:use')} <span className="text-dominant uppercase">NAMI</span> - {t('navbar:get_discount')}
                                </div>
                                <ChevronRight className="!mr-0 ml-1" size={16} />
                            </div>
                        </div>
                    </Link>

                    <hr className="border-divider dark:border-divider-dark mb-6" />
                    <div className="mb-6">{items}</div>

                    <hr className="border-divider dark:border-divider-dark mb-6" />

                    <Link href={buildLogoutUrl()}>
                        <a className="mal-navbar__dropdown___item rounded-xl justify-between  !text-base">
                            <div className="flex items-center font-normal ">
                                <div className="dark:text-txtSecondary-dark text-txtSecondary">
                                    {NavbarIcons?.['logout']({ size: 24, color: 'currentColor' })}
                                </div>
                                {t('navbar:menu.user.logout')}
                            </div>
                        </a>
                    </Link>
                </div>
            </div>
        );
    }, [auth, currentTheme, useOnly, state.vipLevel, state.loadingVipLevel]);

    const renderWallet = () => {
        return (
            <div className="mal-navbar__dropdown">
                <div className="mal-navbar__dropdown__wrapper">
                    <Link href={PATHS.WALLET.DEFAULT}>
                        <a style={{ minWidth: 180 }} className="mal-navbar__dropdown___item">
                            <FuturePortfolioIcon size={24} />
                            {/* <img src={getS3Url('/images/icon/ic_overview.png')} width="28" height="28" alt="" className="mr-3 my-0.5" /> */}
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{t('common:overview')}</span>
                        </a>
                    </Link>
                    <Link href={PATHS.WALLET.EXCHANGE.DEFAULT}>
                        <a style={{ minWidth: 180 }} className="mal-navbar__dropdown___item">
                            <FutureExchangeIcon size={24} />
                            {/* <img src={getS3Url('/images/icon/ic_exchange.png')} width="28" height="28" alt="" className="mr-3 my-0.5" /> */}
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:menu.wallet')} Exchange</span>
                        </a>
                    </Link>
                    <Link href={PATHS.WALLET.FUTURES}>
                        <a className="mal-navbar__dropdown___item">
                            <FutureIcon size={24} />

                            {/* <img src={getS3Url('/images/icon/ic_futures.png')} width="28" height="28" alt="" className="mr-3 my-0.5" /> */}
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:menu.wallet')} Futures</span>
                        </a>
                    </Link>
                    {/* <Link href={PATHS.WALLET.STAKING}>
                        <a className='mal-navbar__dropdown___item'>
                            <img
                                src={getS3Url('/images/icon/ic_staking.png')}
                                width='28'
                                height='28'
                                alt=''
                                className='mr-3 my-0.5'
                            />
                            <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                                {t('navbar:menu.wallet')} Staking
                            </span>
                        </a>
                    </Link>
                    <Link href={PATHS.WALLET.FARMING}>
                        <a className='mal-navbar__dropdown___item'>
                            <img
                                src={getS3Url('/images/icon/ic_farming.png')}
                                width='28'
                                height='28'
                                alt=''
                                className='mr-3 my-0.5'
                            />
                            <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                                {t('navbar:menu.wallet')} Farming
                            </span>
                        </a>
                    </Link> */}
                </div>
            </div>
        );
    };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        setIsFromFrame(urlParams.get('source') === 'frame');
    }, [router]);

    useAsync(async () => {
        const pairs = await getMarketWatch();
        if (pairs && pairs.length) setState({ pairsLength: pairs.length });
    }, []);

    useEffect(() => {
        getVip();
    }, []);

    return (
        <>
            <PocketNavDrawer
                isActive={state.isDrawer}
                onClose={() => onDrawerAction(false)}
                loadingVipLevel={state.loadingVipLevel}
                vipLevel={state.vipLevel}
                page={page}
                spotState={spotState}
                resetDefault={resetDefault}
                onChangeSpotState={onChangeSpotState}
            />

            {isFromFrame && (
                <div
                    style={style || {}}
                    className={`mal-navbar__wrapper
                            // ${useOnly === NAVBAR_USE_TYPE.FLUENT ? 'mal-navbar__visible__blur' : ''}
                            // ${
                                state.hideOnScroll
                                    ? `mal-navbar__visible ${useOnly === NAVBAR_USE_TYPE.FLUENT ? 'mal-navbar__visible__blur' : ''}`
                                    : 'mal-navbar__hidden'
                            }
                            ${navTheme.wrapper}
                 `}
                >
                    <a className="block mal-navbar__logo" onClick={() => router.back()}>
                        <img src={getS3Url('/images/ic_back.png')} width="28" height="28" className="navbar__logo" alt="" />
                    </a>
                </div>
            )}
            {!isFromFrame && (
                <div
                    style={style || {}}
                    className={`mal-navbar__wrapper
                            // ${useOnly === NAVBAR_USE_TYPE.FLUENT ? 'mal-navbar__visible__blur' : ''}
                            // ${
                                state.hideOnScroll
                                    ? `mal-navbar__visible ${useOnly === NAVBAR_USE_TYPE.FLUENT ? 'mal-navbar__visible__blur' : ''}`
                                    : 'mal-navbar__hidden'
                            }
                            ${navTheme.wrapper}
                 `}
                >
                    <Link href="/">
                        <a className="block mal-navbar__logo">
                            <img
                                // src={getS3Url('/images/logo/nami-logo-v2.png')}
                                src={`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`}
                                width="94"
                                height="30"
                                className="navbar__logo"
                                alt=""
                            />
                        </a>
                    </Link>

                    {width >= 992 && (
                        <div className="mal-navbar__link__group">
                            {/* <SvgIcon name="hexagon" size={18} */}
                            {/*         className="ml-16" */}
                            {/*         onClick={() => console.log('namidev-DEBUG: should open product board')}/> */}

                            {renderDesktopNavItem()}

                            {/* Link Spotlight */}
                            {width >= 1200 && Object.keys(SPOTLIGHT).length ? (
                                <Link href="/">
                                    <a className="mal-navbar__link__spotlight">{t(`navbar:menu.${SPOTLIGHT?.localized}`)}</a>
                                </Link>
                            ) : null}
                        </div>
                    )}
                    <div className="mal-navbar__hamburger">
                        {!auth && (
                            <div className="flex flex-row items-center">
                                <AuthButton t={t} showSignInBreakPoint={1366} showSignUpBreakPoint={1090} />
                            </div>
                        )}
                        {auth && (
                            <>
                                {width >= 992 && (
                                    <div className="mal-navbar__user___wallet mal-navbar__with__dropdown mal-navbar__svg_dominant">
                                        <FutureWalletIcon size={24} />

                                        <SvgIcon name="chevron_down" size={24} color={colors.gray[7]} className="chevron__down" />
                                        {renderWallet()}
                                    </div>
                                )}
                                <div className="mal-navbar__user___avatar mal-navbar__with__dropdown mal-navbar__hamburger__spacing">
                                    {width >= 992 && (
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark hover:!text-dominant">
                                            <BxsUserIcon className="user__svg" size={24} />
                                        </div>
                                        // <SvgUser type={2} size={30} className="cursor-pointer user__svg" style={{ marginTop: -3 }} color={navTheme.color} />
                                    )}
                                    {width >= 992 && renderUserControl()}
                                </div>
                            </>
                        )}
                        {auth && <NotificationList btnClass="!mr-0" navTheme={navTheme} />}
                        {width >= 1366 && (
                            <div className="flex flex-row items-center mal-navbar__hamburger__spacing h-full">
                                {page === 'spot' ? (
                                    <SpotSetting
                                        changeLayoutCb={changeLayoutCb}
                                        spotState={spotState}
                                        resetDefault={resetDefault}
                                        onChangeSpotState={onChangeSpotState}
                                    />
                                ) : page === 'futures' ? (
                                    <FuturesSetting
                                        changeLayoutCb={changeLayoutCb}
                                        spotState={spotState}
                                        resetDefault={resetDefault}
                                        onChangeSpotState={onChangeSpotState}
                                    />
                                ) : (
                                    renderThemeButton()
                                )}

                                <LanguageSetting />
                            </div>
                        )}

                        {useGridSettings && <GridLayoutSettings />}

                        {width < 1366 && (
                            <div
                                className="relative"
                                onClick={(e) => {
                                    onDrawerAction(true);
                                }}
                            >
                                <SvgMenu size={25} className={`${width >= 768 ? 'mal-navbar__hamburger__spacing' : 'ml-3'} cursor-pointer`} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export const NavBarBottomShadow = ({ style = {}, className = '' }) => {
    return (
        <div
            className={classNames('z-[99] -translate-y-full h-[20px]', className)}
            style={{
                boxShadow: ' 0px 15px 20px rgba(0, 0, 0, 0.03)',
                ...style
            }}
        />
    );
};

const getIcon = (localized) => {
    switch (localized) {
        case 'spot':
            return '/images/icon/ic_exchange.png';
        case 'futures':
            return '/images/icon/ic_futures.png';
        case 'swap':
            return '/images/icon/ic_swap_v2.png';
        case 'copytrade':
            return '/images/icon/ic_copytrade.png';
        case 'staking':
            return '/images/icon/ic_staking.png';
        case 'farming':
            return '/images/icon/ic_farming.png';
        case 'referral':
            return '/images/icon/ic_referral.png';
        case 'launchpad':
            return '/images/icon/ic_rocket.png';
        case 'classic':
            return '/images/icon/ic_trade_classic.png';
        case 'advance':
            return '/images/icon/ic_trade_advance.png';
        default:
            return '';
    }
};

export default NavBar;
