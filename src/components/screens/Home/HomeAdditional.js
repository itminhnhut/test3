import HomeCurrentActivity from 'src/components/screens/Home/HomeCurrentActivity';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRefWindowSize } from 'hooks/useWindowSize';
import { PATHS } from 'src/constants/paths';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import {useSelector} from 'react-redux'

const HomeJourney = dynamic(() => import('./HomeJourney'), {
    ssr: false
});

const HomeAdditional = ({ currentTheme, t, width }) => {
    const { user: auth } = useSelector((state) => state.auth) || null;
    return (
        <>
            <div className="relative">
                <div className="absolute z-0 right-0 top-20 pointer-events-none">
                    <Image alt="right_up" src={getS3Url('/images/screen/homepage/right_up.webp')} width="513px" height="313px" />
                </div>
                <div className="absolute z-0 bottom-0 left-0 pointer-events-none">
                    <div className="-mb-20">
                        <Image alt="left_down" src={getS3Url('/images/screen/homepage/left_down.webp')} width="511px" height="213px" />
                    </div>
                    <Image alt="ghost_down" src={getS3Url('/images/screen/homepage/ghost_down.webp')} width="389px" height="482px" className="" />
                </div>
                <HomeJourney t={t} width={width} currentTheme={currentTheme} />
                <section className="homepage-trade3step">
                    <div className="homepage-trade3step___wrapper relative max-w-screen-v3 2xl:max-w-screen-xxl mx-auto px-4">
                        <div className="homepage-trade3step__inner">
                            <div className="homepage-trade3step___title">{t('home:trade3step.title')}</div>
                            <div className="homepage-trade3step___step___wrapper">
                                <div className="homepage-trade3step___step___item">
                                    <a href={getLoginUrl('sso', 'register')} passHref locale="en">
                                        <div className="homepage-trade3step___step___item___inner">
                                            <Image
                                                alt={`create_account_${currentTheme}`}
                                                src={getS3Url(`/images/screen/homepage/create_account_${currentTheme}.webp`)}
                                                width="48px"
                                                height="48px"
                                            />
                                            <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_1')}</div>
                                        </div>
                                    </a>

                                    <div className="homepage-trade3step__vertial_dot_line" />
                                    <div className="homepage-trade3step__horizontal_dot_line" />
                                </div>
                                <div className="homepage-trade3step___step___item">
                                    <a href={auth ? PATHS.WALLET.EXCHANGE.DEPOSIT : getLoginUrl('sso','login')} passHref>
                                        <div className="homepage-trade3step___step___item___inner">
                                            <Image alt="fiat_crypto" src={getS3Url('/images/screen/homepage/fiat_crypto.webp')} width="48px" height="48px" />

                                            <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_2')}</div>
                                        </div>
                                    </a>

                                    <div className="homepage-trade3step__vertial_dot_line" />
                                    <div className="homepage-trade3step__horizontal_dot_line" />
                                </div>
                                <div className="homepage-trade3step___step___item">
                                    <Link href={PATHS.FUTURES_V2.DEFAULT} passHref>
                                        <div className="homepage-trade3step___step___item___inner">
                                            <Image
                                                alt={`start_trading_${currentTheme}`}
                                                src={getS3Url(`/images/screen/homepage/start_trading_${currentTheme}.webp`)}
                                                width="48px"
                                                height="48px"
                                            />

                                            <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_3')}</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <HomeCurrentActivity />
        </>
    );
};

export default HomeAdditional;
