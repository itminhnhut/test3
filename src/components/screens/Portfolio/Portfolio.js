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

const Portfolio = () => {
    const [type, setType] = useState(1);
    const [currency, setCurrency] = useState('VNDC');
    const { t } = useTranslation();
    const user = useSelector((state) => state?.auth?.user);

    const { width } = useWindowSize();
    const isMobile = width < WIDTH_MD;

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [curOverviewFilter, setCurOverviewFilter] = useState(listTimeFilter[0].value);

    return (
        <div className="w-full h-full bg-white dark:bg-dark text-gray-15 dark:text-gray-4 font-normal tracking-normal">
            {/* {renderTabs(mainTabs, type, setType)} */}

            {/* Banner infor */}
            <BannerInfo currency={currency} setCurrency={setCurrency} user={user} t={t} isMobile={isMobile} />

            {/* Content */}
            <div className="w-full px-4 md:px-28">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto pt-20 pb-[120px]">
                    {/* Chi so noi bat */}
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold">Chỉ số nổi bật</div>
                            <GroupFilterTime curFilter={curOverviewFilter} setCurFilter={setCurOverviewFilter} GroupKey="Overview" t={t} />
                        </div>
                        <div className="mt-8 border border-divider dark:border-transparent rounded-xl flex px-6 py-3 bg-transparent dark:bg-dark-4">
                            <div className="flex-auto px-6 py-4">
                                <span className="txtSecond-2">Tổng KLGD</span>
                                <div className="txtPri-3 mt-4">4,567,890,234</div>
                                <div className="txtSecond-2 mt-2">12,008 USDT</div>
                            </div>
                            {/* Divider */}
                            <div className="w-[1px] h-auto bg-divider dark:bg-divider-dark mx-6"></div>

                            {/* Card 2 */}
                            <div className="flex-auto px-6 py-4">
                                <span className="txtSecond-2">Tổng lợi nhuận</span>
                                <div className="text-green-3 dark:text-green-2 font-semibold text-2xl mt-4">+200,000,000</div>
                                <PriceChangePercent priceChangePercent={1.93} className="!justify-start !text-base mt-2" />
                            </div>

                            {/* Divider */}
                            <div className="w-[1px] h-auto bg-divider dark:bg-divider-dark mx-6"></div>

                            {/* Card 3 */}
                            <div className="flex-auto px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <span className="txtSecond-2">Tổng ký quỹ</span>
                                    <div>
                                        <span className="font-semibold">4,567,890</span>
                                        <span className="txtSecond-2">{` (12,008 USDT)`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="txtSecond-2">Tổng số vị thế</span>
                                    <div>
                                        <span className="font-semibold">180</span>
                                        <span className="txtSecond-2">{` (90 mua - 90 bán)`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="txtSecond-2">Đòn bẩy trung bình</span>
                                    <span className="font-semibold">10x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bien dong loi nhuan */}
                    <PnlChanging isDark={isDark} t={t} />

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
