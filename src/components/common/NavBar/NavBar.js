import Axios from 'axios';
import { NAV_DATA, SPOTLIGHT, USER_CP } from 'src/components/common/NavBar/constants';
import PocketNavDrawer from 'src/components/common/NavBar/PocketNavDrawer';
import NotificationList from 'src/components/notification/NotificationList';
import SvgIcon from 'src/components/svg';
import SvgCheckSuccess from 'src/components/svg/CheckSuccess';
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
import SvgWallet from 'src/components/svg/Wallet';
import SpotSetting from 'src/components/trade/SpotSetting';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useLanguage from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { useAsync } from 'react-use';
import { API_GET_VIP } from 'redux/actions/apis';
import { getMarketWatch } from 'redux/actions/market';
import { getLoginUrl, getS3Url, getV1Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import { buildLogoutUrl } from 'src/utils';
import { useWindowSize } from 'utils/customHooks';

export const NAVBAR_USE_TYPE = {
    FLUENT: 'fluent',
    LIGHT: THEME_MODE.LIGHT,
    DARK: THEME_MODE.DARK,
};

const NAV_HIDE_THEME_BUTTON = [
    'maldives_landingpage',
];

const NavBar = ({
    style,
    layoutStateHandler,
    useOnly,
    name,
    page,
    changeLayoutCb,

    spotState,
    resetDefault,
    onChangeSpotState,
}) => {
    // * Initial State
    const [state, set] = useState({
        isDrawer: false,
        hideOnScroll: true,
        pairsLength: '--',
        loadingVipLevel: false,
        vipLevel: null,
    });
    const setState = (_state) => set(prevState => ({ ...prevState, ..._state }));

    // * Use hooks
    const [currentTheme, onThemeSwitch] = useDarkMode();
    const [currentLocale, onChangeLang] = useLanguage();

    const { user: auth } = useSelector(state => state.auth) || null;
    const { width } = useWindowSize();
    const { t } = useTranslation(['navbar', 'common']);

    // * Memmoized Variable
    const navTheme = useMemo(() => {
        const result = {
            wrapper: '',
            text: '',
            color: '',
        };
        switch (useOnly) {
            case NAVBAR_USE_TYPE.FLUENT:
                result.wrapper = '';
                result.text = 'text-txtPrimary-dark';
                result.color = colors.grey4;
                break;
            case NAVBAR_USE_TYPE.DARK:
                result.wrapper = 'mal-navbar__wrapper__use__dark';
                result.text = 'text-txtPrimary-dark';
                result.color = colors.grey4;
                break;
            case NAVBAR_USE_TYPE.LIGHT:
                result.wrapper = 'mal-navbar__wrapper__use__light';
                result.text = 'text-txtPrimary';
                result.color = colors.darkBlue;
                break;
            default:
                result.wrapper = 'mal-navbar__wrapper__no__blur';
                result.text = 'text-txtPrimary dark:text-txtPrimary-dark';
                result.color =
                    currentTheme === THEME_MODE.LIGHT
                        ? colors.darkBlue
                        : colors.grey4;
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
        const feeNavObj = NAV_DATA.find(o => o.localized === 'fee');

        return NAV_DATA.map(item => {
            const {
                key,
                title,
                localized,
                isNew,
                url,
                child_lv1,
            } = item;

            if (item.hide) return null;

            if (localized === 'fee' && width < 1200) return null;

            if (localized === 'more') {
                if (width >= 1200) return null;
                const child_clone = [...child_lv1];
                child_clone.push({
                    ...feeNavObj,
                    key: 'fee_clone',
                });

                if (child_clone && child_clone.length) {
                    const itemsLevel1 = [];
                    const shouldDot = child_clone.findIndex(o => o.isNew);

                    child_clone.map(child => {
                        itemsLevel1.push(
                            <Link href={child.url} key={`${child.title}_${child.key}`}>
                                <a className="mal-navbar__link__group___item___childen__lv1___item">
                                    {t(`navbar:menu.${child.localized}`)}
                                    {child.isNew && <div className="mal-dot__newest" />}
                                </a>
                            </Link>,
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
                                    size={15}
                                    style={{
                                        paddingTop: 4,
                                        marginLeft: 8,
                                    }}
                                    color="#F2F4F6"
                                />
                                <div className="mal-navbar__link__group___item___childen__lv1">
                                    {itemsLevel1}
                                </div>
                            </div>
                        </div>
                    );
                }
            }

            if (child_lv1 && child_lv1.length) {
                const itemsLevel1 = []
                const itemsLevel1withIcon = []
                const useDropdownWithIcon = localized === 'product' || localized === 'trade'
                const useOneCol = localized === 'trade'

                const shouldDot = child_lv1.findIndex(o => o.isNew);

                child_lv1.map(child => {
                    itemsLevel1.push(
                        <Link href={child.url} key={`${child.title}_${child.key}`}>
                            <a className="mal-navbar__link__group___item___childen__lv1___item">
                                {t(`navbar:submenu.${child.localized}`)} {child.isNew &&
                                <div className="mal-dot__newest" />}
                            </a>
                        </Link>,
                    );
                });

                // DROPDOWN WITH ICON
                child_lv1.map(child => {
                    itemsLevel1withIcon.push(
                        <Link href={child.url} key={`${child.title}_${child.key}`}>
                            <a className={useOneCol ? 'mal-navbar__link__group___item___childen__lv1___item2 min-w-[350px]' : 'mal-navbar__link__group___item___childen__lv1___item2'}>
                                <div className="mal-navbar__link__group___item___childen__lv1___item2__icon">
                                    <img
                                        src={getS3Url(getIcon(child.localized))}
                                        width={width >= 2560 ? '38' : '32'}
                                        height={width >= 2560 ? '38' : '32'}
                                        alt=""
                                    />
                                </div>
                                <div className="mal-navbar__link__group___item___childen__lv1___item2___c">
                                    <div className="mal-navbar__link__group___item___childen__lv1___item2___c__title">
                                        {t(`navbar:submenu.${child.localized}`)}
                                        {/* {child.isNew && <div className="mal-dot__newest"/> */}
                                    </div>
                                    <div
                                        className="mal-navbar__link__group___item___childen__lv1___item2___c__description"
                                    >
                                        {t(`navbar:submenu.${child.localized}_description`,
                                            child.localized === 'spot' ? { pairsLength: state.pairsLength } : undefined)}
                                    </div>
                                </div>
                            </a>
                        </Link>,
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
                                size={15}
                                className="chevron__down"
                                color={navTheme.color}
                                style={{ marginLeft: 4 }}
                            />
                            <div className={`mal-navbar__link__group___item___childen__lv1
                                           ${useDropdownWithIcon ? 'mal-navbar__link__group___item___childen__lv1__w__icon' : ''}
                                           ${useOneCol && useDropdownWithIcon ? 'mal-navbar__link__group___item___childen__lv1__w__icon flex-col !min-w-0' : ''}`}
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
    }, [width, state.pairsLength, navTheme.color]);

    const renderThemeButton = useCallback(() => {
        if (NAV_HIDE_THEME_BUTTON.includes(name)) return null;
        return (
            <a href="#" className="mal-navbar__hamburger__spacing mal-navbar__svg_dominant" onClick={onThemeSwitch}>
                {currentTheme !== THEME_MODE.LIGHT ?
                    <SvgMoon size={20} color={navTheme.color} />
                    : <SvgSun size={20} color={navTheme.color} />}
            </a>
        );
    }, [name, currentTheme, navTheme.color]);

    const renderUserControl = useCallback(() => {
        const {
            avatar,
            username,
            email,
        } = auth;
        const items = [];

        let color;
        if (useOnly === NAVBAR_USE_TYPE.FLUENT) {
            color = currentTheme === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue;
        } else if (useOnly === NAVBAR_USE_TYPE.DARK) {
            color = colors.grey4;
        } else if (useOnly === NAVBAR_USE_TYPE.LIGHT) {
            color = colors.darkBlue;
        } else {
            color = currentTheme === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue;
        }

        const getUserControlSvg = (localized) => {
            switch (localized) {
                case 'profile':
                    return <SvgUser type={2} color={color} />;
                case 'identify':
                    return <SvgIdentifyCard color={color} />;
                case 'referral':
                    return <SvgUserPlus color={color} />;
                case 'reward_center':
                    return <SvgReward color={color} />;
                case 'task_center':
                    return <SvgDocument color={color} />;
                case 'logout':
                    return <SvgExit color={colors.red2} />;
                case 'api_mng':
                    return <SvgLayout color={color} />;
                case 'security':
                    return <SvgLock color={color} />;
                default:
                    return null;
            }
        };

        USER_CP.map(item => {
            if (item.hide) return null;
            items.push(
                <Link
                    key={`user_cp__${item.localized}`}
                    href={item.localized === 'logout' ? buildLogoutUrl() : item.url}
                >
                    <a className="mal-navbar__dropdown___item">
                        {getUserControlSvg(item.localized)} {t(`navbar:menu.user.${item.localized}`)}
                    </a>
                </Link>,
            );
        });

        return (
            <div className="mal-navbar__dropdown">
                <div className="mal-navbar__dropdown__wrapper">
                    <div className="mal-navbar__dropdown__user__info">
                        <div className="mal-navbar__dropdown__user__info__avt">
                            <img src={avatar} alt="" />
                        </div>
                        <div className="mal-navbar__dropdown__user__info__summary">
                            <div className="mal-navbar__dropdown__user__info__username">
                                {username || 'Guest'} <SvgCheckSuccess />
                            </div>
                            <div className="mal-navbar__dropdown__user__info__level">
                                {state.loadingVipLevel ?
                                    <PulseLoader size={3} color={colors.teal} /> : `VIP ${state.vipLevel || '0'}`}
                            </div>
                        </div>
                    </div>
                    {items}
                </div>
            </div>
        );
    }, [auth, currentTheme, useOnly, state.vipLevel, state.loadingVipLevel]);

    const renderWallet = () => {
        return (
            <div className="mal-navbar__dropdown">
                <div className="mal-navbar__dropdown__wrapper">
                    <Link href="/wallet/exchange">
                        <a style={{ minWidth: 180 }} className="mal-navbar__dropdown___item">
                            <img
                                src={getS3Url('/images/icon/ic_wallet.png')}
                                width="32"
                                height="32"
                                alt=""
                                className="mr-3"
                            />
                            <span
                                className="text-txtPrimary dark:text-txtPrimary-dark"
                            >{t('navbar:menu.wallet')} Exchange
                            </span>
                        </a>
                    </Link>
                    <Link href={getV1Url('/wallet/account?type=futures')}>
                        <a className="mal-navbar__dropdown___item">
                            <img
                                src={getS3Url('/images/icon/ic_wallet.png')}
                                width="32"
                                height="32"
                                alt=""
                                className="mr-3"
                            />
                            <span
                                className="text-txtPrimary dark:text-txtPrimary-dark"
                            >{t('navbar:menu.wallet')} Futures
                            </span>
                        </a>
                    </Link>
                    <Link href={getV1Url('/wallet/account?type=staking')}>
                        <a className="mal-navbar__dropdown___item">
                            <img
                                src={getS3Url('/images/icon/ic_wallet.png')}
                                width="32"
                                height="32"
                                alt=""
                                className="mr-3"
                            />
                            <span
                                className="text-txtPrimary dark:text-txtPrimary-dark"
                            >{t('navbar:menu.wallet')} Staking
                            </span>
                        </a>
                    </Link>
                    <Link href={getV1Url('/wallet/account?type=farming')}>
                        <a className="mal-navbar__dropdown___item">
                            <img
                                src={getS3Url('/images/icon/ic_wallet.png')}
                                width="32"
                                height="32"
                                alt=""
                                className="mr-3"
                            />
                            <span
                                className="text-txtPrimary dark:text-txtPrimary-dark"
                            >{t('navbar:menu.wallet')} Farming
                            </span>
                        </a>
                    </Link>
                </div>
            </div>
        );
    };

    useAsync(async () => {
        const pairs = await getMarketWatch();
        if (pairs && pairs.length) setState({ pairsLength: pairs.length });
    }, []);

    useEffect(() => {
        getVip();
    }, []);

    return (
        <>
            <PocketNavDrawer isActive={state.isDrawer} onClose={() => onDrawerAction(false)} />
            <div
                style={style || {}}
                className={`mal-navbar__wrapper
                            // ${useOnly === NAVBAR_USE_TYPE.FLUENT ? 'mal-navbar__visible__blur' : ''}
                            // ${state.hideOnScroll ? `mal-navbar__visible ${useOnly === NAVBAR_USE_TYPE.FLUENT ? 'mal-navbar__visible__blur' : ''}` : 'mal-navbar__hidden'}
                            ${navTheme.wrapper}
                 `}
            >
                <Link href="/">
                    <a className="block mal-navbar__logo">
                        <img
                            src={getS3Url("/images/logo/nami_maldives.png")}
                            width="28"
                            height="25"
                            className="navbar__logo"
                            alt=""
                        />
                    </a>
                </Link>
                {width >= 992 &&
                <div className="mal-navbar__link__group pl-8">
                    {/* <SvgIcon name="hexagon" size={18} */}
                    {/*         className="ml-16" */}
                    {/*         onClick={() => console.log('namidev-DEBUG: should open product board')}/> */}

                    {renderDesktopNavItem()}

                    {/* Link Spotlight */}
                    {width >= 1200 && Object.keys(SPOTLIGHT).length ?
                        <Link href="/">
                            <a className="mal-navbar__link__spotlight">
                                {t(`navbar:menu.${SPOTLIGHT?.localized}`)}
                            </a>
                        </Link> : null}
                </div>}
                <div className="mal-navbar__hamburger">

                    {!auth && <div className="flex flex-row items-center mr-8">
                        {width >= 1366 &&
                        <Link href={getLoginUrl('sso', 'login')}>
                            <a className={`text-sm font-medium ${navTheme.text} whitespace-nowrap hover:!text-dominant`}>
                                {t('common:sign_in')}
                            </a>
                        </Link>}
                        {width >= 1090 &&
                        <Link href={getLoginUrl('sso', 'register')}>
                            <a className="text-sm font-medium text-dominant whitespace-nowrap ml-8 hover:underline">
                                {t('common:sign_up')}
                            </a>
                        </Link>}
                    </div>}
                    {auth &&
                    <>
                        {width >= 992 &&
                        <div className="mal-navbar__user___wallet mal-navbar__with__dropdown mal-navbar__svg_dominant">
                            <SvgWallet color={navTheme.color} />
                            <span className="ml-4" style={{ color: navTheme.color }}>
                                {t('navbar:menu.wallet')}
                            </span>
                            <SvgIcon
                                name="chevron_down"
                                size={15}
                                color={navTheme.color}
                                className="chevron__down"
                                style={{ marginLeft: 4 }}
                            />
                            {renderWallet()}
                        </div>}
                        <div
                            className="mal-navbar__user___avatar mal-navbar__with__dropdown mal-navbar__hamburger__spacing"
                        >
                            <SvgUser
                                type={2}
                                size={30}
                                className="cursor-pointer user__svg"
                                style={{ marginTop: -3 }}
                                color={navTheme.color}
                            />
                            {width >= 992 && renderUserControl()}
                        </div>
                    </>}
                    {auth && <NotificationList btnClass="!mr-0 ml-8" navTheme={navTheme} />}
                    {width >= 1366 &&
                    <div className="flex flex-row items-center mal-navbar__hamburger__spacing">
                        <a
                            className={`text-sm font-medium uppercase cursor-pointer flex items-center
                                       ${navTheme.text} whitespace-nowrap hover:!text-dominant`}
                            onClick={onChangeLang}
                        >
                            {currentLocale}
                        </a>
                        {
                            page === 'spot'
                                ? <SpotSetting
                                        changeLayoutCb={changeLayoutCb}
                                        spotState={spotState}
                                        resetDefault={resetDefault}
                                        onChangeSpotState={onChangeSpotState}
                                />
                                : renderThemeButton()
                        }

                    </div>}

                    {width < 1366 &&
                    <div
                        className="relative"
                        onClick={(e) => {
                            onDrawerAction(true);
                        }}
                    >
                        <SvgMenu
                            size={25}
                            className={`${width >= 768 ? 'mal-navbar__hamburger__spacing' : 'ml-3'} cursor-pointer`}
                            color={navTheme.color}
                        />
                    </div>}
                </div>
            </div>
        </>
    );
};

const getIcon = (localized) => {
    switch (localized) {
        case 'spot':
            return '/images/icon/ic_exchange.png';
        case 'futures':
            return '/images/icon/ic_futures.png';
        case 'swap':
            return '/images/icon/ic_swap.png';
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
