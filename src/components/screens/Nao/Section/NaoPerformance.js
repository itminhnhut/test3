import React, { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { ButtonNao, CardNao, TextLiner } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import fetchApi from 'utils/fetch-api';
import { API_GET_REFERENCE_CURRENCY, API_NAO_DASHBOARD_STATISTIC, API_NAO_DASHBOARD_STATISTIC_CHART } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { formatNanNumber, formatNumber, formatPrice, formatTime } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import colors from 'styles/colors';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import { useRouter } from 'next/router';
import useWindowSize from 'hooks/useWindowSize';
import { ArrowDropDownIcon, BxsInfoCircle } from 'components/svg/SvgIcon';
import CheckCircle from 'components/svg/CheckCircle';
// import NaoChartJS from '../Components/Charts/NaoChartJS';
import { Spinner } from 'components/common/Icons';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import RangePopover from '../Components/RangePopover';
import { formatAbbreviateNumber } from 'redux/actions/utils';
import { useIsomorphicLayoutEffect } from 'react-use';
import dynamic from 'next/dynamic';
import { format, parse } from 'date-fns';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChartWrapper = styled.div`
    .apexcharts-tooltip {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
    }
`;

export const days = [
    {
        en: 'Yesterday',
        vi: 'Hôm qua',
        value: '-d'
    },
    {
        en: 'Today',
        vi: 'Hôm nay',
        value: 'd'
    },
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

const filterFeeAsset = [
    {
        id: WalletCurrency.NA0 ?? 447,
        label: 'NAO',
        ratio: '0.036'
    },
    {
        id: WalletCurrency.NAMI,
        label: 'NAMI',
        ratio: '0.045'
    },
    {
        id: WalletCurrency.ONUS,
        label: 'ONUS',
        ratio: '0.045'
    },
    {
        id: WalletCurrency.VNDC,
        label: 'VNDC',
        ratio: '0.06'
    },
    {
        id: WalletCurrency.USDT,
        label: 'USDT',
        ratio: '0.06'
    }
];

const CHART_TYPES = {
    order: 'order',
    volume: 'volume',
    user: 'user',
    fee: 'fee'
};

const isValidRange = (range) => range && days.some(({ value }) => value === range);
function reorderSvg() {
    const inner = document.querySelector('#nao_performance .apexcharts-inner'),
        yaxis = document.querySelector('#nao_performance .apexcharts-yaxis');

    inner?.before(yaxis);
}
const defaultChartData = {
    name: 'chart_total_volume',
    data: []
};

const NaoPerformance = memo(({}) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width < 820;
    const router = useRouter();
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [chartInterval, setChartInterval] = useState('day');
    const { performanceRange } = router.query;
    const initRange = isValidRange(performanceRange) ? performanceRange : 'w';
    const [filter, setFilter] = useState({
        day: initRange,
        marginCurrency: WalletCurrency.VNDC
    });
    const [range, setRange] = useState({
        startDate: undefined,
        endDate: undefined,
        key: 'selection'
    });
    const [fee, setFee] = useState(WalletCurrency.VNDC);
    const [referencePrice, setReferencePrice] = useState({});
    const [typeChart, setTypeChart] = useState(CHART_TYPES.volume);
    const [chartLabels, setChartLabels] = useState(null);
    const [dataChartVolume, setDataChartVolume] = useState([]);
    const [dataChartOrder, setDataChartOrder] = useState([]);
    const [dataChartUser, setDataChartUser] = useState([]);
    const [dataChartFee, setDataChartFee] = useState([]);
    const [dataChartSource, setDataChartSource] = useState([defaultChartData]);

    useEffect(() => {
        getRef();
    }, []);

    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const isValidCustomDay = filter.day !== 'custom' || !!(range.startDate && range.endDate);

    useIsomorphicLayoutEffect(() => {
        const { performanceRange } = router.query;
        if (performanceRange && days.some(({ value }) => value === performanceRange)) {
            setFilter((old) => ({ ...old, day: performanceRange }));
        }
    }, [router.isReady]);

    useEffect(() => {
        getData();
        getDataChart();
    }, [filter, range]);

    useEffect(() => {
        switch (typeChart) {
            case CHART_TYPES.fee: {
                return setDataChartSource([
                    {
                        data: dataChartFee[filter.marginCurrency],
                        name: 'chart_total_fee'
                    }
                ]);
            }
            case CHART_TYPES.user: {
                return setDataChartSource([
                    {
                        data: dataChartUser,
                        name: 'chart_users'
                    }
                ]);
            }
            case CHART_TYPES.order: {
                return setDataChartSource([
                    {
                        data: dataChartOrder,
                        name: 'chart_total_orders'
                    }
                ]);
            }
            default: {
                return setDataChartSource([
                    {
                        data: dataChartVolume,
                        name: 'chart_total_volume'
                    }
                ]);
            }
        }
    }, [chartLabels, typeChart, filter.marginCurrency, dataChartFee, dataChartVolume, dataChartUser, dataChartOrder]);

    const getData = async () => {
        setLoading(true);
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC,
                options: { method: 'GET' },
                params: {
                    range: filter.day,
                    from: range?.startDate?.getTime(),
                    to: range?.endDate?.getTime(),
                    marginCurrency: filter.marginCurrency,
                    userCategory: 2
                }
            });
            setDataSource(!(data?.error || data?.status) ? data : null);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const getDataChart = async () => {
        if (!isValidCustomDay) return;
        let filterDay = filter.day;
        if (filter.day === 'd' || filter.day === '-d') {
            filterDay = 'w';
            if (dataChartSource[0]?.data?.length) return;
        }

        setChartLoading(true);
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC_CHART,
                options: { method: 'GET' },
                params: {
                    range: filterDay,
                    from: range?.startDate?.getTime(),
                    to: range?.endDate?.getTime(),
                    marginCurrency: filter.marginCurrency,
                    userCategory: 2
                }
            });
            if (!(data?.error || data?.status)) {
                setChartInterval(data.interval);
                const volumes = [];
                const trades = [];
                const fees = {
                    72: [],
                    22: [],
                    1: [],
                    447: []
                };
                const users = [];
                const labels = [];
                for (let i = 0; i < data.result.length; i++) {
                    const e = data.result[i];
                    const date = parse(e._id, 'dd/MM/yyyy', new Date());
                    volumes.push([date, e.notionalValue]);
                    trades.push([date, e.count]);
                    users.push([date, e.userCount]);
                    fees['72'].push([date, e.feeRevenueVndc]);
                    fees['22'].push([date, e.feeRevenueUsdt]);
                }
                setDataChartVolume(volumes);
                setDataChartOrder(trades);
                setDataChartFee(fees);
                setDataChartUser(users);
                setChartLabels(labels);
            }
        } catch (e) {
            console.log({ err: e.message });
        } finally {
            setChartLoading(false);
        }
    };

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: {
                    base: 'VNDC,USDT',
                    quote: 'USD'
                }
            });
            if (data) {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [`${current.base}/${current.quote}`]: current.price
                        };
                    }, {})
                );
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const assets = useMemo(() => {
        if (!dataSource?.feeRevenue) return [];
        const assets = [];
        let first = true;
        return Object.keys(dataSource?.feeRevenue).reduce((newItem, item) => {
            if (Number(item) === 86 && dataSource.feeRevenue[item] <= 0) return;
            const asset = assetConfig.find((rs) => rs.id === Number(item));
            if (asset) {
                assets.push({
                    id: asset.id,
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit,
                    value: dataSource.feeRevenue[item]
                });
            }
            return assets;
        }, []);
    }, [dataSource, assetConfig]);

    const feeFilter = useMemo(() => {
        const _fee = assets.find((rs) => rs.id === fee);
        return {
            total: _fee ? formatNumber(_fee?.value, _fee?.assetDigit) + ' ' + _fee?.assetCode : '-',
            ratio: filterFeeAsset.find((rs) => rs.id === fee)?.ratio ?? '0.06'
        };
    }, [fee, assets]);

    const handleChangeMarginCurrency = (currency) => {
        setFilter((old) => ({ ...old, marginCurrency: currency }));
        setFee(currency);
    };

    const updateDateRangeUrl = (dateValue) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    performanceRange: dateValue
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

    const apexOptions = useMemo(() => {
        return {
            chart: {
                offsetX: 0,
                offsetY: 0,
                parentHeightOffset: 0,
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
                    left: -2
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
                labels: {
                    style: {
                        colors: isDark ? colors.gray[7] : colors.gray[1]
                    },
                    formatter: (value) => {
                        return formatAbbreviateNumber(value, 3);
                    },
                    offsetX: -15,
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
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const y = series[seriesIndex][dataPointIndex];
                    const x = w.globals.seriesX[0][dataPointIndex];
                    const type = w.globals.seriesNames[0];
                    const currency = filter.marginCurrency;
                    const isUSD = currency === 22;
                    const isMonetary = type !== 'chart_users' && type !== 'chart_total_orders';
                    const titleText = t(`nao:onus_performance:${type}`);
                    let currencyText = isMonetary ? (isUSD ? 'USDT' : 'VNDC') : '';

                    const body = `${titleText}: ${formatNumber(y, isUSD ? 4 : 0)} ${currencyText}`;
                    const fiatUSD = isMonetary ? `$ ${formatNumber(y * (referencePrice[`${assetCodeFromId(currency)}/USD`] || 1 / 23400), 2)}` : '';
                    return `
                        <div class="bg-gray-15 dark:bg-dark-2 p-2 mb:p-3 rounded-md border-none outline-none">
                            <div class="text-txtSecondary dark:text-txtSecondary-dark text-xxs mb:text-sm">${x ? format(x, 'dd/MM/yyyy') : ''}</div>
                            <div class="text-white dark:text-txtPrimary-dark mt-3 font-semibold text-xs mb:text-base">${body}</div>
                            <div class="text-txtSecondary dark:text-txtSecondary-dark text-right text-xxs mb:text-sm">${fiatUSD}</div>
                        </div>
                    `;
                }
            }
        };
    }, [isDark, isMobile, referencePrice, chartInterval, typeChart, filter.marginCurrency]);

    return (
        <section id="nao_performance" className="pt-6 sm:pt-20 text-sm sm:text-base">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div className="space-y-2 flex flex-col">
                    <TextLiner className="">{t('nao:onus_performance:title')}</TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:onus_performance:description')}</span>
                </div>
                <div className="flex flex-wrap gap-2 w-full mb:w-auto justify-between mb:justify-end">
                    <RangePopover
                        language={language}
                        active={days.find((d) => d.value === filter.day)}
                        onChange={handleChangeDateRange}
                        className="flex order-last"
                        popoverClassName={'mb:mr-2 ml-auto'}
                        range={range}
                        setRange={setRange}
                        days={days}
                    />
                    <div className="order-first gap-2 flex gap-last">
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[6px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary bg-gray-12 dark:bg-dark-4',
                                { '!border-teal !bg-teal/10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.VNDC }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.VNDC)}
                        >
                            Futures VNDC
                        </button>
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[6px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary bg-gray-12 dark:bg-dark-4',
                                { '!border-teal !bg-teal/10 bg-teal bg-opacity-10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.USDT }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.USDT)}
                        >
                            Futures USDT
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-5 flex flex-col lg:flex-row sm:pt-8 gap-4 sm:gap-6">
                <div className="w-full lg:w-1/3 flex flex-col gap-y-4 sm:gap-y-6 z-[1]">
                    <CardNao className="rounded-lg !min-w-max w-full !px-8 !pt-6 !pb-7 relative" customHeight="sm:min-h-[328px]">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                            {t('nao:onus_performance:total_volume')}
                        </label>
                        <div className="pt-4">
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">
                                {dataSource ? formatNumber(dataSource?.notionalValue, 0) + ` ${assetCodeFromId(filter.marginCurrency)}` : '-'}
                            </div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                {dataSource
                                    ? '$' + formatPrice(referencePrice[`${assetCodeFromId(filter.marginCurrency)}/USD`] * dataSource?.notionalValue, 3)
                                    : '-'}{' '}
                            </span>
                        </div>

                        <hr className="border-divider dark:border-divider-dark my-5 sm:my-8" />

                        <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                            {t('nao:onus_performance:total_orders')}
                        </label>
                        <div className="pt-4">
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">
                                {dataSource ? formatNumber(dataSource?.count * 2, 0) : '-'}
                            </div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                {dataSource ? formatNumber(dataSource?.userCount, 0) + ' ' + t('nao:onus_performance:users') : '-'}
                            </span>
                        </div>
                    </CardNao>
                    <CardNao noBg className="bg-bgPrimary dark:bg-bgPrimary-dark !min-w-max !py-6 !px-8 w-full !flex-none z-0 relative" customHeight="sm:max-h-[162px]">
                        <div className="flex items-center justify-between">
                            <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                                {t('nao:onus_performance:total_fee')}
                            </label>
                            <Popover className="relative flex">
                                {({ open, close }) => (
                                    <>
                                        <Popover.Button>
                                            <div className="px-2 py-[6px] bg-gray-12 dark:bg-dark-2 rounded-md flex items-center justify-between text-gray-15 dark:text-white min-w-[72px] space-x-1 font-semibold">
                                                {filterFeeAsset.find((a) => a.id === fee)?.label || '--'}
                                                <ArrowDropDownIcon size={16} color="currentColor" className={`transition-all ${open ? 'rotate-180' : ''}`} />
                                            </div>
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className="absolute top-8 mt-3 right-0 z-15 bg-white dark:bg-dark-4 rounded-md border border-divider dark:border-divider-dark">
                                                <div className="py-[2] min-w-[72px] shadow-onlyLight text-sm flex flex-col">
                                                    {assets.map((item, index) => (
                                                        <span
                                                            onClick={() => {
                                                                setFee(item?.id);
                                                                close();
                                                            }}
                                                            key={index}
                                                            className={`px-4 py-3 cursor-pointer hover:bg-hover-1 dark:hover:bg-hover-dark flex items-center space-x-4`}
                                                        >
                                                            <span>{item?.assetCode}</span>
                                                            {item?.id === fee && <CheckCircle color="currentColor" size={16} />}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </div>
                        <div className="">
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">{feeFilter.total}</div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{feeFilter.ratio}%</span>
                        </div>
                    </CardNao>
                </div>
                <div className="w-full lg:w-2/3 h-full z-0">
                    <CardNao className="rounded-lg whitespace-nowrap min-h-[360px] !p-4 sm:!p-8" customHeight="sm:max-h-[514px]">
                        <div className="order-first">
                            {/* <TextLiner className="w-full">{t('nao:onus_performance:chart_title')}</TextLiner> */}
                            <div className="flex gap-last lg:justify-end w-full overflow-auto no-scrollbar space-x-4">
                                <button
                                    type="BUTTON"
                                    className={classNames('flex flex-col justify-center items-center text-sm sm:text-base text-txtSecondary', {
                                        '!text-teal font-semibold': typeChart === 'volume'
                                    })}
                                    onClick={() => setTypeChart('volume')}
                                >
                                    {t('nao:onus_performance:chart_total_volume')}
                                </button>
                                <button
                                    type="BUTTON"
                                    className={classNames('flex flex-col justify-center items-center text-sm sm:text-base text-txtSecondary', {
                                        '!text-teal font-semibold': typeChart === 'order'
                                    })}
                                    onClick={() => setTypeChart('order')}
                                >
                                    {t('nao:onus_performance:chart_total_orders')}
                                </button>
                                <button
                                    type="BUTTON"
                                    className={classNames('flex flex-col justify-center items-center text-sm sm:text-base text-txtSecondary', {
                                        '!text-teal font-semibold': typeChart === 'user'
                                    })}
                                    onClick={() => setTypeChart('user')}
                                >
                                    {t('nao:onus_performance:chart_users')}
                                </button>
                                <button
                                    type="BUTTON"
                                    className={classNames('flex flex-col justify-center items-center text-sm sm:text-base text-txtSecondary', {
                                        '!text-teal font-semibold': typeChart === 'fee'
                                    })}
                                    onClick={() => setTypeChart('fee')}
                                >
                                    {t('nao:onus_performance:chart_total_fee')}
                                </button>
                            </div>
                        </div>
                        {chartLoading ? (
                            <>
                                <div className="flex items-center justify-center w-full h-[304px] mb:h-[396px] mt-1 sm:mt-3">
                                    <Spinner color="currentColor" size={60} className="text-teal" />
                                </div>
                            </>
                        ) : (
                            <ApexChartWrapper className="!min-h-[304px] mb:!min-h-[396px] mt-1 sm:mt-3 w-full h-full">
                                <ApexChart type="area" height="100%" series={dataChartSource} options={apexOptions} />
                            </ApexChartWrapper>
                        )}
                    </CardNao>
                    <div className="col-span-12 mt-3 bg-white dark:bg-darkBlue-3 text-txtSecondary dark:text-txtSecondary-dark text-xs mb:hidden py-3 px-4 rounded-md">
                        <div className="flex items-center space-x-2">
                            <BxsInfoCircle size={16} color="currentColor" />
                            <span>{t('nao:pool:mobile_chart_note')}</span>
                        </div>
                    </div>
                </div>
            </div>
            {dataSource?.lastTimeUpdate && (
                <div className="text-xs sm:text-sm mt-3 sm:mt-4 text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 5 })}: {formatTime(new Date(dataSource?.lastTimeUpdate), 'HH:mm dd/MM/yyyy')}
                </div>
            )}
        </section>
    );
});

const externalTooltipHandler = (context, isDark, t, isVndc, title, volume, dataIndex, typeChart) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart, isDark);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.body) {
        // Generate header
        const tableHead = generateThead(isDark, title);

        const tableBody = document.createElement('tbody');
        const ulElement = document.createElement('ul');
        ulElement.className = 'list-disc marker:text-xs ml-5 text-base !leading-[24px]';

        // Create first <li> element
        // const liElement1 = document.createElement('li');
        // liElement1.textContent = `${t('portfolio:amount_position')}: ${curData?.doc_count} (${rate}%)`;
        // ulElement.appendChild(liElement1);

        // Create second <li> element
        // const liElement2 = document.createElement('li');
        // liElement2.textContent = `Tỷ lệ: ${rate}%`;
        // ulElement.appendChild(liElement2);

        const liElement3 = document.createElement('li');
        liElement3.textContent =
            typeChart === 'volume'
                ? `${t('nao:onus_performance:total_volume')}: `
                : typeChart === 'order'
                ? `${t('nao:onus_performance:total_orders')}: `
                : typeChart === 'user'
                ? `${t('nao:onus_performance:users')}: `
                : `${t('nao:onus_performance:total_fee')}: `;
        const spanElement = document.createElement('span');
        spanElement.className = 'red-2 font-semibold';
        spanElement.style.color = colors.green[2];
        spanElement.textContent = `${formatNanNumber(volume, isVndc ? 0 : 4)}`;
        liElement3.appendChild(spanElement);
        ulElement.appendChild(liElement3);

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;

        const td = document.createElement('td');
        td.style.borderWidth = 0;

        // const text = document.createTextNode(body);

        td.appendChild(ulElement);
        // td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);

        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY, offsetWidth: chartWidth } = chart.canvas;
    const tooltipWidth = tooltipEl.offsetWidth;
    const tooltipHeight = tooltipEl.offsetHeight;

    const datasetIndex = tooltip.dataPoints[0].datasetIndex; // Get the index of the hovered dataset
    const barEl = chart.getDatasetMeta(datasetIndex)?.data[dataIndex];
    /**
     * tooltip.caretX: tọa độ x của current bar
     * barEl.width: độ rộng của current bar
     * barEl.height: độ cao của current bar
     */

    // Trường hợp những Bar cuối sẽ bị overflow
    let tooltipCaretClassName;

    if (tooltip.caretX + tooltipWidth > chartWidth) {
        tooltipEl.style.left = positionX + barEl.x - tooltipWidth / 2 - 12 - barEl.width / 2 + 'px'; // positionX + tooltip.caretX + tooltipWidth / 2 + 'px';
        tooltipEl.style.top = positionY - tooltipHeight / 3 + barEl.height / 2 + 'px'; // positionY + tooltip.caretY / 2 + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
        tooltipEl.style.opacity = 1;
        tooltipCaretClassName = 'tooltip-caret-right';
    } else {
        tooltipEl.style.left = positionX + barEl.x + barEl.width / 2 + tooltipWidth / 2 + 12 + 'px'; // positionX + tooltip.caretX + tooltipWidth / 2 + 'px';
        tooltipEl.style.top = positionY - tooltipHeight / 3 + barEl.height / 2 + 'px'; // positionY + tooltip.caretY / 2 + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
        tooltipEl.style.opacity = 1;
        tooltipCaretClassName = 'tooltip-caret-left';
    }

    // Create caret:
    let tooltipCaretEl = tooltipEl.querySelector(`.${tooltipCaretClassName}`);
    // const x = document.createElement('div');

    if (!tooltipCaretEl) {
        tooltipCaretEl = document.createElement('div');
        // tooltipCaretEl.style.width = '20px'; // barEl.width;
        // tooltipCaretEl.style.height = '20px'; //barEl.width;
        // tooltipCaretEl.style.left = '-20px'; //barEl.width;
        tooltipCaretEl.classList.add(tooltipCaretClassName);
        tooltipEl.appendChild(tooltipCaretEl);
    }

    tooltipCaretEl.classList.add(tooltipCaretClassName);
    tooltipCaretEl.style.top = tooltipEl.offsetHeight / 2 + 'px'; // Đặt vị trí dọc của caret

    // tooltipCaretEl.style.left = caretX + 'px'; // Đặt vị trí ngang của caret
    // tooltipCaretEl.style.top = caretY + 'px'; // Đặt vị trí dọc của caret

    tooltipEl.appendChild(tooltipCaretEl);
};

const Days = styled.div.attrs({
    className: 'px-4 py-2 rounded-[6px] cursor-pointer text-txtPrimary dark:text-txtPrimary-dark text-sm bg-gray-12 dark:bg-dark-2 select-none text-center'
})`
    background: ${({ active }) => (active ? colors.teal : '')};
    font-weight: ${({ active }) => (active ? '600' : '400')};
`;

export default NaoPerformance;

const getOrCreateTooltip = (chart, isDark) => {
    const parent = chart.canvas.parentNode;
    let tooltipEl = parent.querySelector('div');

    // Remove existing tooltip element if found
    if (tooltipEl) {
        parent.removeChild(tooltipEl);
    }
    // let tooltipEl = chart.canvas.parentNode.querySelector('div');

    // if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = isDark ? colors.dark['2'] : colors.darkBlue;
    tooltipEl.style.borderRadius = '6px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';
    tooltipEl.style.width = 'auto';
    tooltipEl.style.height = '88px';

    const table = document.createElement('table');
    table.style.color = isDark ? colors.gray['4'] : '#fff';
    table.style.fontWeight = 'normal';
    table.style.fontSize = '16px';
    table.style.margin = '6px';
    // table.style.padding = '12px';
    // table.style.backgroundColor = isDark ? colors.dark['2'] : colors.gray['15']

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
    // }

    return tooltipEl;
};

const generateThead = (isDark, label) => {
    const tableHead = document.createElement('thead');
    const tr = document.createElement('tr');
    tr.style.borderWidth = 0;
    const th = document.createElement('th');
    th.style.borderWidth = 0;
    th.style.textAlign = 'left';
    th.style.color = isDark ? colors.gray['7'] : colors.gray['1'];
    th.style.fontSize = '14px';
    th.style.fontWeight = 'normal';
    th.style.paddingBottom = '12px';
    const text = document.createTextNode(label);

    th.appendChild(text);
    tr.appendChild(th);
    tableHead.appendChild(tr);
    return tableHead;
};
