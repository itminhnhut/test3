import React, { useRef, useState, useEffect, useMemo, memo, useReducer } from 'react';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { TextLiner, CardNao, Tooltip } from 'components/screens/Nao/NaoStyle';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import { useWindowSize } from 'utils/customHooks';
import { getS3Url, formatNumber, formatTime, formatAbbreviateNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import {
    API_POOL_INFO,
    API_GET_REFERENCE_CURRENCY,
    API_POOL_SHARE_HISTORIES,
    API_NAO_DASHBOARD_POOL_STATISTIC,
    API_NAO_DASHBOARD_FEE_REVENUE
} from 'redux/actions/apis';
import { ApiStatus, ThemeMode } from 'redux/actions/const';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AssetLogo from 'components/wallet/AssetLogo';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import classNames from 'classnames';
import RangePopover from '../Components/RangePopover';
import { useIsomorphicLayoutEffect } from 'react-use';
import { Spinner } from 'components/common/Icons';
import { isFunction } from 'lodash';
import colors from 'styles/colors';
import dynamic from 'next/dynamic';
import { format, parse } from 'date-fns';
import styled from 'styled-components';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
// this code block for mocking assets

// const mockAssets = [447, 72, 1, 86, 22];
// const mock = new Array(5).fill({
//     interestUSD: mockAssets.reduce((prev, curr) => ({ ...prev, [curr]: 100000}), {}),
//     interest: mockAssets.reduce((prev, curr) => ({ ...prev, [curr]: 200000}), {}),
//     fromTime: Date.now(),
//     toTime: Date.now() + 86400000 * 7,
// });

const ApexChartWrapper = styled.div`
    .apexcharts-tooltip {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
    }
`;

const days = [
    {
        en: 'Last week',
        vi: 'Tuần trước',
        value: '-w'
    },
    {
        en: 'This week',
        vi: 'Tuần này',
        value: 'w'
    },
    {
        en: 'This month',
        vi: 'Tháng này',
        value: 'm'
    },
    {
        en: 'All',
        vi: 'Tất cả',
        value: 'all'
    },
    {
        en: 'Custom',
        vi: 'Tuỳ chỉnh',
        value: 'custom'
    }
];

const getAssets = createSelector([(state) => state.utils, (utils, params) => params], (utils, params) => {
    const assets = {};
    const arr = [1, 72, 86, 447, 22];
    arr.map((id) => {
        const asset = utils.assetConfig.find((rs) => rs.id === id);
        if (asset) {
            assets[id] = {
                assetCode: asset?.assetCode,
                assetDigit: asset?.assetDigit,
                assetName: asset?.assetName
            };
        }
    });
    return assets;
});

const SubPrice = ({ price, digitsPrice = 3, isShowLabel = true }) => (
    <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
        {' '}
        {isShowLabel ? `` : null}${formatNumber(price, digitsPrice)}
    </span>
);

const CHART_TYPES = {
    pool_info: 'pool_info',
    fee_revenue: 'fee_revenue'
};

const chartReducer = (state, action = { type: '', payload: {} }) => {
    const { type, payload } = action;

    switch (type) {
        case CHART_TYPES.pool_info: {
            return { ...state, [CHART_TYPES.pool_info]: payload };
        }
        case CHART_TYPES.fee_revenue: {
            return { ...state, [CHART_TYPES.fee_revenue]: payload };
        }
        default:
            return state;
    }
};

const isValidRange = (range) => range && days.some(({ value }) => value === range);

function reorderSvg() {
    const inner = document.querySelector('#nao_pool .apexcharts-inner'),
        yaxis = document.querySelector('#nao_pool .apexcharts-yaxis');

    inner?.before(yaxis);
}

const NaoPool = ({ dataSource, assetNao }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const sliderRef = useRef(null);
    const chartRef = useRef(null);
    const { width } = useWindowSize();
    const [referencePrice, setReferencePrice] = useState({});
    const [listHitory, setListHitory] = useState([]);
    const router = useRouter();
    const assetConfig = useSelector((state) => getAssets(state));
    const [actIdx, setActIdx] = useState(0);
    const isMobile = width < 820;
    const { poolRange } = router.query;
    const initRange = isValidRange(poolRange) ? poolRange : 'w';
    const [filter, setFilter] = useState({
        day: initRange
    });
    const [range, setRange] = useState({
        startDate: undefined,
        endDate: undefined,
        key: 'selection'
    });
    const [chartInterval, setChartInterval] = useState('day');
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);
    const [data, setData] = useState({
        availableStakedVNDC: dataSource?.availableStakedVNDC ?? 0,
        availableStaked: dataSource?.availableStaked ?? 0,
        totalStaked: dataSource?.totalStaked ?? 0,
        totalStakedVNDC: dataSource?.totalStakedVNDC ?? 0,
        totalUsers: formatNumber(dataSource?.totalUser, 0),
        estimate: dataSource?.poolRevenueThisWeek ?? {},
        estimateUsd: dataSource?.poolRevenueThisWeekUSD ?? {}
    });
    useEffect(() => {
        setData({
            availableStakedVNDC: dataSource?.availableStakedVNDC ?? 0,
            availableStaked: dataSource?.availableStaked ?? 0,
            totalStaked: dataSource?.totalStaked ?? 0,
            totalStakedVNDC: dataSource?.totalStakedVNDC ?? 0,
            totalUsers: formatNumber(dataSource?.totalUser, 0),
            estimate: dataSource?.poolRevenueThisWeek ?? {},
            estimateUsd: dataSource?.poolRevenueThisWeekUSD ?? {}
        });
    }, [dataSource]);
    const [chartType, setChartType] = useState(CHART_TYPES.pool_info);
    const defaultChartData = {
        name: 'day',
        data: []
    };
    const [chartData, dispatch] = useReducer(chartReducer, {
        [CHART_TYPES.pool_info]: [defaultChartData],
        [CHART_TYPES.fee_revenue]: [defaultChartData]
    });

    const apexOptions = useMemo(() => {
        return {
            chart: {
                offsetX: 0,
                offsetY: 0,
                // parentHeightOffset: 0,
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                },
                height: '100%',
                width: '100%',
                events: {
                    mounted: reorderSvg,
                    updated: reorderSvg
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            colors: [colors.teal],
            markers: {
                size: 4,
                colors: colors.teal,
                strokeColors: isDark ? colors.dark.dark : colors.white,
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeDashArray: 0,
                fillOpacity: 1,
                shape: 'circle',
                radius: 2,
                showNullDataPoints: true,
                hover: {
                    size: 4
                }
            },
            grid: {
                show: true,
                borderColor: isDark ? colors.divider.dark : colors.divider.DEFAULT,
                strokeDashArray: 2,
                position: 'back',
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: !isMobile
                    }
                },
                padding: {
                    left: 2
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    formatter: (value) => {
                        if (!value) return '';
                        if (chartInterval === 'month') {
                            return format(value, 'MM/yyyy');
                        }
                        return format(value, 'dd/MM');
                    },
                    style: {
                        colors: isDark ? colors.gray[7] : colors.gray[1]
                    }
                },
                tickAmount: 'dataPoints',
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: true,
                    color: isDark ? colors.divider.dark : colors.divider.DEFAULT
                },
                tooltip: {
                    enabled: false
                },
                crosshairs: {
                    show: false
                }
            },
            yaxis: {
                show: true,
                axisBorder: {
                    show: true,
                    color: isDark ? colors.divider.dark : colors.divider.DEFAULT
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: isDark ? colors.gray[7] : colors.gray[1]
                    },
                    formatter: (value) => {
                        return formatAbbreviateNumber(value, 3);
                    },
                    offsetX: -10,
                    align: 'left',
                }
            },
            fill: {
                gradient: {
                    type: 'vertical',
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 100],
                    gradientToColors: ['#47cc8526', '#47cc8500']
                    // shade: 'dark'
                }
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    const y = series[seriesIndex][dataPointIndex];
                    const x = w.globals.seriesX[0][dataPointIndex];
                    return `
                        <div class="bg-gray-15 dark:bg-dark-2 p-2 mb:p-3 rounded-md border-none outline-none">
                            <div class="text-txtSecondary dark:text-txtSecondary-dark text-xxs mb:text-sm">${x ? format(x, 'dd/MM/yyyy') : ''}</div>
                            <div class="text-white dark:text-txtPrimary-dark mt-3 font-semibold text-xs mb:text-base">${formatNumber(
                                y / (referencePrice['VNDC'] ?? 0),
                                0
                            )} VNDC</div>
                            <div class="text-txtSecondary dark:text-txtSecondary-dark text-right text-xxs mb:text-sm">$ ${formatNumber(y, 2)}</div>
                        </div>
                    `;
                }
            }
        };
    }, [isDark, isMobile, referencePrice, chartInterval]);

    const onNavigate = (isNext) => {
        if (sliderRef.current) {
            sliderRef.current.swiper[isNext ? 'slideNext' : 'slidePrev']();
        }
    };

    const HistoryPriceItem = ({ s3Url, total, digitsTotal, usdPrice, digitsUsdPrice = 3, isUSDT = false, assetName, assetSymbol }) => (
        <div className="flex items-center w-full">
            {!isUSDT ? (
                <img src={getS3Url(s3Url)} width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} alt="" />
            ) : (
                <AssetLogo assetId={22} size={isMobile ? 24 : 32} />
            )}
            <div className="ml-3 flex-1">
                <div className="flex justify-between text-sm font-semibold">
                    <div className="">{assetSymbol}</div>
                    <div className="">{formatNumber(total, digitsTotal)}</div>
                </div>
                <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="">{assetName}</div>
                    <SubPrice price={usdPrice} digitsPrice={digitsUsdPrice} isShowLabel={false} />
                </div>
            </div>
        </div>
    );

    const CardHistoryPrice = ({ children }) => {
        return <div className={'w-full'}>{children}</div>;
    };

    const renderSlide = () => {
        const size = 1;
        const page = Array.isArray(listHitory) && Math.ceil(listHitory.length / size);
        const result = [];
        let weekNumber = listHitory.length + 1;
        for (let i = 0; i < page; i++) {
            const dataFilter = listHitory.slice(i * size, (i + 1) * size);
            result.push(
                <SwiperSlide key={i}>
                    <div className="flex w-full">
                        {dataFilter.map((item, index) => {
                            const sumUSDT = Object.values(item.interestUSD).reduce((a, b) => a + b, 0);
                            weekNumber--;
                            return (
                                <CardHistoryPrice key={index}>
                                    <div className="w-full">
                                        <div className="flex flex-col sm:flex-row w-full sm:space-x-8 lg:w-auto">
                                            <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                                                {t('nao:pool:week', { value: weekNumber })} {formatTime(item.fromTime, 'dd/MM/yyyy')} -{' '}
                                                {formatTime(item.toTime, 'dd/MM/yyyy')}
                                            </span>
                                            <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                                                {t('nao:pool:equivalent')}: <SubPrice price={sumUSDT} digitsPrice={assetConfig[22]?.assetDigit ?? 3} />
                                            </span>
                                        </div>
                                        <div className="pt-6 sm:pt-8 flex flex-col space-y-4 sm:space-y-6">
                                            <div className="w-full sm:p-0.5">
                                                <HistoryPriceItem
                                                    s3Url={'/images/nao/ic_nao.png'}
                                                    total={item?.interest?.[447]}
                                                    digitsTotal={assetConfig[447]?.assetDigit ?? 8}
                                                    usdPrice={item?.interestUSD?.[447]}
                                                    assetName={assetConfig[447]?.assetName}
                                                    assetSymbol={assetConfig[447]?.assetCode}
                                                />
                                            </div>
                                            <div className="w-full sm:p-0.5">
                                                <HistoryPriceItem
                                                    s3Url={'/images/nao/ic_vndc.png'}
                                                    total={item?.interest?.[72]}
                                                    digitsTotal={assetConfig[72]?.assetDigit ?? 0}
                                                    usdPrice={item?.interestUSD?.[72]}
                                                    assetName={assetConfig[72]?.assetName}
                                                    assetSymbol={assetConfig[72]?.assetCode}
                                                />
                                            </div>
                                            <div className="w-full sm:p-0.5">
                                                <HistoryPriceItem
                                                    s3Url={`/images/coins/64/${1}.png`}
                                                    total={item?.interest?.[1]}
                                                    digitsTotal={assetConfig[1]?.assetDigit ?? 0}
                                                    usdPrice={item?.interestUSD?.[1]}
                                                    assetName={assetConfig[1]?.assetName}
                                                    assetSymbol={assetConfig[1]?.assetCode}
                                                />
                                            </div>
                                            {item?.interest?.[86] > 0 && (
                                                <div className="w-full sm:p-0.5">
                                                    <HistoryPriceItem
                                                        s3Url={`/images/nao/ic_onus.png`}
                                                        total={item?.interest?.[86]}
                                                        digitsTotal={assetConfig[86]?.assetDigit ?? 0}
                                                        usdPrice={item?.interestUSD?.[86]}
                                                        assetName={assetConfig[86]?.assetName}
                                                        assetSymbol={assetConfig[86]?.assetCode}
                                                    />
                                                </div>
                                            )}
                                            <div className="w-full sm:p-0.5">
                                                <HistoryPriceItem
                                                    s3Url={`/images/nao/ic_onus.png`}
                                                    total={item?.interest?.[22]}
                                                    digitsTotal={assetConfig[22]?.assetDigit ?? 0}
                                                    usdPrice={item?.interestUSD?.[22]}
                                                    isUSDT
                                                    assetName={assetConfig[22]?.assetName}
                                                    assetSymbol={assetConfig[22]?.assetCode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardHistoryPrice>
                            );
                        })}
                    </div>
                </SwiperSlide>
            );
        }
        return result;
    };

    const isValidCustomDay = filter.day !== 'custom' || !!(range.startDate && range.endDate);

    useIsomorphicLayoutEffect(() => {
        const { poolRange } = router.query;
        if (isValidRange(poolRange)) {
            setFilter((old) => ({ ...old, day: poolRange }));
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        getRef();
        getListHistory();
    }, []);

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: { base: 'VNDC,USDT', quote: 'USD' }
            });
            if (data) {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [current.base]: current.price
                        };
                    }, {})
                );
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const getListHistory = async () => {
        try {
            const { data, status } = await fetchApi({
                url: API_POOL_SHARE_HISTORIES
            });
            if (status === ApiStatus.SUCCESS && Array.isArray(data) && data) {
                setListHitory(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const getPoolData = async () => {
        if (!isValidCustomDay) {
            return;
        }
        setLoading(true);
        try {
            const { data: _data } = await fetchApi({
                url: API_NAO_DASHBOARD_POOL_STATISTIC,
                options: { method: 'GET' },
                params: {
                    range: filter.day,
                    from: range.startDate,
                    to: range.endDate
                }
            });

            setChartInterval(_data?.interval);
            const length = _data?.result.length || 0;
            if (!length) {
                setData((old) => ({
                    ...old,
                    totalStaked: 0,
                    totalStakedVNDC: 0,
                    totalUsers: 0
                }));
                dispatch({
                    type: CHART_TYPES.pool_info,
                    payload: [defaultChartData]
                });
            } else {
                const last = _data?.result[length - 1];
                setData((old) => ({
                    ...old,
                    totalStakedVNDC: last?.document?.totalStakedVndc || 0,
                    totalStakedUSDT: last?.document?.totalStakedUsdt || 0,
                    totalStaked: last?.document?.totalStaked || 0,
                    totalUsers: last?.document?.totalUser || 0
                }));

                const _chartData =
                    _data?.result.map((item) => {
                        return [parse(item['_id'], 'dd/MM/yyyy', new Date()), item.document?.totalStakedUsdt || 0];
                    });
                dispatch({
                    type: CHART_TYPES.pool_info,
                    payload: [{ name: 'pool info', data: _chartData }]
                });
            }
        } catch (e) {
            console.log({ ee: e.message });
        } finally {
            setLoading(false);
            if (chartType === CHART_TYPES.pool_info) {
                setChartLoading(false);
            }
        }
    };

    const getFeeRevenue = async () => {
        if (!isValidCustomDay) {
            return;
        }
        setLoading(true);
        try {
            const { data: _data } = await fetchApi({
                url: API_NAO_DASHBOARD_FEE_REVENUE,
                options: { method: 'GET' },
                params: {
                    range: filter.day,
                    from: range.startDate,
                    to: range.endDate
                }
            });
            setChartInterval(_data?.interval);
            const length = _data?.result.length;
            if (!length) {
                dispatch({
                    type: CHART_TYPES.fee_revenue,
                    payload: [defaultChartData]
                });
            } else {
                const _chartData = _data?.result.map((item) => {
                    return [parse(item['_id'], 'dd/MM/yyyy', new Date()), item.feeRevenueUsdt || 0];
                });
                dispatch({
                    type: CHART_TYPES.fee_revenue,
                    payload: [{ name: 'Fee revenue', data: _chartData }]
                });
            }
        } catch (e) {
            console.log({ ee: e.message });
        } finally {
            setLoading(false);
            if (chartType === CHART_TYPES.fee_revenue) {
                setChartLoading(false);
            }
        }
    };


    // // zoom and pan stuff
    // useEffect(() => {
    //     if (chartLoading) {
    //         return;
    //     }
    //     setTimeout(() => {
    //         const maxCols = isMobile ? 6 : 12;
    //         const cols = chartData[chartType].labels.length;
    //         const zoom = cols - 2 > maxCols ? (cols - 2) / maxCols : 1;
    //         chartRef.current?.zoom?.({ x: zoom });
    //         chartRef.current?.pan?.({ x: maxCols * -100 }, null, 'zoom');
    //     }, 10);
    // }, [chartData[chartType], chartLoading, isMobile]);

    useEffect(() => {
        const controller = new AbortController();
        setChartLoading(true);
        getPoolData(controller.signal);
        getFeeRevenue(controller.signal);
    }, [filter.day, range, isDark]);

    const updateDateRangeUrl = (dateValue) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    poolRange: dateValue
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    const handleChangeDateRange = (day) => {
        if (day !== filter.day) {
            setFilter((old) => ({ ...old, day }));
            updateDateRangeUrl(day);
        }
    };

    const PoolPriceItem = ({ s3Url, price, usdPrice, digitsPrice, digitsUsdPrice = 3, isUSDT = false, assetName, assetSymbol }) => (
        <div className="flex items-center w-full">
            {!isUSDT ? (
                <img src={getS3Url(s3Url)} width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} alt="" />
            ) : (
                <AssetLogo assetId={22} size={isMobile ? 24 : 32} />
            )}
            <div className="ml-3 flex-1">
                <div className="flex justify-between text-sm font-semibold">
                    <div className="">{assetSymbol}</div>
                    <div className="">{formatNumber(price, digitsPrice)}</div>
                </div>
                <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="">{assetName}</div>
                    <SubPrice price={usdPrice} digitsPrice={digitsUsdPrice} isShowLabel={false} />
                </div>
            </div>
        </div>
    );

    return (
        <section id="nao_pool" className="pt-12 sm:pt-20 text-sm sm:text-base">
            <div className="flex sm:items-center justify-between gap-4">
                <div className="space-y-2 flex flex-col">
                    <TextLiner className="normal-case">{t('nao:pool:title')}</TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:pool:description')}</span>
                </div>
                <div className="ml-auto">
                    <RangePopover
                        language={language}
                        active={days.find((d) => d.value === filter.day)}
                        onChange={handleChangeDateRange}
                        className="flex order-last"
                        popoverClassName="mb:mr-2"
                        range={range}
                        setRange={setRange}
                        days={days}
                        fallbackDay="w"
                    />
                </div>
            </div>
            <div className="mt-6 grid grid-cols-12 gap-4 sm:gap-6">
                <CardNao className="sm:!min-w-[50%] sm:!px-8 sm:!py-8 flex flex-col col-span-12 lg:col-span-4" customHeight="sm:max-h-[514px]">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark text-base sm:text-lg font-semibold">{t('nao:pool:nao_staked')}</label>
                    <div className="flex flex-col mt-4">
                        <div className="text-xl sm:text-2xl font-semibold flex items-center space-x-2">
                            {loading ? (
                                <Spinner color="currentColor" size={24} className="text-teal" />
                            ) : (
                                <span className="leading-8">{formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}</span>
                            )}
                        </div>
                        <span className="text-sm text-transparent mt-2">a</span>
                    </div>

                    <hr className="border-divider dark:border-divider-dark my-5 sm:my-8" />

                    <Tooltip id="tooltip-pool-value" />
                    <label
                        className="text-txtSecondary dark:text-txtSecondary-dark text-base sm:text-lg font-semibold border-b border-dashed border-gray-1 dark:border-gray-7 w-[fit-content]"
                        data-tip={t('nao:pool:pool_value_tooltip')}
                        data-for="tooltip-pool-value"
                    >
                        {t('nao:pool:pool_value')}
                    </label>
                    <div className="flex flex-col mt-4">
                        {loading ? (
                            <>
                                <Spinner color="currentColor" size={24} className="text-teal" />
                                <Spinner color="currentColor" size={14} className="text-teal mt-2" />
                            </>
                        ) : (
                            <>
                                <div className="text-xl sm:text-2xl font-semibold flex items-center space-x-2">
                                    <span className="leading-8">{formatNumber(data.totalStakedVNDC, 0)} VNDC</span>
                                </div>
                                <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark mt-2">
                                    ${formatNumber(data.totalStakedVNDC * (referencePrice['VNDC'] ?? 1), 4)}
                                </span>
                            </>
                        )}
                    </div>

                    <hr className="border-divider dark:border-divider-dark my-5 sm:my-8" />

                    <label className="text-txtSecondary dark:text-txtSecondary-dark text-base sm:text-lg font-semibold">{t('nao:pool:participants')}</label>
                    <div className="flex flex-col mt-4">
                        {loading ? (
                            <>
                                <Spinner color="currentColor" size={24} className="text-teal" />
                                <Spinner color="currentColor" size={14} className="text-teal mt-2" />
                            </>
                        ) : (
                            <>
                                <div className="text-xl sm:text-2xl font-semibold">{data.totalUsers}</div>
                                <div
                                    className="text-sm text-txtSecondary dark:text-txtSecondary-dark mt-2"
                                    dangerouslySetInnerHTML={{ __html: t('nao:pool:participants_today', { value: dataSource?.totalUserToday ?? 0 }) }}
                                ></div>
                            </>
                        )}
                    </div>
                </CardNao>
                <CardNao
                    className="sm:!min-w-[50%] sm:!p-8 !p-4 flex-col sm:items-start whitespace-nowrap min-h-[360px] col-span-12 lg:col-span-8 !flex-none"
                    customHeight="sm:max-h-[514px]"
                >
                    <div className="order-first w-full">
                        {/* <TextLiner className="w-full">{t('nao:onus_performance:chart_title')}</TextLiner> */}
                        <div className="flex gap-last lg:justify-end w-auto overflow-auto no-scrollbar space-x-4">
                            {Object.values(CHART_TYPES).map((type) => (
                                <button
                                    type="BUTTON"
                                    className={classNames('flex flex-col justify-center items-center text-sm sm:text-base text-txtSecondary', {
                                        '!text-teal font-semibold': chartType === type
                                    })}
                                    onClick={() => setChartType(type)}
                                    key={type}
                                >
                                    {t(`nao:pool:chart:${type}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                    {chartLoading ? (
                        <div className="flex items-center justify-center w-full h-[304px] sm:h-[396px] mt-1 sm:mt-3">
                            <Spinner size={60} className="text-teal" />
                            {/* don't delete this block, it's hidden but force tailwind to build this class for chart tooltip */}
                            <div className="bg-gray-12 dark:bg-dark-2 p-2 mb:p-3 rounded-md border-none outline-none hidden">
                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-xxs mb:text-sm">12/12/2022</div>
                                <div className="text-txtPrimary dark:text-txtPrimary-dark mt-3 font-semibold text-xs mb:text-base">100,000,000 VNDC</div>
                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-right text-xxs mb:text-sm">$20.000</div>
                            </div>
                        </div>
                    ) : (
                        <ApexChartWrapper className="min-h-[304px] sm:!min-h-[396px] w-full h-full mt-1 sm:mt-3">
                            <ApexChart type="area" height="100%" series={chartData[chartType]} options={apexOptions} ref={chartRef} />
                        </ApexChartWrapper>
                    )}
                </CardNao>
                <div className="col-span-12 -mt-1 sm:-mt-3 bg-white dark:bg-darkBlue-3 text-txtSecondary dark:text-txtSecondary-dark text-xs mb:hidden py-3 px-4 rounded-md">
                    <div className="flex items-center space-x-2">
                        <BxsInfoCircle size={16} color="currentColor" />
                        <span>{t('nao:pool:mobile_chart_note')}</span>
                    </div>
                </div>
                <CardNao className="sm:!min-w-[50%] sm:!p-10 sm:min-h-[344px] !justify-start !mt-2 sm:!mt-0 col-span-12 md:col-span-6">
                    <Tooltip id="tooltip-revenue-history" />
                    <div className="flex-col flex">
                        <div className="space-x-3 flex items-center ">
                            <span className="text-base sm:text-lg font-semibold">{t('nao:pool:estimated_revenue_share', { value: '(20%)' })}</span>
                            <div data-tip={t('nao:pool:tooltip_revenue_history')} data-for="tooltip-revenue-history">
                                <QuestionMarkIcon isFilled size={20} color={'currentColor'} />
                            </div>
                        </div>
                        <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                            {t('nao:pool:equivalent')}:{' '}
                            <SubPrice
                                price={Object.values(data?.estimateUsd || {}).reduce((a, b) => a + b, 0)}
                                digitsPrice={assetConfig[22]?.assetDigit ?? 3}
                            />
                        </span>
                    </div>
                    <div className="flex items-center w-full flex-wrap space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                        <div className="w-full sm:p-0.5">
                            <PoolPriceItem
                                digitsPrice={assetConfig[447]?.assetDigit ?? 2}
                                s3Url={'/images/nao/ic_nao.png'}
                                price={data.estimate?.[447]}
                                usdPrice={data.estimateUsd?.[447]}
                                assetName={assetConfig[447]?.assetName}
                                assetSymbol={assetConfig[447]?.assetCode}
                            />
                        </div>
                        <div className="w-full sm:p-0.5">
                            <PoolPriceItem
                                digitsPrice={assetConfig[72]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_vndc.png'}
                                price={data.estimate?.[72]}
                                usdPrice={data.estimateUsd?.[72]}
                                assetName={assetConfig[72]?.assetName}
                                assetSymbol={assetConfig[72]?.assetCode}
                            />
                        </div>
                        <div className="w-full sm:p-0.5">
                            <PoolPriceItem
                                digitsPrice={assetConfig[1]?.assetDigit ?? 0}
                                s3Url={`/images/coins/64/${1}.png`}
                                price={data.estimate?.[1]}
                                usdPrice={data.estimateUsd?.[1]}
                                assetName={assetConfig[1]?.assetName}
                                assetSymbol={assetConfig[1]?.assetCode}
                            />
                        </div>
                        {data.estimate?.[86] > 0 && (
                            <div className="w-full sm:p-0.5">
                                <PoolPriceItem
                                    digitsPrice={assetConfig[86]?.assetDigit ?? 0}
                                    s3Url={'/images/nao/ic_onus.png'}
                                    price={data.estimate?.[86]}
                                    usdPrice={data.estimateUsd?.[86]}
                                    assetName={assetConfig[86]?.assetName}
                                    assetSymbol={assetConfig[86]?.assetCode}
                                />
                            </div>
                        )}
                        <div className="w-full sm:p-0.5">
                            <PoolPriceItem
                                digitsPrice={assetConfig[22]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_onus.png'}
                                price={data.estimate?.[22]}
                                usdPrice={data.estimateUsd?.[22]}
                                isUSDT
                                assetName={assetConfig[22]?.assetName}
                                assetSymbol={assetConfig[22]?.assetCode}
                            />
                        </div>
                    </div>
                </CardNao>
                <CardNao className="sm:!min-w-[50%] sm:!p-10 sm:min-h-[344px] !justify-start col-span-12 md:col-span-6">
                    <div className="flex items-center justify-between">
                        <label className="text-txtPrimary dark:text-txtPrimary-dark text-base sm:text-lg font-semibold">{t('nao:pool:revenue_history')}</label>
                        {listHitory.length > 0 && (
                            <div className="flex space-x-2">
                                <ArrowRight onClick={() => onNavigate(false)} disabled={actIdx === 0} className={classNames('rotate-180 cursor-pointer')} />
                                <ArrowRight
                                    onClick={() => onNavigate(true)}
                                    disabled={actIdx === listHitory.length - 1}
                                    className={classNames('cursor-pointer')}
                                />
                                {/* <img
                                    onClick={() => onNavigate(false)}
                                    className="cursor-pointer"
                                    src={getS3Url('/images/nao/ic_chevron.png')}
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                                <img
                                    onClick={() => onNavigate(true)}
                                    className="rotate-180 cursor-pointer"
                                    src={getS3Url('/images/nao/ic_chevron.png')}
                                    width={24}
                                    height={24}
                                    alt=""
                                /> */}
                            </div>
                        )}
                    </div>
                    <div className="pt-4 sm:pt-0">
                        {listHitory.length > 0 ? (
                            <Swiper
                                onSlideChange={({ activeIndex }) => setActIdx(activeIndex)}
                                ref={sliderRef}
                                loop={false}
                                lazy
                                grabCursor
                                className={`mySwiper`}
                                slidesPerView={1}
                                spaceBetween={10}
                            >
                                {renderSlide()}
                            </Swiper>
                        ) : (
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <div className="hidden dark:block">
                                    <NoDataDarkIcon />
                                </div>
                                <div className="block dark:hidden">
                                    <NoDataLightIcon />
                                </div>
                                <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:pool:history_nodata')}</div>
                            </div>
                        )}
                    </div>
                </CardNao>
            </div>
        </section>
    );
};

export const ArrowRight = memo(({ className, size = 24, onClick, disabled }) => {
    return (
        <button disabled={disabled} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
                <rect width={size} height={size} rx={12} className="text-gray-11 dark:text-dark-2" fill="currentColor" />
                <g clipPath="url(#w8kj3i91ta)">
                    <path
                        d="m10 17 5-5-5-5v10z"
                        className={classNames(disabled ? 'text-txtDisabled dark:text-txtDisabled-dark' : 'text-txtPrimary dark:text-txtPrimary-dark')}
                        fill="currentColor"
                    />
                </g>
                <defs>
                    <clipPath id="w8kj3i91ta">
                        <path fill="#fff" d="M0 0h24v24H0z" />
                    </clipPath>
                </defs>
            </svg>
        </button>
    );
});

export default NaoPool;
