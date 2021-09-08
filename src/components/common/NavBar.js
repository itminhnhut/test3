import { Dialog, Popover, Transition } from '@headlessui/react';
import { getLoginUrl, getS3Url } from 'actions/utils';
import UserLoader from 'components/loader/UserLoader';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useRef, useState } from 'react';
import { ChevronRight, XCircle } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { iconColor } from 'src/config/colors';
import { DOWNLOAD_APP_LINK, LS_KEYS, KYC_STATUS } from 'src/redux/actions/const';
import { actionLogout, setQuoteAsset } from 'src/redux/actions/user';
import dynamic from 'next/dynamic';
import NotificationList from '../notification/NotificationList';
import {
    IconArrowRight,
    IconBell,
    IconBroker,
    IconCategory,
    IconCircleCheck,
    IconConvert,
    IconDashboard,
    IconDeposit,
    IconEarning,
    IconFutures,
    IconGift,
    IconHistory,
    IconLanguage,
    IconLogout,
    IconMargin,
    IconMembership,
    IconPnL,
    IconProfile,
    IconReferral,
    IconSecurity,
    IconStarter,
    IconSupport,
    IconTicket,
    IconVerification,
    IconWithdraw,
} from './Icons';

const NavBar = () => {
    const { t } = useTranslation(['navbar', 'common']);
    const router = useRouter();
    const { route, locale, query } = router;
    const user = useSelector(state => state.auth.user) || null;
    const loadingUser = useSelector(state => state.auth.loadingUser);
    const dispatch = useDispatch();
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const cancelButtonRef = useRef();
    const cancelButtonRegisterRef = useRef();

    const [open, setOpen] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };
    const closeModalRegister = () => {
        setOpenRegister(false);
    };
    const openModalRegister = () => {
        setOpen(false);
        setOpenRegister(true);
    };
    const setBaseCurrencyDb = (asset) => {
        dispatch(setQuoteAsset(asset));
        if (route === '/spot/[id]') {
            const [base, quote] = query?.id?.split('_');
            router.push(`/spot/${base}_${asset}`);
        }
    };

    const urlAvatar = () => {
        if (user?.avatar) {
            if (user?.avatar?.includes?.('https://') || user?.avatar?.includes?.('http://')) return user?.avatar;
            return getS3Url(user?.avatar);
        }
        return '/images/avatar.png';
    };

    const menu = [
        {
            name: 'trade',
            submenu: [
                {
                    name: 'convert',
                    route: '/swap',
                    icon: <IconConvert />,
                    disabled: false,
                }, {
                    name: 'spot',
                    route: `/spot/BTC_${quoteAsset}`,
                    icon: <IconPnL />,
                    disabled: false,
                }, {
                    name: 'margin',
                    route: '/margin',
                    icon: <IconMargin />,
                    disabled: true,
                }, {
                    name: 'futures',
                    route: '/futures',
                    icon: <IconFutures />,
                    disabled: true,
                },
            ],
        },
        {
            name: 'markets',
            route: '/markets',
            icon: '',
        },
        {
            name: 'blog',
            route: '/blog',
            icon: '',
        },
        {
            name: 'support',
            route: '/',
            icon: '',
        },
        // {
        //     name: 'api',
        //     route: '/',
        //     icon: '',
        //     disabled: true,
        // },
        {
            name: 'fee',
            route: '/fee-structure',
            icon: '',
        },
    ];
    const menuGrid = [
        {
            name: 'deposit',
            route: '/wallet/spot/deposit/fiat/VNDC',
            icon: <IconDeposit />,
        },
        {
            name: 'withdraw',
            route: '/wallet/spot/withdraw/fiat/VNDC',
            icon: <IconWithdraw />,
        },
        {
            name: 'convert',
            route: '/swap',
            icon: <IconConvert />,
        },
        // {
        //     name: 'brokers',
        //     route: '/brokers',
        //     icon: <IconBroker />,
        // },
        {
            name: 'earning',
            route: '/earning',
            icon: <IconEarning />,
        },
        {
            name: 'signals',
            route: '/my/signals',
            icon: <IconBell />,
        },
        {
            name: 'membership',
            route: '/membership',
            icon: <IconMembership />,
        },
        {
            name: 'brokers',
            route: '/brokers',
            icon: <IconBroker />,
        },
        // {
        //     name: 'history',
        //     route: '/wallet/history',
        //     icon: <IconHistory />,
        // },
        {
            name: 'starter',
            route: '/starter',
            icon: <IconStarter />,
        },
        {
            name: 'referral',
            route: '/my/referral',
            icon: <IconGift />,
        },
    ];
    const menuMobile = [
        {
            name: 'home',
            route: '/',
            disabled: false,
        },
        {
            name: 'blog',
            route: '/blog',
            disabled: false,
        },
        {
            name: 'about',
            route: '/about',
            disabled: false,
        },
        {
            name: 'fee',
            route: '/fee-structure',
            disabled: false,
        },
        {
            name: 'api',
            route: '/',
            disabled: true,
        },
    ];
    const clearLS = () => {
        localStorage.removeItem(LS_KEYS.SPOT_LAYOUT);
        localStorage.removeItem(LS_KEYS.SPOT_LAYOUT_ON_SIDEBAR);
        localStorage.removeItem(LS_KEYS.SPOT_ON_SIDEBAR);
        localStorage.removeItem(LS_KEYS.SPOT_MAX_CHART);
        window.location.reload();
    };

    const changeLanguage = () => {
        if (locale === 'vi') return router.push(route, query, { locale: 'en' });
        return router.push(route, query, { locale: 'vi' });
    };

    const _renderMenuHaveSubMenu = (item, key) => (
        <Popover className="relative" key={key}>
            {({ open }) => (
                <>
                    <Popover.Button
                        key={`Popover:${item.name}`}
                        type="button"
                        className="inline-flex items-center focus:outline-none"
                        aria-expanded="false"
                    >
                        <span className={`navbar-item ${open ? 'active' : ''}`}>{t(`menu.${item.name}`)}</span>
                        <svg
                            className={`ml-2 h-5 w-5 ${open ? 'text-violet-700' : 'text-black-500'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Popover.Button>
                    <Transition
                        key={`Transition${key}`}
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className="absolute z-10 mt-3 transform w-screen max-w-[18rem] rounded-md border border-black-200 shadow-lg"
                        >
                            <div
                                className="overflow-hidden"
                            >
                                {item.submenu.map((sub, iSub) => (
                                    sub.disabled
                                        ? (
                                            <div key={iSub + sub?.name} className="relative grid gap-6 bg-white sm:gap-8">
                                                <a className="navbar-item-link group disabled">
                                                    <span className="text-black-500">
                                                        {sub.icon}
                                                    </span>
                                                    <div className="ml-3">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium text-black-400">
                                                                {t(`submenu.${sub.name}`)}
                                                            </span>
                                                            <span className="label label-red ml-3">{t('coming_soon')}</span>
                                                        </div>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {t(`submenu.${sub.name}_description`)}
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                        : (
                                            <div key={iSub + sub?.name} className="relative grid gap-6 bg-white sm:gap-8">
                                                <Link href={sub.route} locale={locale} prefetch={false}>
                                                    <a
                                                        className="navbar-item-link group "
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            {sub.icon}
                                                        </span>
                                                        <div className="ml-3">
                                                            <div className="flex items-center">
                                                                <span
                                                                    className="text-sm font-medium group-hover:text-violet-700"
                                                                >
                                                                    {t(`submenu.${sub.name}`)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                {t(`submenu.${sub.name}_description`)}
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        )
                                ))}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
    const _renderMenu = (item, key) => {
        if (item.disabled) {
            return (
                <div
                    className="flex items-center cursor-not-allowed"
                    key={key}
                >
                    <p
                        className="navbar-item text-black-400"
                    >
                        {t(`menu.${item.name}`)}
                    </p>
                    <span className="label label-red ml-3">{t('coming_soon')}</span>
                </div>
            );
        }
        if (item.name === 'support') {
            return (
                <a
                    className="navbar-item"
                    href={`https://attlas.zendesk.com/hc/${locale}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={key}
                >
                    {t(`menu.${item.name}`)}
                </a>
            );
        }
        return (
            <Link href={item.route} locale={locale} key={key} prefetch={false}>
                <a className="navbar-item">
                    {t(`menu.${item.name}`)}
                </a>
            </Link>
        );
    };

    const _renderUserKycStatus = () => {
        if (user?.kycStatus === KYC_STATUS.APPROVED || user?.kycStatus === KYC_STATUS.ADVANCE_KYC) {
            return (
                <div className="px-6 py-4 flex items-center border-0 border-b border-black-200 text-green font-medium">
                    <IconCircleCheck />
                    <span className="ml-2">
                        {t('navbar:verified')}
                    </span>
                </div>
            );
        }
        if (user?.kycStatus === KYC_STATUS.PENDING_APPROVAL || user?.kycStatus === KYC_STATUS.APPROVED_PENDING_APPROVAL_ADVANCE || user?.kycStatus === KYC_STATUS.PENDING_APPROVAL_ADVANCE) {
            return (
                <div className="px-6 py-4 flex items-center border-0 border-b border-black-200 text-gray-400 font-medium">
                    <span className="">
                        {t('navbar:pending_approval')}
                    </span>
                </div>
            );
        }
        return (
            <div className="px-6 py-4 flex items-center border-0 border-b border-black-200 text-violet font-medium">
                <Link href="/my/verification" className="" prefetch={false}>
                    {t('navbar:not_verified')}
                </Link>
                <div className="flex items-center text-violet ml-3">
                    <IconArrowRight />
                </div>
            </div>
        );
    };

    return (
        <>
            <header className="relative bg-white">
                <div className="mx-auto px-2 sm:px-6 lg:px-20">
                    <div className="flex justify-between py-2.5 md:space-x-10">
                        <div className="flex justify-start">
                            <Link href="/" locale={locale} prefetch={false}>
                                <div className="flex-shrink-0 flex items-center">
                                    <img
                                        className="hidden lg:block h-10 w-auto clickable"
                                        src="/images/header-logo.png"
                                        alt="Nami Exchange"
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className="-mr-2 -my-2 md:hidden">
                            <button
                                type="button"
                                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-inset"
                                aria-expanded="false"
                                onClick={openModal}
                            >
                                <span className="sr-only">Open menu</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                        <nav className="navbar hidden md:flex 2xl:space-x-10 xl:space-x-5 space-x-3 items-center">
                            {menu.map((m, iM) => (m.submenu ? _renderMenuHaveSubMenu(m, iM) : _renderMenu(m, iM)),
                            )}
                        </nav>

                        {
                            loadingUser
                            &&
                            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                                <UserLoader />
                            </div>
                        }

                        {
                            (!user && !loadingUser)
                            &&
                            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                                <a href={getLoginUrl('sso', 'login')} className="hidden lg:block btn">
                                    {t('common:sign_in')}
                                </a>
                                <a href={getLoginUrl('sso', 'register')} className="hidden lg:block btn btn-primary">
                                    {t('common:sign_up')}
                                </a>
                            </div>
                        }
                        {
                            (user && !loadingUser)
                            &&
                            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                                <div className="hidden lg:flex items-center mr-3 2xl:mr-7">
                                    <Popover className="relative">
                                        {({ open }) => (
                                            <>
                                                <Popover.Button
                                                    type="button"
                                                    className="btn btn-clean btn-icon hover:!text-violet-700"
                                                    aria-expanded="false"
                                                >
                                                    <IconDashboard className="!text-violet-700" />
                                                </Popover.Button>
                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="opacity-0 translate-y-1"
                                                    enterTo="opacity-100 translate-y-0"
                                                    leave="transition ease-in duration-150"
                                                    leaveFrom="opacity-100 translate-y-0"
                                                    leaveTo="opacity-0 translate-y-1"
                                                >
                                                    <Popover.Panel
                                                        static
                                                        className="absolute z-10 transform w-screen max-w-sm border rounded-md border border-black-200 right-0 p-4 bg-white shadow-lg"
                                                    >
                                                        <div
                                                            className="rounded-lg overflow-hidden grid grid-cols-3 gap-3"
                                                        >
                                                            {menuGrid.map((menuG, iMenuG) => (
                                                                <div
                                                                    className="rounded-xl bg-black-5 w-[109px] h-[109px] py-[1.125rem]"
                                                                    key={iMenuG}
                                                                >
                                                                    <Link href={menuG.route} prefetch={false}>
                                                                        <a className="group text-center">
                                                                            <div
                                                                                className="h-[44px] w-[44px] rounded-full bg-white flex items-center justify-center mx-auto text-black-500 group-hover:text-violet-700"
                                                                            >
                                                                                {menuG.icon}
                                                                            </div>
                                                                            <div
                                                                                className="text-sm font-semibold group-hover:text-violet-700 mt-2"
                                                                            >

                                                                                {t(`menu_grid.${menuG.name}`)}
                                                                            </div>
                                                                        </a>
                                                                    </Link>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Popover.Panel>
                                                </Transition>
                                            </>
                                        )}
                                    </Popover>
                                </div>
                                <div className="hidden lg:flex items-center mr-3 2xl:mr-7">
                                    <Link href="/wallet/spot" locale={locale} prefetch={false}>
                                        <button
                                            className="btn btn-clean btn-icon relative"
                                            type="button"
                                        >
                                            {t('navbar:wallet')}
                                        </button>
                                    </Link>
                                </div>
                                <NotificationList />
                                <Popover className="relative">
                                    <Popover.Button
                                        type="button"
                                        className="inline-flex items-center focus:outline-none"
                                        aria-expanded="false"
                                    >
                                        <span className="mr-3">
                                            <img src={urlAvatar()} width={36} height={36} className="rounded-full w-9 h-9 min-w-[36px]" />
                                        </span>
                                        <span
                                            className="text-sm font-semibold"
                                        >{user?.username || (user?.email || 'Nami User').substring(0, 30)}
                                        </span>

                                    </Popover.Button>
                                    <Popover.Panel
                                        // static
                                        className="absolute z-10 transform w-screen max-w-xs rounded-md border border-black-200 right-0 bg-white shadow-lg text-sm"
                                    >
                                        <div className="overflow-hidden">
                                            {_renderUserKycStatus()}

                                            <div>
                                                <div className="p-6 flex items-center justify-between">
                                                    <span className="text-xs text-black-500 font-medium">
                                                        {t('base_currency')}
                                                    </span>
                                                    <div className="bg-black-200 rounded-md p-[2px] transition-all" role="group" aria-label=" button group">
                                                        <button
                                                            type="button"
                                                            className={`btn btn-outline-secondary !py-1.5 !px-6 !text-xs ${quoteAsset === 'VNDC' ? 'active !bg-white' : '!text-black-500'}`}
                                                            onClick={() => setBaseCurrencyDb('VNDC')}
                                                        >VNDC
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-outline-secondary !py-1.5 !px-6 !text-xs ${quoteAsset === 'USDT' ? 'active !bg-white' : '!text-black-500'}`}
                                                            onClick={() => setBaseCurrencyDb('USDT')}
                                                        >USDT
                                                        </button>
                                                    </div>
                                                </div>
                                                <Link href="/my/account/profile" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-6 py-3 flex items-center hover:bg-black-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconProfile />
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-violet-700"
                                                        >{t('account')}
                                                        </span>
                                                    </div>
                                                </Link>
                                                <Link href="/my/verification" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-6 py-3 flex items-center hover:bg-black-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconVerification />
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-violet-700"
                                                        >{t('account_verification')}
                                                        </span>
                                                    </div>
                                                </Link>
                                                <Link href="/my/security" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-6 py-3 flex items-center hover:bg-black-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconSecurity />
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-violet-700"
                                                        >{t('menu_grid.security')}
                                                        </span>
                                                    </div>
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="w-full px-6 py-3 flex items-center hover:bg-black-5 font-medium cursor-pointer group justify-between"
                                                    onClick={changeLanguage}
                                                >
                                                    <div className="flex flex-row items-center">
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconLanguage />
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-violet-700"
                                                        >{t('language')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-black-400">
                                                        <img src={locale === 'vi' ? getS3Url('/public/images/flags/vn.svg') : getS3Url('/public/images/flags/en.svg')} className="w-6 h-4 min-w-[24px] object-cover" />
                                                    </div>
                                                </button>
                                                <a
                                                    href={`https://attlas.zendesk.com/hc/${locale}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <div
                                                        className="px-6 py-3 flex items-cente</div>r hover:bg-black-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconSupport />
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-violet-700"
                                                        >{t('support')}
                                                        </span>
                                                        <div className="flex items-center text-black-400">
                                                            <IconArrowRight />
                                                        </div>
                                                    </div>
                                                </a>
                                                <a
                                                    href={`https://attlas.zendesk.com/hc/${locale}/requests/new`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <div
                                                        className="px-6 py-3 flex items-cente</div>r hover:bg-black-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconTicket />
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-violet-700"
                                                        >{t('ticket')}
                                                        </span>
                                                        <div className="flex items-center text-black-400">
                                                            <IconArrowRight />
                                                        </div>
                                                    </div>
                                                </a>
                                                <Link href="/my/referral" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-6 py-3 flex items-center hover:bg-black-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            <IconReferral />
                                                        </span>
                                                        <span className="ml-3 flex-grow flex items-center ">
                                                            <span
                                                                className="text-black-700 group-hover:text-violet-700"
                                                            >{t('menu_grid.referral')}
                                                            </span>
                                                            <span
                                                                className="label label-warning ml-3"
                                                            >{t('make_money')}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </Link>

                                            </div>
                                            <div className="border-0 border-t border-black-200 font-medium">
                                                <div
                                                    className="p-6 flex items-center hover:bg-black-5 font-medium cursor-pointer group"
                                                    onClick={async () => {
                                                        await dispatch(await actionLogout());
                                                        clearLS();
                                                    }}
                                                >
                                                    <span className="text-black-500 group-hover:text-violet-700">
                                                        <IconLogout />
                                                    </span>
                                                    <span
                                                        className="ml-3 text-black-700 group-hover:text-violet-700"
                                                    >{t('logout')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Popover>
                            </div>
                        }
                    </div>
                </div>
                <Transition show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRef}
                        static
                        open={open}
                        onClose={closeModal}
                    >
                        <div className="min-h-screen text-right">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300 transform transition-all"
                                enterFrom="w-0"
                                enterTo="w-5/6"
                                leave="ease-in duration-300 transform"
                                leaveFrom=" -translate-x-3/4"
                                leaveTo="translate-x-full"
                            >
                                <div
                                    className=" w-3/4 inline-block overflow-hidden text-left align-middle bg-white shadow-xl h-screen relative"
                                >
                                    <Dialog.Title className="px-5 mt-4">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            />
                                            <button className="btn btn-icon" type="button" onClick={closeModal}>
                                                <ChevronRight color={iconColor} size={24} />
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="px-5">

                                        {menuMobile.map((m, index) => (m.disabled ? (
                                            <div className="border-0 border-b border-black-200 py-4 font-bold" key={index}>
                                                <div className="flex items-center">
                                                    <span>{t(`menu.${m.name}`)}</span>
                                                    <span className="label label-red ml-3">
                                                        {t('coming_soon')}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href={m.route} locale={locale} key={index} prefetch={false}>
                                                <div className="border-0 border-b border-black-200 py-4 font-bold">
                                                    <div className="flex items-center">
                                                        <span>{t(`menu.${m.name}`)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )),
                                        )}
                                        {
                                            (!user && !loadingUser) && (
                                                <div className="mt-[100px]">
                                                    <div>
                                                        <button
                                                            className="btn btn-primary w-full"
                                                            type="button"
                                                            onClick={openModalRegister}
                                                        >
                                                            {t('common:sign_up')}
                                                        </button>
                                                    </div>
                                                    <div className="text-xs text-center mt-3">
                                                        <span className="text-black-500 ">
                                                            Bạn đã có tài khoản?&nbsp;
                                                        </span>
                                                        <span
                                                            className="text-violet font-bold"
                                                            onClick={openModalRegister}
                                                        >
                                                            Đăng nhập
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
                <Transition show={openRegister} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRegisterRef}
                        static
                        open={openRegister}
                        onClose={closeModalRegister}
                    >
                        <div className="md:min-h-screen min-h-[calc(100%-10rem)] px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div
                                    className="inline-block w-full max-w-400 mb-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl "
                                >
                                    <Dialog.Title className="">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            />
                                            <button
                                                className="btn btn-icon"
                                                type="button"
                                                onClick={closeModalRegister}
                                            >
                                                <XCircle color={iconColor} size={24} />
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="text-sm rounded-2xl bg-white">
                                        <div className="bg-black-5 rounded-t-2xl py-4">
                                            <img src="/images/bg/dialog-register-header.svg" alt="" className="mx-auto" />
                                        </div>
                                        <div className="px-6 py-8 text-center !font-bold">
                                            <div className="text-xl">{t('landing:download_app_hint')}</div>
                                            <div className="text-xl text-violet mb-[30px]">Nami Exchange</div>
                                            <div className="">
                                                <a
                                                    href={DOWNLOAD_APP_LINK.IOS}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-black w-full mb-2"
                                                        type="button"
                                                        rel="noreferrer"
                                                    >
                                                        {t('landing:download_app_hint_appstore')}
                                                    </button>
                                                </a>
                                                <a
                                                    href={DOWNLOAD_APP_LINK.ANDROID}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-primary w-full"
                                                        type="button"
                                                    >
                                                        {t('landing:download_app_hint_googleplay')}
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </header>
        </>
    );
};

export default NavBar;
