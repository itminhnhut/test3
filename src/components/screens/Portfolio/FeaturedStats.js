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
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';

import PnlChanging from './charts/PnlChanging';
import TradingPair from './charts/TradingPair';
import PositionInfo from './PositionInfo';
import TopPositionTable from './TopPositionTable';
import BannerInfo from './BannerInfo';
import { WIDTH_MD } from '../Wallet';

const FeaturedStats = ({ user, t, isMobile, isDark }) => {
    const [curOverviewFilter, setCurOverviewFilter] = useState(listTimeFilter[0].value);
    const [isCollapse, setIsCollapse] = useState(false);

    const renderSumVolumns = () => (
        <div className={isMobile ? 'w-1/2 flex flex-col justify-center items-center flex-1 py-4' : 'flex-auto px-6 py-4'}>
            <span>Tổng KLGD</span>
            <div className="txtPri-5 mt-2 md:mt-4">4,567,890,234</div>
            <div className="mt-1 md:mt-2">12,008 USDT</div>
        </div>
    );

    const renderSumPnl = () => (
        <div className={isMobile ? 'w-1/2 flex flex-col justify-center items-center flex-1 py-4' : 'flex-auto px-6 py-4'}>
            <span>Tổng lợi nhuận</span>
            <div className="!text-green-3 !dark:text-green-2 txtPri-5 mt-2 md:mt-4">+200,000,000</div>
            <PriceChangePercent priceChangePercent={1.93} className="!justify-start text-xs leading-[16px] md:text-base mt-1 md:mt-2" />
        </div>
    );

    const renderOtherSummary = () => (
        <div className="flex-auto md:px-6 py-4">
            <div className="flex items-center justify-between">
                <span>Tổng ký quỹ</span>
                <div>
                    <span className="txtPri-1">4,567,890</span>
                    <span className="txtSecond-2">{` (12,008 USDT)`}</span>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3">
                <span>Tổng số vị thế</span>
                <div>
                    <span className="txtPri-1">180</span>
                    <span className="txtSecond-2">{` (90 mua - 90 bán)`}</span>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3">
                <span>Đòn bẩy trung bình</span>
                <span className="txtPri-1">10x</span>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="text-base md:text-2xl font-semibold">Chỉ số nổi bật</div>
                {isMobile ? (
                    <ArrowDropDownIcon
                        onClick={() => setIsCollapse((prev) => !prev)}
                        isFilled
                        size={24}
                        className={`md:hidden cursor-pointer select-none transition-transform duration-75 ${isCollapse && 'rotate-180'}`}
                    />
                ) : (
                    <GroupFilterTime className="hidden md:flex" curFilter={curOverviewFilter} setCurFilter={setCurOverviewFilter} GroupKey="Overview" t={t} />
                )}
            </div>
            <GroupFilterTime className={`md:hidden mt-4`} curFilter={curOverviewFilter} setCurFilter={setCurOverviewFilter} GroupKey="Overview" t={t} />

            {/* Cards */}
            {isMobile ? (
                <div className="mt-6 text-gray-1 dark:text-gray-7">
                    <div className="border border-divider dark:border-divider-dark rounded-xl flex">
                        {renderSumVolumns()}
                        <div className="vertical-divider !mx-2"></div>
                        {renderSumPnl()}
                    </div>
                    {renderOtherSummary()}
                </div>
            ) : (
                <div className=" text-gray-1 dark:text-gray-7 mt-8 border border-divider dark:border-transparent rounded-xl flex px-6 py-3 bg-transparent dark:bg-dark-4">
                    {renderSumVolumns()}
                    <div className="vertical-divider"></div>
                    {renderSumPnl()}
                    <div className="vertical-divider"></div>

                    {/* Card 3 */}
                    {renderOtherSummary()}
                </div>
            )}
        </div>
    );
};

export default FeaturedStats;
