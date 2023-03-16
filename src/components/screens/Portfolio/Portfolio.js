import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Button from '../../common/Button';
import FuturePortfolio from './FuturePortfolio';
import { ComponentTabWrapper, ComponentTabItem, ComponentTabUnderline } from './styledPortfolio';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useWindowSize from 'hooks/useWindowSize';
import GroupFilterTime, { listTimeFilter } from 'components/common/GroupFilterTime';
import PriceChangePercent from 'components/common/PriceChangePercent';
import PnlChanging from './charts/PnlChanging';
import TradingPair from './charts/TradingPair';
import PositionInfo from './PositionInfo';
import TopPositionTable from './TopPositionTable';
import BannerInfo from './BannerInfo';
import { WIDTH_MD } from '../Wallet';
import FeaturedStats from './FeaturedStats';

const Portfolio = () => {
    const [type, setType] = useState(1);
    const [currency, setCurrency] = useState('VNDC');
    const { t } = useTranslation();
    const user = useSelector((state) => state?.auth?.user);

    const { width } = useWindowSize();
    const isMobile = width < WIDTH_MD;

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    return (
        <div className="w-full h-full bg-white dark:bg-dark text-gray-15 dark:text-gray-4 font-normal tracking-normal text-xs leading-[16px] md:text-base">
            {/* {renderTabs(mainTabs, type, setType)} */}

            {/* Banner infor */}
            <BannerInfo currency={currency} setCurrency={setCurrency} user={user} t={t} isMobile={isMobile} isDark={isDark} />

            {/* Content */}
            <div className="w-full px-4 md:px-28">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto pt-20 pb-[120px]">
                    {/* Chi so noi bat */}
                    <FeaturedStats t={t} isMobile={isMobile} />

                    {/* Bien dong loi nhuan */}
                    <PnlChanging t={t} isMobile={isMobile} isDark={isDark} />

                    {/* Cap giao dich || Vi the mua - Vi the ban */}
                    <div className="mt-12 grid grid-cols-2 gap-x-8">
                        <TradingPair isDark={isDark} t={t} />
                        <div className="grid grid-rows-2 gap-y-8">
                            <PositionInfo type="buy" t={t} />
                            <PositionInfo type="sell" t={t} />
                        </div>
                    </div>

                    {/* Table top 5 positions */}
                    <TopPositionTable />
                </div>
            </div>
        </div>
    );
};

export default Portfolio;

export const renderTabs = (tabs, tabType, setTabType, haveUnderline = true) => {
    return (
        <ComponentTabWrapper haveUnderline={haveUnderline}>
            {tabs.map((tab) => (
                <div>
                    <ComponentTabItem active={tabType === tab.value} onClick={() => setTabType(tab.value)}>
                        {tab.content}
                        {tabType === tab.value && <ComponentTabUnderline></ComponentTabUnderline>}
                    </ComponentTabItem>
                </div>
            ))}
        </ComponentTabWrapper>
    );
};

export const renderApexChart = (data, { height = '100%', width }) => (
    <Chart key="nami" options={data.options} series={data.series} type={data.type} height={height} width="100%" />
);
