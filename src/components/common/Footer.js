import { faFacebookF, faTelegram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Listbox, Transition } from '@headlessui/react';
import { iconColorPrimary } from 'config/colors';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';
import { IconArrowDown } from './Icons';

const Footer = () => {
    const { t } = useTranslation('footer');
    const router = useRouter();
    const { route, locale } = router;
    const changeLanguage = (lang) => {
        if (route === '/blog/[slug]') {
            router.push('/blog', null, { locale: lang });
        } else {
            router.push(route, null, { locale: lang });
        }
    };
    const menu = [
        {
            name: t('product'),
            submenu: [
                {
                    name: t('ats_swap'),
                    route: '/swap',
                },
                {
                    name: t('ats_spot'),
                    route: '/spot',
                },
                {
                    name: t('ats_futures'),
                    route: '/',
                },
                {
                    name: t('ats_margin'),
                    route: '/',
                },
            ],
        },
        {
            name: t('ats_about'),
            submenu: [
                {
                    name: t('about'),
                    route: '/about',
                },
                {
                    name: t('fee_structure'),
                    route: '/fee-structure',
                },
                {
                    name: t('policies'),
                    route: '/policies',
                },
                {
                    name: t('terms'),
                    route: '/terms',
                },
            ],
        },
        {
            name: t('resources'),
            submenu: [
                {
                    name: t('ats_blog'),
                    route: '/blog',
                },
                {
                    name: t('ats_academy'),
                    route: '/',
                },
                {
                    name: t('support'),
                    route: '/',
                },
                {
                    name: t('beginner'),
                    route: '/',
                },
            ],
        },
    ];
    return useMemo(() => (
        <footer>
            <div className="bg-white lg:py-[6.25rem] py-10">
                <div className="ats-container">
                    <div className="grid lg:grid-cols-2">
                        <div className="md:block flex flex-col items-center">
                            <div className="mb-5 lg:-mt-5">
                                <Image src="/images/logo/logo-full-v.png" width={70} height={80.82} />
                            </div>
                            <div className="mb-9">
                                <a className="text-violet cursor-pointer" href="mailto:support@nami.exchange">support@nami.exchange</a>
                                <div className="mt-3">
                                    68 Circular Road<br />
                                    #02-01<br />
                                    Singapore 049422<br />
                                </div>
                            </div>
                            <div className="mb-9">
                                <a
                                    className="btn btn-icon !bg-black-5 !mr-4 !w-10 !h-10"
                                    href="https://www.facebook.com/attlas.io/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faFacebookF} size="lg" color={iconColorPrimary} />
                                </a>
                                <a
                                    className="btn btn-icon !bg-black-5 !mr-4 !w-10 !h-10"
                                    href="https://www.facebook.com/groups/attlas.io"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faGlobe} size="lg" color={iconColorPrimary} />
                                </a>
                                <a
                                    className="btn btn-icon !bg-black-5 !mr-4 !w-10 !h-10"
                                    href="https://t.me/attlassignals"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faTelegram} size="lg" color={iconColorPrimary} />
                                </a>
                                <a
                                    className="btn btn-icon !bg-black-5 !w-10 !h-10"
                                    href="https://www.youtube.com/channel/UCMWblNJ09osKQVxVCRvwLTA"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faYoutube} size="lg" color={iconColorPrimary} />
                                </a>

                            </div>
                            <div className="form-group mb-9">
                                <Listbox value={locale} onChange={changeLanguage}>
                                    {({ open }) => (
                                        <>
                                            <div className="relative mt-1">
                                                <Listbox.Button
                                                    className="relative form-control form-control-sm border text-left !w-[150px] !pl-3"
                                                >
                                                    <span className="block truncate">{t(locale)}</span>
                                                    <span
                                                        className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
                                                    >
                                                        <IconArrowDown />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options
                                                        static
                                                        className="absolute w-[180px] mt-1 overflow-auto text-base bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
                                                    >
                                                        <Listbox.Option
                                                            className={({ active }) => `${active ? 'text-white bg-violet-700' : ''} cursor-pointer select-none relative px-3 py-2 rounded-lg`}
                                                            value="vi"
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span
                                                                        className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                                                                    >
                                                                        {t('vi')}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span
                                                                            className={`${active ? 'text-violet-600' : 'text-white'} absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                        />
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                        <Listbox.Option
                                                            className={({ active }) => `${active ? 'text-white bg-violet-700' : ''} cursor-pointer select-none relative px-3 py-2 rounded-lg`}
                                                            value="en"
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span
                                                                        className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                                                                    >
                                                                        {t('en')}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span
                                                                            className={`${active ? 'text-violet-600' : 'text-white'} absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                        />
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3">
                            {menu.map((m, index) => (
                                <div key={index}>
                                    <div className="text-lg font-semibold mb-8">
                                        {m.name}
                                    </div>
                                    {m.submenu.map((sub, iSub) => (
                                        <Link href={sub.route} key={iSub} prefetch={false}>
                                            <a className="text-black-500 hover:text-violet-700 mb-4 last:mb-0 block">{sub.name}</a>
                                        </Link>
                                    ))}
                                    <div />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center bg-black-50 text-[#83859E] text-xs py-3">
                Copyright © 2021 Nami. All rights reserved.
            </div>
        </footer>
    ), [],
    );
};

export default Footer;
