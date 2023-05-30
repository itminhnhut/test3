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
import FilterTimeTabV2 from 'components/common/FilterTimeTabV2';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
import GroupButtonCurrency from './GroupButtonCurrency';

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
    const [filter, setFilter] = useState();

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
        if(!filter) return;
        fetchDataOverview();
        fetchDataPnlChanging();
    }, [typeProduct, typeCurrency, filter]);

    return (
        <div className="w-full h-full bg-white dark:bg-dark text-gray-15 dark:text-gray-4 font-normal tracking-normal text-xs leading-[16px] md:text-base pb-[120px]">
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
            <div className="w-full px-4 relative">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto pt-20">
                <div className="flex items-center md:justify-between">
                        <GroupButtonCurrency typeCurrency={typeCurrency} setTypeCurrency={setTypeCurrency} isMobile={isMobile} />
                        <div className="vertical-divider !h-9 md:hidden"></div>
                        <FilterTimeTabV2
                            className="md:ml-4"
                            filter={filter}
                            setFilter={setFilter}
                            positionCalendar="right"
                            isTabAll
                            timeFilter={TIME_FILTER}
                            isMobile={isMobile}
                            isDark={isDark}
                            maxMonths={2}
                        />
                    </div>
                    {/* Chi so noi bat */}
                    <FeaturedStats
                        className="mt-12"
                        t={t}
                        isDark={isDark}
                        isMobile={isMobile}
                        dataOverview={dataOverview?.overallStatistic}
                        loadingOverview={loadingOverview}
                        typeCurrency={typeCurrency}
                    />

                    {isMobile && <div className="w-full border-b border-divider dark:border-divider-dark mt-[47px]"></div>}

                    {/* Bien dong loi nhuan */}
                    <PnlChanging
                        t={t}
                        isMobile={isMobile}
                        isDark={isDark}
                        dataPnl={dataPnlChanging}
                        filter={filter?.range}
                        isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                        loadingPnlChanging={loadingPnlChanging}
                        isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                    />

                    {/* Cap giao dich || Vi the mua - Vi the ban */}
                    {isMobile && <div className="w-full border-b border-divider dark:border-divider-dark mt-[47px]"></div>}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <TradingPair
                            isDark={isDark}
                            t={t}
                            typeProduct={typeProduct}
                            typeCurrency={typeCurrency}
                            filter={filter}
                            isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                            isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                            isMobile={isMobile}
                        />
                        {isMobile && <div className="w-full border-b border-divider dark:border-divider-dark my-12"></div>}
                        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-rows-2'} gap-y-8`}>
                            <PositionInfo
                                type="buy"
                                t={t}
                                total={dataOverview?.overallStatistic?.countLongPositions?.doc_count}
                                totalLoss={dataOverview?.overallStatistic?.countLossLongPositions?.total?.value}
                                totalProfit={dataOverview?.overallStatistic?.countProfitLongPositions?.total?.value}
                                totalLossPosition={dataOverview?.overallStatistic?.countLossLongPositions?.doc_count}
                                totalProfitPosition={dataOverview?.overallStatistic?.countProfitLongPositions?.doc_count}
                                isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                                isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                                isMobile={isMobile}
                                isDark={isDark}
                            />
                            <PositionInfo
                                type="sell"
                                t={t}
                                total={dataOverview?.overallStatistic?.countShortPositions?.doc_count}
                                totalLoss={dataOverview?.overallStatistic?.countLossShortPositions?.total?.value}
                                totalProfit={dataOverview?.overallStatistic?.countProfitShortPositions?.total?.value}
                                totalLossPosition={dataOverview?.overallStatistic?.countLossShortPositions?.doc_count}
                                totalProfitPosition={dataOverview?.overallStatistic?.countProfitShortPositions?.doc_count}
                                isNeverTrade={!dataOverview?.overallStatistic?.totalVolume?.value}
                                isVndc={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                                isMobile={isMobile}
                                isDark={isDark}
                            />
                        </div>
                        {isMobile && (
                            <div className="flex mt-6 items-center gap-x-2 p-3 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-12 dark:bg-dark-4">
                                <BxsInfoCircle />
                                <span>Nhấn vào từng phần để xem thống kê chi tiết</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Table top 5 positions */}
            <div className="w-full md:px-4">
                {isMobile && <div className="w-full border-b border-divider dark:border-divider-dark mt-[47px]"></div>}
                <TopPositionTable
                    className={!isMobile && 'max-w-screen-v3 2xl:max-w-screen-xxl m-auto pt-20 pb-[120px]'}
                    typeProduct={typeProduct}
                    typeCurrency={typeCurrency}
                    filter={filter}
                    isMobile={isMobile}
                    isDark={isDark}
                />
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
