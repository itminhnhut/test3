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
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import PriceChangePercent from 'components/common/PriceChangePercent';
import PnlChanging from './charts/PnlChanging';
import TradingPair from './charts/TradingPair';
import PositionInfo from './PositionInfo';
import TopPositionTable from './TopPositionTable';
import BannerInfo from './BannerInfo';
import { WIDTH_MD } from '../Wallet';
import FeaturedStats from './FeaturedStats';
import { FUTURES_PRODUCT } from 'constants/constants';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import { API_FUTURES_STATISTIC_OVERVIEW, API_FUTURES_STATISTIC_PAIRS, API_FUTURES_STATISTIC_PNL } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import FilterTimeTab from 'components/common/FilterTimeTab';

const TIME_FILTER = [
    {
        localized: 'dw_partner:filter.a_week',
        value: 'w',
        format: 'dd/MM',
        interval: '1d'
    },
    {
        localized: 'dw_partner:filter.a_month',
        value: 'm',
        format: 'dd/MM',
        interval: '1d'
    },
    {
        localized: 'common:all',
        value: 'all'
    }
];

const Portfolio = () => {
    const { t } = useTranslation();
    const user = useSelector((state) => state?.auth?.user);

    // Setup Responsive
    const { width } = useWindowSize();
    const isMobile = width < WIDTH_MD;

    // Setup theme
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    // Statement
    const [typeProduct, setTypeProduct] = useState(FUTURES_PRODUCT.NAMI.id);
    const [typeCurrency, setTypeCurrency] = useState(ALLOWED_ASSET_ID.VNDC);
    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    });

    // Data Overview
    const [dataOverview, setDataOverview] = useState({
        firstTimeTrade: '2023-04-21T07:39:35.002Z',
        overallStatistic: {}
    });
    const [loadingOverview, setLoadingOverview] = useState(false);

    const fetchDataOverview = async () => {
        try {
            setLoadingOverview(true);
            const { data } = await FetchApi({
                url: API_FUTURES_STATISTIC_OVERVIEW,
                params: {
                    currency: typeCurrency,
                    product: typeProduct,
                    from: filter?.range?.startDate,
                    to: filter?.range?.endDate
                }
            });

            setDataOverview({
                firstTimeTrade: data?.firstPosition?.created_at,
                overallStatistic: data?.overallStatistic
            });
        } catch (error) {
        } finally {
            setLoadingOverview(false);
        }
    };
    // Data chart Pnl changing
    const [dataPnlChanging, setDataPnlChanging] = useState({ labels: [], values: [] });
    const [loadingPnlChanging, setLoadingPnlChanging] = useState(false);
    const fetchDataPnlChanging = async () => {
        try {
            setLoadingPnlChanging(true);
            const { data } = await FetchApi({
                url: API_FUTURES_STATISTIC_PNL,
                params: {
                    currency: typeCurrency,
                    product: typeProduct,
                    from: filter?.range?.startDate,
                    to: filter?.range?.endDate
                }
            });
            setDataPnlChanging(data);
        } catch (error) {
        } finally {
            setLoadingPnlChanging(false);
        }
    };

    useEffect(() => {
        fetchDataOverview();
        fetchDataPnlChanging();
    }, [typeProduct, typeCurrency, filter]);

    return (
        <div className="w-full h-full bg-white dark:bg-dark text-gray-15 dark:text-gray-4 font-normal tracking-normal text-xs leading-[16px] md:text-base">
            {/* Banner infor */}
            <BannerInfo
                setTypeCurrency={setTypeCurrency}
                user={user}
                t={t}
                isMobile={isMobile}
                isDark={isDark}
                typeProduct={typeProduct}
                setTypeProduct={setTypeProduct}
                firstTimeTrade={dataOverview.firstTimeTrade}
                loadingOverview={loadingOverview}
            />

            {/* Content */}
            <div className="w-full px-4 md:px-28">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto pt-20 pb-[120px]">
                    <div className="flex items-center justify-between">
                        <GroupButtonCurrency typeCurrency={typeCurrency} setTypeCurrency={setTypeCurrency} />
                        <FilterTimeTab filter={filter} setFilter={setFilter} positionCalendar="right" isTabAll timeFilter={TIME_FILTER} isV2={true} />
                    </div>

                    {/* Chi so noi bat */}
                    <FeaturedStats
                        className="mt-12"
                        t={t}
                        isMobile={isMobile}
                        dataOverview={dataOverview?.overallStatistic}
                        loadingOverview={loadingOverview}
                        typeCurrency={typeCurrency}
                    />

                    {/* Bien dong loi nhuan */}
                    <PnlChanging
                        t={t}
                        isMobile={isMobile}
                        isDark={isDark}
                        dataPnl={dataPnlChanging}
                        filter={filter.range}
                        isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                        loadingPnlChanging={loadingPnlChanging}
                        isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                    />

                    {/* Cap giao dich || Vi the mua - Vi the ban */}
                    <div className="mt-12 grid grid-cols-2 gap-x-8">
                        <TradingPair
                            isDark={isDark}
                            t={t}
                            typeProduct={typeProduct}
                            typeCurrency={typeCurrency}
                            filter={filter}
                            isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                            isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                        />
                        <div className="grid grid-rows-2 gap-y-8">
                            <PositionInfo
                                type="buy"
                                t={t}
                                total={dataOverview?.overallStatistic?.countShortPositions?.doc_count}
                                totalLoss={dataOverview?.overallStatistic?.countLossShortPositions?.total?.value}
                                totalProfit={dataOverview?.overallStatistic?.countProfitShortPositions?.total?.value}
                                totalLossPosition={dataOverview?.overallStatistic?.countLossShortPositions?.doc_count}
                                totalProfitPosition={dataOverview?.overallStatistic?.countProfitShortPositions?.doc_count}
                                isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                                isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                            />
                            <PositionInfo
                                type="sell"
                                t={t}
                                total={dataOverview?.overallStatistic?.countLongPositions?.doc_count}
                                totalLoss={dataOverview?.overallStatistic?.countLossLongPositions?.total?.value}
                                totalProfit={dataOverview?.overallStatistic?.countProfitLongPositions?.total?.value}
                                totalLossPosition={dataOverview?.overallStatistic?.countLossShortPositions?.doc_count}
                                totalProfitPosition={dataOverview?.overallStatistic?.countProfitShortPositions?.doc_count}
                                isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                                isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                            />
                        </div>
                    </div>

                    {/* Table top 5 positions */}
                    <TopPositionTable typeProduct={typeProduct} typeCurrency={typeCurrency} filter={filter} />
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

const GroupButtonCurrency = ({ className, typeCurrency, setTypeCurrency }) => (
    <div className={`flex mt-0 text-sm md:text-base ${className}`}>
        <button
            onClick={() => setTypeCurrency(ALLOWED_ASSET_ID.VNDC)}
            className={`border border-divider dark:border-divider-dark rounded-l-md px-4 md:px-9 py-2 md:py-3 ${
                typeCurrency === ALLOWED_ASSET_ID.VNDC ? 'font-semibold bg-gray-12 dark:bg-dark-2 ' : 'text-gray-7 border-r-none'
            }`}
        >
            VNDC
        </button>
        <button
            onClick={() => setTypeCurrency(ALLOWED_ASSET_ID.USDT)}
            className={`border border-divider dark:border-divider-dark rounded-r-md px-4 md:px-9 py-2 md:py-3 ${
                typeCurrency === ALLOWED_ASSET_ID.USDT ? 'font-semibold bg-gray-12 dark:bg-dark-2 ' : 'text-gray-7 border-l-none'
            }`}
        >
            USDT
        </button>
    </div>
);
