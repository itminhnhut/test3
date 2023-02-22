import HomeCurrentActivity from 'src/components/screens/Home/HomeCurrentActivity';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRefWindowSize } from 'hooks/useWindowSize';
import { PATHS } from 'src/constants/paths';
import { getLoginUrl } from 'redux/actions/utils';

const HomeJourney = dynamic(() => import('./HomeJourney'), {
    ssr: false
});

const HomeAdditional = ({ currentTheme, t, width }) => {
    return (
        <>
            <div className="relative">
                <div className="absolute z-0 right-0 top-20 pointer-events-none">
                    <Image src="/images/screen/homepage/right_up.png" width="513px" height="313px" />
                </div>
                <div className="absolute z-0 bottom-0 left-0 pointer-events-none">
                    <div className="-mb-20">
                        <Image src="/images/screen/homepage/left_down.png" width="511px" height="213px" />
                    </div>
                    <Image src="/images/screen/homepage/ghost_down.png" width="389px" height="482px" className="" />
                </div>
                <HomeJourney t={t} width={width} currentTheme={currentTheme} />
                <section className="homepage-trade3step">
                    <div className="homepage-trade3step___wrapper relative mal-container">
                        <div className="homepage-trade3step___title">{t('home:trade3step.title')}</div>
                        <div className="homepage-trade3step___step___wrapper">
                            <div className="homepage-trade3step___step___item">
                                <Link href={getLoginUrl('sso', 'register')} passHref>
                                    <div className="homepage-trade3step___step___item___inner">
                                        <Image src={`/images/screen/homepage/create_account_${currentTheme}.png`} width="48px" height="48px" />
                                        <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_1')}</div>
                                    </div>
                                </Link>

                                <div className="homepage-trade3step__vertial_dot_line" />
                                <div className="homepage-trade3step__horizontal_dot_line" />
                            </div>
                            <div className="homepage-trade3step___step___item">
                                <Link href={PATHS.WALLET.EXCHANGE.DEPOSIT} passHref>
                                    <div className="homepage-trade3step___step___item___inner">
                                        <Image src="/images/screen/homepage/fiat_crypto.png" width="48px" height="48px" />

                                        <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_2')}</div>
                                    </div>
                                </Link>

                                <div className="homepage-trade3step__vertial_dot_line" />
                                <div className="homepage-trade3step__horizontal_dot_line" />
                            </div>
                            <div className="homepage-trade3step___step___item">
                                <Link href={PATHS.FUTURES_V2.DEFAULT} passHref>
                                    <div className="homepage-trade3step___step___item___inner">
                                        <Image src={`/images/screen/homepage/start_trading_${currentTheme}.png`} width="48px" height="48px" />

                                        <div className="homepage-trade3step___step___item__sublabel">{t('home:trade3step.step_3')}</div>
                                    </div>
                                </Link>
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
