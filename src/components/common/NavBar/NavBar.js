import Axios from 'axios';
import { NAV_DATA, SPOTLIGHT, USER_CP } from 'src/components/common/NavBar/constants';
import SvgIcon from 'src/components/svg';
import SvgMenu from 'src/components/svg/Menu';
import SvgMoon from 'src/components/svg/Moon';
import SvgSun from 'src/components/svg/Sun';
import SpotSetting from 'src/components/trade/SpotSetting';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { useAsync } from 'react-use';
import { API_GET_VIP } from 'redux/actions/apis';
import { getMarketWatch } from 'redux/actions/market';
import { getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import { buildLogoutUrl } from 'src/utils';
import { useWindowSize } from 'utils/customHooks';
import { PATHS } from 'constants/paths';
import { Router, useRouter } from 'next/router';
import classNames from 'classnames';
import FuturesSetting from 'src/components/screens/Futures/FuturesSetting';
import LanguageSetting from './LanguageSetting';
import { KYC_STATUS, DefaultAvatar } from 'redux/actions/const';
import styled from 'styled-components';
import InsuranceRedirectLink from './InsuranceRedirectLink';

import TagV2 from '../V2/TagV2';
import {
    BxChevronDown,
    BxsUserIcon,
    FutureExchangeIcon,
    FutureIcon,
    FuturePortfolioIcon,
    FutureWalletIcon,
    SuccessfulTransactionIcon
} from '../../svg/SvgIcon';
import NavbarIcons from './Icons';
import AuthButton from './AuthButton';
import Button from '../V2/ButtonV2/Button';
import TextCopyable from 'components/screens/Account/TextCopyable';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';
const DailyLuckydraw = dynamic(() => import('components/screens/DailyLuckydraw'));
// ** Dynamic
const NotificationList = dynamic(() => import('src/components/notification/NotificationList'), { ssr: false });
const PocketNavDrawer = dynamic(() => import('src/components/common/NavBar/PocketNavDrawer'), {
    ssr: false
});

export const NAVBAR_USE_TYPE = {
    FLUENT: 'fluent',
    LIGHT: THEME_MODE.LIGHT,
    DARK: THEME_MODE.DARK
};

const ALLOW_DROPDOWN = ['product', 'trade', 'commission', 'nao'];

const NAV_HIDE_THEME_BUTTON = ['maldives_landingpage'];

const NavBar = ({ style, useOnly, name, page, changeLayoutCb, useGridSettings, spotState, resetDefault, onChangeSpotState }) => {
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
    const router = useRouter();
    const { user: auth } = useSelector((state) => state.auth) || null;
    const { width } = useWindowSize();
    const {
        t,
        i18n: { language }
    } = useTranslation(['navbar', 'common', 'profile']);
    const [isFromFrame, setIsFromFrame] = useState(false);
    const [showDailyLucky, setShowDailyLucky] = useState(false);

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

    const handleURLHref = (data) => {
        return !data?.listUrl ? data.url : data.listUrl?.[language] || '#';
    };

    // * Render Handler
    const renderDesktopNavItem = useCallback(() => {
        const feeNavObj = NAV_DATA.find((o) => o.localized === 'fee');

        return NAV_DATA.map((item) => {
            const { key, title, localized, isNew, url, child_lv1, isVertical } = item;

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

            if (child_lv1.length) {
                const itemsLevel1 = [];
                const itemsLevel1withIcon = [];
                const useDropdownWithIcon = ALLOW_DROPDOWN.includes(localized);
                const useOneCol = localized === 'trade';

                const shouldDot = child_lv1.findIndex((o) => o.isNew);

                child_lv1.map((child) => {
                    itemsLevel1.push(
                        <Link href={child.url} key={`${child.title}_${child.key}`}>
                            <a target={child?.notSameOrigin ? '_blank' : '_self'} className="mal-navbar__link__group___item___childen__lv1___item">
                                {t(`navbar:submenu.${child.localized}`)} {child.isNew && <div className="mal-dot__newest" />}
                            </a>
                        </Link>
                    );
                });

                // DROPDOWN WITH ICON
                child_lv1.map((child) => {
                    const Icon = NavbarIcons[child?.localized];

                    const isNamiInsurance = child.localized === 'nami_insurance';

                    const WrapperLink = ({ children }) =>
                        isNamiInsurance && auth ? (
                            <InsuranceRedirectLink
                                className={classNames('relative !pt-0 !pr-0 mal-navbar__link__group___item___childen__lv1___col2 w-1/2 flex', {
                                    '!w-full': isVertical,
                                    'w-[48%]': !isVertical
                                })}
                                key={`${child.title}_${child.key}`}
                            >
                                {children}
                            </InsuranceRedirectLink>
                        ) : (
                            <Link href={handleURLHref(child)} key={`${child.title}_${child.key}`} passHref>
                                <a
                                    className={classNames(
                                        '!pt-0 !pr-0',
                                        useOneCol
                                            ? 'mal-navbar__link__group___item___childen__lv1___col1 min-w-[350px]'
                                            : 'mal-navbar__link__group___item___childen__lv1___col2 w-1/2 flex',
                                        {
                                            '!w-full': isVertical,
                                            'w-[48%]': !isVertical,
                                            hidden: child.hide
                                        }
                                    )}
                                    target={child?.isTarget ? '_blank' : '_self'}
                                >
                                    {children}
                                </a>
                            </Link>
                        );

                    itemsLevel1withIcon.push(
                        <WrapperLink>
                            <div className={'mal-navbar__link__group___item___childen__lv1___item2'}>
                                <WrapperItemChild className="mal-navbar__link__group___item___childen__lv1___item2__icon">
                                    {Icon ? (
                                        <Icon size={24} />
                                    ) : (
                                        <Image
                                            src={getS3Url(getIcon(child.localized))}
                                            width={width >= 2560 ? '38' : '24'}
                                            height={width >= 2560 ? '38' : '24'}
                                            alt={child.title}
                                        />
                                    )}
                                </WrapperItemChild>
                                <div className="mal-navbar__link__group___item___childen__lv1___item2___c">
                                    <div className="mal-navbar__link__group___item___childen__lv1___item2___c__title">
                                        {t(`navbar:submenu.${child.localized}`)}
                                        {/* {child.isNew && <div className="mal-dot__newest"/> */}
                                    </div>
                                    <div className="!font-normal mal-navbar__link__group___item___childen__lv1___item2___c__description">
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
                        </WrapperLink>
                        // <Link href={isNamiInsurance ? '#' : handleURLHref(child)} key={`${child.title}_${child.key}`} passHref>
                        //     <a
                        //         className={classNames(
                        //             '!pt-0 !pr-0',
                        //             useOneCol
                        //                 ? 'mal-navbar__link__group___item___childen__lv1___col1 min-w-[350px]'
                        //                 : 'mal-navbar__link__group___item___childen__lv1___col2 w-1/2 flex',
                        //             {
                        //                 '!w-full': isVertical,
                        //                 'w-[48%]': !isVertical,
                        //                 hidden: child.hide
                        //             }
                        //         )}
                        //         target={child?.isTarget ? '_blank' : '_self'}
                        //     >
                        //         <div className={'mal-navbar__link__group___item___childen__lv1___item2'}>
                        //             <WrapperItemChild className="mal-navbar__link__group___item___childen__lv1___item2__icon">
                        //                 {Icon ? (
                        //                     <Icon size={24} />
                        //                 ) : (
                        //                     <Image
                        //                         src={getS3Url(getIcon(child.localized))}
                        //                         width={width >= 2560 ? '38' : '24'}
                        //                         height={width >= 2560 ? '38' : '24'}
                        //                         alt={child.title}
                        //                     />
                        //                 )}
                        //             </WrapperItemChild>
                        //             <div className="mal-navbar__link__group___item___childen__lv1___item2___c">
                        //                 <div className="mal-navbar__link__group___item___childen__lv1___item2___c__title">
                        //                     {t(`navbar:submenu.${child.localized}`)}
                        //                     {/* {child.isNew && <div className="mal-dot__newest"/> */}
                        //                 </div>
                        //                 <div className="!font-normal mal-navbar__link__group___item___childen__lv1___item2___c__description">
                        //                     {t(
                        //                         `navbar:submenu.${child.localized}_description`,
                        //                         child.localized === 'spot'
                        //                             ? {
                        //                                   pairsLength: state.pairsLength
                        //                               }
                        //                             : undefined
                        //                     )}
                        //                 </div>
                        //             </div>
                        //         </div>
                        //     </a>
                        // </Link>
                    );
                });

                return (
                    <div className="h-full flex items-center" key={`${title}_${key}__withchild`}>
                        <div className="mal-navbar__link__group___item !mr-0 pr-11">
                            <div className="flex items-center">
                                {t(`navbar:menu.${localized}`)}

                                {shouldDot !== -1 && shouldDot >= 0 && <div className="mal-dot__newest" />}
                            </div>
                            <SvgIcon name="chevron_down" size={16} className="chevron__down !ml-1" color={colors.gray[7]} style={{ marginLeft: 4 }} />
                            <div
                                className={classNames('mal-navbar__link__group___item___childen__lv1', {
                                    'mal-navbar__link__group___item___childen__lv1__w__icon': useDropdownWithIcon,
                                    'mal-navbar__link__group___item___childen__lv1__w__icon flex-col !min-w-0': useOneCol && useDropdownWithIcon,
                                    'flex-col !min-w-[346px] gap-4': isVertical,
                                    'gap-y-4 gap-x-6': !isVertical
                                })}
                            >
                                {useDropdownWithIcon ? itemsLevel1withIcon : itemsLevel1}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <Link key={`${title}_${key}`} href={url}>
                    <a className="mal-navbar__link__group___item !mr-11">
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
                {currentTheme !== THEME_MODE.LIGHT ? <SvgMoon size={24} color="currentColor" /> : <SvgSun size={24} color="currentColor" />}
            </div>
        );
    }, [name, currentTheme, navTheme.color]);

    const onClickItemControl = (item) => {
        switch (item?.title) {
            default:
                break;
        }
    };

    const renderItemUserControl = (item) => {
        const Icon = NavbarIcons?.[item.localized === 'referral' ? 'profile_referral' : item.localized];
        return (
            <a onClick={() => !item?.url && onClickItemControl(item)} className="mal-navbar__dropdown___item rounded-xl justify-between !text-base">
                <div className="flex items-center font-normal">
                    <div className="dark:text-txtSecondary-dark text-txtSecondary">
                        <Icon color="currentColor" size={24} />
                    </div>

                    {t(`navbar:menu.user.${item.localized}`)}
                </div>
                <div className=" text-txtPrimary dark:text-txtPrimary-dark">
                    <BxChevronDown className="!mr-0" size={24} color="currentColor" />
                </div>
            </a>
        );
    };

    const renderUserControl = useCallback(() => {
        const { avatar, code, kyc_status, partner_type } = auth;
        const isLocking = kyc_status === KYC_STATUS.LOCKING;
        const isNotVerified = [KYC_STATUS.NO_KYC, KYC_STATUS.REJECT].includes(kyc_status);
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

        USER_CP.map((item) => {
            if (item.hide) return null;
            if (item.isPartner && partner_type !== 2) return null;
            const Icon = NavbarIcons?.[item.localized === 'referral' ? 'profile_referral' : item.localized];
            items.push(
                item.url ? (
                    <Link key={`user_cp__${item.localized}`} href={item.localized === 'logout' ? buildLogoutUrl() : item.url}>
                        {renderItemUserControl(item)}
                    </Link>
                ) : (
                    renderItemUserControl(item)
                )
            );
        });

        return (
            <div className="mal-navbar__dropdown z-50 ">
                <div className="mal-navbar__dropdown__wrapper z-50  min-w-[436px] !p-6">
                    <div className="mal-navbar__dropdown__user__info justify-between items-center ">
                        <div className="flex items-center">
                            <div className="mal-navbar__dropdown__user__info__avt">
                                <img
                                    width={48}
                                    height={48}
                                    className="rounded-full min-w-[48px] max-w-[48px] min-h-[48px] max-h-[48px] w-full h-full object-cover"
                                    src={avatar || DefaultAvatar}
                                    alt="avatar_user"
                                />
                            </div>
                            <div className="mal-navbar__dropdown__user__info__summary">
                                <div className="mal-navbar__dropdown__user__info__username whitespace-normal"> {auth?.name || auth?.email || auth?.code}</div>
                                <div className="text-txtSecondary items-center font-normal flex">
                                    <TextCopyable text={code} />
                                </div>
                            </div>
                        </div>
                        {!isNotVerified && (
                            <TagV2 type={isLocking ? 'failed' : isVerified ? 'success' : 'warning'} className="py-2 px-3 text-center !text-sm !ml-4">
                                {isLocking ? t('navbar:temp_locking') : isVerified ? t('navbar:verified') : t('navbar:pending_approval')}
                            </TagV2>
                        )}
                    </div>
                    {isNotVerified && (
                        <Button onClick={() => router.push(PATHS.ACCOUNT.IDENTIFICATION)} className="mb-6 ">
                            {t('navbar:verify_account')}
                        </Button>
                    )}

                    <hr className="border-divider dark:border-divider-dark mb-6" />
                    <Link href={PATHS.FEE_STRUCTURES.TRADING}>
                        <div className="flex items-center px-4 justify-between mb-6">
                            <div className="flex items-center ">
                                <SuccessfulTransactionIcon size={24} />
                                <div className="text-dominant font-semibold ml-2">
                                    {state.loadingVipLevel ? <PulseLoader size={3} color={colors.teal} /> : `VIP ${state.vipLevel || '0'}`}
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 ">
                                <div className=" ">
                                    {t('navbar:use')} <span className="text-dominant uppercase">NAMI</span> - {t('navbar:get_discount')}
                                </div>
                                <div className=" text-txtPrimary dark:text-txtPrimary-dark">
                                    <BxChevronDown className="!mr-0" size={24} color="currentColor" />
                                </div>
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
                <div className="mal-navbar__dropdown__wrapper flex flex-col gap-3">
                    <Link href={PATHS.WALLET.DEFAULT}>
                        <a style={{ minWidth: 180 }} className="mal-navbar__dropdown___item">
                            <FuturePortfolioIcon size={24} />
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{t('common:overview')}</span>
                        </a>
                    </Link>
                    <Link href={PATHS.WALLET.EXCHANGE.DEFAULT}>
                        <a style={{ minWidth: 180 }} className="mal-navbar__dropdown___item">
                            <FutureExchangeIcon size={24} />
                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:submenu.spot_wallet')}</span>
                        </a>
                    </Link>
                    <Link href={PATHS.WALLET.FUTURES}>
                        <a className="mal-navbar__dropdown___item">
                            <FutureIcon size={24} />

                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:submenu.futures_wallet')}</span>
                        </a>
                    </Link>
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
        if (pairs.length) setState({ pairsLength: pairs.length });
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
                    <a className="block mal-navbar__logo " onClick={() => router.back()}>
                        <Image src={getS3Url('/images/ic_back.png')} width="28" height="28" className="navbar__logo" alt="" />
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
                        <a className="block mal-navbar__logo mr-10">
                            <Image
                                src={getS3Url(`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`)}
                                width="94"
                                height="30"
                                className="navbar__logo"
                                alt=""
                            />
                        </a>
                    </Link>

                    {width >= 992 && (
                        <div className="mal-navbar__link__group">
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
                            <div className="flex flex-row items-center mal-navbar__hamburger__spacing">
                                <AuthButton t={t} showSignInBreakPoint={1366} showSignUpBreakPoint={1366} />
                            </div>
                        )}
                        {auth && (
                            <>
                                {width >= 992 && (
                                    <div className="mal-navbar__hamburger__spacing mal-navbar__user___wallet mal-navbar__with__dropdown mal-navbar__svg_dominant">
                                        <FutureWalletIcon size={24} />

                                        <SvgIcon name="chevron_down" size={16} color={colors.gray[7]} className="chevron__down" />
                                        {renderWallet()}
                                    </div>
                                )}
                                <div className="mal-navbar__user___avatar mal-navbar__with__dropdown mal-navbar__hamburger__spacing">
                                    {width >= 992 && (
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark hover:!text-dominant">
                                            <BxsUserIcon className="user__svg" size={24} />
                                        </div>
                                    )}
                                    {width >= 992 && renderUserControl()}
                                </div>
                            </>
                        )}
                        {auth && <NotificationList btnClass="!mr-0" />}
                        {width >= 1366 && (
                            <>
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
                                </div>
                                <LanguageSetting />
                            </>
                        )}

                        {width < 1366 && (
                            <div
                                className={`${
                                    width >= 768 ? 'mal-navbar__hamburger__spacing ' : 'ml-3 '
                                } relative text-txtSecondary dark:text-txtPrimary-dark lg:dark:text-txtSecondary-dark `}
                                onClick={(e) => {
                                    onDrawerAction(true);
                                }}
                            >
                                <SvgMenu size={25} color="currentColor" className="cursor-pointer" />
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

const WrapperItemChild = styled.div`
    span {
        span {
            width: 24px !important;
        }
    }
`;

const getNavIcon = {
    sport: 'ic_exchange.png',
    futures: 'ic_futures.png',
    swap: 'ic_swap_v2.png',
    copytrade: 'ic_copytrade.png',
    staking: 'ic_staking.png',
    farming: 'ic_farming.png',
    referral: 'ic_referral.png',
    launchpad: 'ic_rocket.png',
    classic: 'ic_trade_classic.png',
    advance: 'ic_trade_advance.png',
    report_commission: 'nav/ic_report_commission.png',
    race_top_referral: 'nav/ic_race_top_referral.png',
    whitepaper: 'nav/ic_whitepaper.png',
    noti: 'nav/ic_noti.png',
    pool: 'nav/ic_pool.png',
    stake_nao: 'nav/ic_stake_nao.png',
    race_top: 'nav/ic_race_top.png',
    staking: 'nav/ic_staking.png'
};

const getIcon = (localized) => {
    if (!localized) return '';
    return `/images/icon/${getNavIcon[localized]}`;
};

export default NavBar;
