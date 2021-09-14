import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

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
                    name: t('nami_swap'),
                    route: '/swap',
                },
                {
                    name: t('nami_spot'),
                    route: '/spot',
                },
                {
                    name: t('nami_futures'),
                    route: '/',
                },
                {
                    name: t('nami_margin'),
                    route: '/',
                },
                {
                    name: t('nami_margin'),
                    route: '/',
                },
            ],
        },
        {
            name: t('community'),

            submenu: [
                {
                    name: 'CoinGecko',
                    route: '/',
                },
                {
                    name: 'Facebook',
                    route: '/',
                },
                {
                    name: 'Twitter',
                    route: '/',
                },
                {
                    name: 'Telegram',
                    route: '/',
                },
                {
                    name: 'Telegram',
                    route: '/',
                },
                {
                    name: 'Youtube',
                    route: '/',
                },
            ],
        },
        {
            name: t('support'),
            submenu: [
                {
                    name: 'API Documents',
                    route: '/',
                },
                {
                    name: 'Chat with support',
                    route: '/',
                },
                {
                    name: 'System Status',
                    route: '/',
                },

            ],
        },
        {
            name: t('resources'),
            submenu: [
                {
                    name: t('nami_blog'),
                    route: '/blog',
                },
                {
                    name: t('nami_academy'),
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
            <div className="bg-darkBlue lg:py-[3.75rem] py-10">
                <div className="nami-container">
                    <div className="grid lg:grid-cols-3">
                        <div className="">
                            <div className="mb-5">
                                <Image src="/images/logo/nami-logo.png" height="40" width="160" />
                            </div>
                            {/* <div className="mb-9">
                                <div className="mt-3 text-teal">
                                    Change mindset, make giant steps
                                </div>
                            </div> */}

                        </div>
                        <div className="col-span-2 grid grid-cols-2  lg:grid-cols-4">
                            {menu.map((m, index) => (
                                <div key={index}>
                                    <div className="uppercase text-xs font-bold mb-4 text-teal">
                                        {m.name}
                                    </div>
                                    {m.submenu.map((sub, iSub) => (
                                        <Link href={sub.route} key={iSub} prefetch={false}>
                                            <a className=" text-tiny text-white font-medium hover:text-teal-700 mb-2 last:mb-0 block">{sub.name}</a>
                                        </Link>
                                    ))}
                                    <div />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center bg-darkBlue text-[#83859E] text-xs py-3">
                Copyright © 2019 Nami Corp. All rights reserved.
            </div>
        </footer>
    ), [],
    );
};

export default Footer;
