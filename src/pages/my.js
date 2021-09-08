import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import {
    IconAPIManagement,
    IconIdCard,
    IconPaymentMethod,
    IconProfile,
    IconReferral,
    IconSecurity,
} from 'components/common/Icons';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import AuthSelector from 'src/redux/selectors/authSelectors';
import { getLoginUrl } from 'src/redux/actions/utils';

const MyPage = ({ children }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const { pathname, locale } = router;

    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const menu = [
        {
            name: t('my:account'),
            route: '/my/account/profile',
            icon: <IconProfile size={20} />,
        },
        {
            name: t('my:bank_account'),
            route: '/my/payment-methods',
            icon: <IconPaymentMethod size={20} />,
        },
        {
            name: t('my:kyc'),
            route: '/my/verification',
            icon: <IconIdCard />,
        },
        {
            name: t('my:security'),
            route: '/my/security',
            icon: <IconSecurity size={20} />,
        },
        {
            name: t('my:api_management'),
            route: '/my/api-management',
            icon: <IconAPIManagement size={20} />,
        },
        {
            name: t('my:referral'),
            route: '/my/referral',
            icon: <IconReferral size={20} />,
        },
    ];
    return (
        <LayoutWithHeader>
            <div className="ats-container my-10">
                <div className="grid md:grid-cols-12 gap-x-10">
                    <div className="md:col-span-3">
                        {menu.map((m, index) => {
                            if (m?.subRoutes) {
                                return (
                                    <React.Fragment key={index}>
                                        <div
                                            className="flex items-center group hover:text-violet-700 cursor-pointer px-8 py-4 rounded-[5px] bg-violet bg-opacity-[0.06] text-violet"
                                        >
                                            {m.icon}
                                            <span className="ml-4">{m.name}</span>
                                        </div>
                                        {Object.values(m?.subRoutes).map((sub, i) => {
                                            return (
                                                <Link href={sub.route} locale={locale} key={i}>
                                                    <div
                                                        className={`flex items-center group hover:text-violet-700 cursor-pointer px-8 py-4 text-[#52535C] font-bold text-sm rounded-[5px] ${pathname === sub.route ? 'font-bold text-[#02083D]' : ''}`}
                                                    >
                                                        <span className="ml-10">{sub.name}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}

                                    </React.Fragment>
                                );
                            }
                            if (m?.disabled) {
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center group cursor-not-allowed px-8 py-4 text-black-400 rounded-[5px] ${pathname === m.route ? 'bg-violet bg-opacity-[0.06] text-violet' : ''}`}
                                    >
                                        {m.icon}
                                        <div className="flex flex-col">
                                            <span className="ml-4">{m.name}</span>
                                            <span className="label label-red ml-4 mt-1 max-w-[62px]">{t('navbar:coming_soon')}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <Link href={m.route} locale={locale} key={index}>
                                    <div
                                        className={`flex items-center group hover:text-violet-700 cursor-pointer px-8 py-4 text-[#52535C] font-bold text-sm rounded-[5px] ${pathname === m.route ? 'bg-violet bg-opacity-[0.06] text-violet' : ''}`}
                                    >
                                        {m.icon}
                                        <span className="ml-4">{m.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="md:col-span-9">
                        {isAuth ? children : (
                            <div className="lg:px-10 xl:px-0 xl:max-w-screen-xl	py-20 bg-white w-full rounded-3xl md:h-144 flex flex-col items-center justify-center">
                                <a href={getLoginUrl('sso')} className="btn button-common block text-center">
                                    {t('common:sign_in_to_continue')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my']),
        },
    };
}

export default MyPage;
