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
import { DOWNLOAD_APP_LINK, LS_KEYS } from 'src/redux/actions/const';
import { setQuoteAsset } from 'src/redux/actions/user';
import {
    IconConvert,
    IconDashboard, IconFutures, IconMargin, IconPnL,
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
    ];
    const menuGrid = [

    ];
    const menuMobile = [
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

    return (
        <>
            <header className="relative bg-white">
                <div className="mx-auto px-2 sm:px-6 lg:px-20">
                    <div className="flex justify-between py-2.5 md:space-x-10">
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
                            </div>
                        }
                    </div>
                </div>
            </header>
        </>
    );
};

export default NavBar;
