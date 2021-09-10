import { Popover, Transition } from '@headlessui/react';
import { getLoginUrl, getS3Url } from 'actions/utils';
import UserLoader from 'components/loader/UserLoader';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LS_KEYS } from 'src/redux/actions/const';
import { setQuoteAsset } from 'src/redux/actions/user';
import {
    IconConvert, IconFutures, IconMargin, IconPnL,
} from './Icons';

const NavBar = () => {
    const { t } = useTranslation(['navbar', 'common']);
    const router = useRouter();
    const { route, locale, query } = router;
    const user = useSelector(state => state.auth.user) || null;
    const loadingUser = useSelector(state => state.auth.loadingUser);

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
                                {user?.username}
                            </div>
                        }
                    </div>
                </div>
            </header>
        </>
    );
};

export default NavBar;
