import React, { Fragment } from 'react';
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
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import PriceChangePercent from 'components/common/PriceChangePercent';
import { ArrowDropDownIcon, HelpIcon } from 'components/svg/SvgIcon';

import PnlChanging from './charts/PnlChanging';
import TradingPair from './charts/TradingPair';
import PositionInfo from './PositionInfo';
import TopPositionTable from './TopPositionTable';
import BannerInfo from './BannerInfo';
import { WIDTH_MD } from '../Wallet';
import HelpCircle from 'components/svg/HelpCircle';
import colors from 'styles/colors';
import Tooltip from 'components/common/Tooltip';
import { formatPrice, formatNanNumber } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import { getUsdRate } from 'redux/actions/market';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import { formatNumber } from 'utils/reference-utils';
import classNames from 'classnames';
import HeaderTooltip from './HeaderTooltip';

const FeaturedStats = ({ className, user, t, isMobile, isDark, dataOverview, loadingOverview, typeCurrency }) => {
    const [curOverviewFilter, setCurOverviewFilter] = useState(listTimeFilter[0].value);
    const [isCollapse, setIsCollapse] = useState(false);

    const [vndcUsdRate, setVndcUsdRate] = useState();
    useEffect(() => {
        getUsdRate().then((usdRates) => {
            setVndcUsdRate(usdRates[typeCurrency]);
        });
    }, []);

    const isVnd = typeCurrency === ALLOWED_ASSET_ID.VNDC;

    const renderSumVolumns = useCallback(() => {
        const totalVolume = dataOverview?.totalVolume?.value;
        const swapValue = isVnd ? formatNanNumber(totalVolume * vndcUsdRate, 4) + ' USDT' : formatNanNumber(totalVolume / vndcUsdRate, 0) + ' VNDC';
        return (
            <div className={isMobile ? 'w-1/2 flex flex-col justify-center items-center flex-1 py-4' : 'flex-auto px-6 py-4'}>
                <span>Tổng KLGD</span>
                <div className="txtPri-3 mt-2 md:mt-4">
                    {loadingOverview ? <Skeletor width={150} /> : formatNanNumber(totalVolume, typeCurrency === ALLOWED_ASSET_ID.VNDC ? 0 : 4)}
                </div>
                <div className="mt-1 md:mt-2">{loadingOverview ? <Skeletor width={150} /> : swapValue}</div>
            </div>
        );
    }, [isMobile, loadingOverview, dataOverview, vndcUsdRate]);

    const renderSumPnl = useCallback(() => {
        const totalPnl = dataOverview?.totalPnl?.value;
        const sign = totalPnl > 0 ? '+ ' : '';

        return (
            <div className={isMobile ? 'w-1/2 flex flex-col justify-center items-center flex-1 py-4' : 'flex-auto px-6 py-4'}>
                <span>Tổng lợi nhuận</span>
                <div
                    className={classNames('txtPri-3 mt-2 md:mt-4', {
                        '!text-green-3 !dark:text-green-2': totalPnl > 0,
                        '!text-red-2 !dark:text-red': totalPnl < 0
                    })}
                >
                    {loadingOverview ? <Skeletor width={150} /> : `${sign} ${formatNanNumber(totalPnl, isVnd ? 0 : 4)}`}
                </div>
                {loadingOverview ? (
                    <Skeletor width={50} />
                ) : totalPnl === 0 ? (
                    <div className='mt-1 md:mt-2'>
                        0%
                    </div>
                ) : (
                    <PriceChangePercent
                        priceChangePercent={totalPnl / dataOverview?.totalMargin?.value}
                        className="!justify-start text-xs leading-[16px] md:text-base mt-1 md:mt-2"
                    />
                )}
            </div>
        );
    }, [isMobile, loadingOverview, dataOverview, vndcUsdRate]);

    const renderOtherSummary = useCallback(() => {
        const totalMargin = dataOverview?.totalMargin?.value;
        const swapValue = isVnd ? formatNanNumber(totalMargin * vndcUsdRate, 4) + ' USDT' : formatNanNumber(totalMargin / vndcUsdRate, 0) + ' VNDC';
        const avgLeverage = formatNanNumber(dataOverview?.avgLeverage?.value, 0);

        return (
            <div className="flex-auto md:px-6 py-4">
                <div className="flex items-center justify-between">
                    <span>Tổng ký quỹ</span>
                    {loadingOverview ? (
                        <Skeletor width={200} />
                    ) : (
                        <div>
                            <span className="txtPri-1">{formatNanNumber(totalMargin, isVnd ? 0 : 4)}</span>
                            <span className="txtSecond-2">{` (${swapValue})`}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span>Tổng số vị thế</span>
                    {loadingOverview ? (
                        <Skeletor width={200} />
                    ) : (
                        <div>
                            <span className="txtPri-1">{dataOverview?.totalPositions?.value}</span>
                            <span className="txtSecond-2">{` (${dataOverview?.countLongPositions?.doc_count} mua - ${dataOverview?.countShortPositions?.doc_count} bán)`}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span>Đòn bẩy trung bình</span>
                    {loadingOverview ? <Skeletor width={50} /> : <span className="txtPri-1">{avgLeverage ? `${avgLeverage}X` : '-'}</span>}
                </div>
            </div>
        );
    });

    return (
        <div className={className}>
            <HeaderTooltip title='Chỉ số nổi bật' tooltipContent={t('portfolio:key_statistic')} tooltipId={'key_statistic_tooltip'}/>

            <Tooltip id={'key_statistic'} place="top" className="max-w-[520px]" />
            {/* <div className="flex items-center cursor-pointer w-max" data-tip={t('portfolio:key_statistic')} data-for="key_statistic">
                <div className="text-base md:text-2xl font-semibold pr-2">Chỉ số nổi bật</div>
                <HelpIcon color="currentColor" /> */}
                {/* {isMobile ? (
                    <ArrowDropDownIcon
                        onClick={() => setIsCollapse((prev) => !prev)}
                        isFilled
                        size={24}
                        className={`md:hidden cursor-pointer select-none transition-transform duration-75 ${isCollapse && 'rotate-180'}`}
                    />
                ) : (
                    <GroupTextFilter className="hidden md:flex" curFilter={curOverviewFilter} setCurFilter={setCurOverviewFilter} GroupKey="Overview" t={t} />
                )} */}
            {/* </div> */}
            {/* <GroupTextFilter className={`md:hidden mt-4`} curFilter={curOverviewFilter} setCurFilter={setCurOverviewFilter} GroupKey="Overview" t={t} /> */}

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
