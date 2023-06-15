import React, { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { ButtonNao, CardNao, TextLiner } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import fetchApi from 'utils/fetch-api';
import { API_GET_REFERENCE_CURRENCY, API_NAO_DASHBOARD_STATISTIC, API_NAO_DASHBOARD_STATISTIC_CHART } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { formatNanNumber, formatNumber, formatPrice, formatTime, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import colors from 'styles/colors';
import { Check } from 'react-feather';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import { useRouter } from 'next/router';
import useWindowSize from 'hooks/useWindowSize';
import { ArrowDropDownIcon, BxsInfoCircle } from 'components/svg/SvgIcon';
import SvgFilter from 'components/svg/SvgFilter';
import CheckCircle from 'components/svg/CheckCircle';
import CollapseV2 from 'components/common/V2/CollapseV2';
import HeaderTooltip from 'components/screens/Portfolio/HeaderTooltip';
import NaoChartJS from 'components/screens/Portfolio/charts/NaoChartJS';
import Note from 'components/common/Note';
import ModalV2 from 'components/common/V2/ModalV2';
import { indexOf, isNumber } from 'lodash';
import MCard from 'components/common/MCard';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import TableNoData from 'components/common/table.old/TableNoData';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { WIDTH_MD } from 'components/screens/Wallet';
import RangePopover from '../Components/RangePopover';
import { formatAbbreviateNumber } from 'redux/actions/utils';

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

const NaoPerformance = memo(({}) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width < WIDTH_MD;
    const router = useRouter();
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [filter, setFilter] = useState({
        day: 'd',
        marginCurrency: WalletCurrency.VNDC
    });
    const [range, setRange] = useState({
        startDate: undefined,
        endDate: undefined,
        key: 'selection'
    });
    const [fee, setFee] = useState(WalletCurrency.VNDC);
    const [referencePrice, setReferencePrice] = useState({});
    const [typeChart, setTypeChart] = useState('volume');
    const [chartLabels, setChartLabels] = useState(null);
    const [dataChartVolume, setDataChartVolume] = useState(null);
    const [dataChartOrder, setDataChartOrder] = useState(null);
    const [dataChartUser, setDataChartUser] = useState(null);
    const [dataChartFee, setDataChartFee] = useState(null);
    const [dataChartSource, setDataChartSource] = useState({
        labels: [],
        datasets: []
    });

    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const renderChart = useMemo(() => {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0.6
                }
            },
            // indexAxis: 'x',
            // linePercentage: 0.15,
            // borderRadius: 3,
            // borderSkipped: false,
            // onClick: (evt, item) => {
            //     if (!isMobile) return;
            //     setShowDetails(item[0]?.index);
            // },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    enabled: true,
                    position: 'nearest'
                    // external: (context) => {
                    //     if (!isMobile) {
                    //         const { dataIndex } = context?.chart?.tooltip?.dataPoints?.['0'] ?? 0;
                    //         const title = dataChartSource?.labels[dataIndex] ?? null;
                    //         let volume = dataChartSource?.datasets[0]?.data[dataIndex] ?? null;
                    //
                    //         externalTooltipHandler(context, isDark, t, filter.marginCurrency === 72, title, volume, dataIndex, typeChart);
                    //     }
                    // }
                }
            },
            scales: {
                x: {
                    // ticks: {
                    //     color: colors.darkBlue5,
                    //     showLabelBackdrop: false,
                    //     padding: 8,
                    //     fontSize: isMobile ? 9 : 12,
                    //     lineHeight: isMobile ? 20 : 16
                    // },
                    grid: {
                        // display: true,
                        // drawBorder: true,
                        // borderColor: isDark ? colors.divider.dark : colors.divider.DEFAULT
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        // color: colors.darkBlue5,
                        callback: function (value, index, ticks) {
                            return formatAbbreviateNumber(value, 3);
                        },
                        // crossAlign: 'far',
                        // padding: 8,
                        // fontSize: isMobile ? 9 : 12,
                        // lineHeight: isMobile ? 20 : 16
                    },
                    grid: {
                        // drawTicks: false,
                        // borderDash: [2, 4],
                        // borderDashOffset: 2,
                        // // color: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT,
                        // // borderDash: [1, 4],
                        // // // color: colors.divider.DEFAULT,
                        // color: function (context) {
                        //     if (context.tick.value === 0) {
                        //         return 'rgba(0, 0, 0, 0)';
                        //     }
                        //     return isDark ? colors.divider.dark : colors.divider.DEFAULT;
                        // },
                        // drawBorder: !!isMobile
                    }
                }
            }
        };

        return (
            <div className=" w-full max-h-[450px] mt-8">
                <NaoChartJS type="line" data={dataChartSource} options={options} height="450px" />
            </div>
        );
    }, [dataChartSource]);

    // const [getQueryByName , updateQuery] = useAddQuery('date')

    useEffect(() => {
        const { performance } = router.query;
        if (performance && days.some(({ value }) => value === performance)) {
            setFilter({
                ...filter,
                day: performance
            });
        }
    }, [router.isReady]);

    useEffect(() => {
        getRef();
    }, []);

    useEffect(() => {
        getData();
        if (filter.day !== 'd' && filter.day !== '-d') {
            getDataChart();
        }
    }, [filter]);

    useEffect(() => {
        if (typeChart === 'fee') {
            setDataChartSource({
                labels: chartLabels,
                datasets: [
                    {
                        label: 'VNDC',
                        hidden: filter.marginCurrency !== 72,
                        data: dataChartFee['72'],
                        borderColor: colors.green[6],
                        fill: 'start',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, 'rgba(71, 204, 133, 0.15)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        hoverBackgroundColor: colors.white
                    },
                    {
                        label: 'USDT',
                        hidden: filter.marginCurrency !== 22,
                        data: dataChartFee['22'],
                        borderColor: colors.red[2],
                        fill: 'start',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, 'rgba(71, 204, 133, 0.15)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        hoverBackgroundColor: colors.white
                    },
                    {
                        label: 'NAMI',
                        hidden: true,
                        data: dataChartFee['1'],
                        borderColor: colors.yellow[2],
                        fill: 'start',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, 'rgba(71, 204, 133, 0.15)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        hoverBackgroundColor: colors.white
                    },
                    {
                        label: 'NAO',
                        hidden: true,
                        data: dataChartFee['447'],
                        borderColor: colors.green[5],
                        fill: 'start',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, 'rgba(71, 204, 133, 0.15)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        hoverBackgroundColor: colors.white
                    }
                ]
            });
        } else {
            setDataChartSource({
                labels: chartLabels,
                datasets: [
                    {
                        label: typeChart === 'volume' ? 'Volume' : typeChart === 'order' ? 'Trades' : 'Users',
                        data: typeChart === 'volume' ? dataChartVolume : typeChart === 'order' ? dataChartOrder : dataChartUser,
                        borderColor: colors.green[6],
                        fill: 'start',
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                            gradient.addColorStop(0, 'rgba(71, 204, 133, 0.15)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        hoverBackgroundColor: colors.white,
                        pointBackgroundColor: colors.green[6]
                    }
                ]
            });
        }
    }, [chartLabels, typeChart]);

    const getData = async () => {
        setLoading(true);
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC,
                options: { method: 'GET' },
                params: {
                    range: filter.day,
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
        setChartLoading(true);
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC_CHART,
                options: { method: 'GET' },
                params: {
                    range: filter.day,
                    marginCurrency: filter.marginCurrency,
                    userCategory: 2
                }
            });
            if (!(data?.error || data?.status)) {
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
                for (let i = 0; i < data.length; i++) {
                    const e = data[i];
                    volumes.push(e.notionalValue);
                    trades.push(e.count);
                    users.push(e.userCount);
                    labels.push(e._id);
                    fees['72'].push(e.feeRevenue['72']);
                    fees['22'].push(e.feeRevenue['22']);
                    fees['1'].push(e.feeRevenue['1']);
                    fees['447'].push(e.feeRevenue['447']);
                }
                setDataChartVolume(volumes);
                setDataChartOrder(trades);
                setDataChartFee(fees);
                setDataChartUser(users);
                setChartLabels(labels);
            }
        } catch (e) {
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
        setFilter({
            ...filter,
            marginCurrency: currency
        });
        setFee(currency);
    };

    const updateDateRangeUrl = (dateValue) => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    performance: dateValue
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
            setFilter({
                ...filter,
                day
            });
            updateDateRangeUrl(day);
        }
    };

    return (
        <section id="nao_performance" className="pt-6 sm:pt-20 text-sm sm:text-base">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div className="space-y-2 flex flex-col">
                    <TextLiner className="">{t('nao:onus_performance:title')}</TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:onus_performance:description')}</span>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end">
                    <RangePopover
                        language={language}
                        active={days.find((d) => d.value === filter.day)}
                        onChange={handleChangeDateRange}
                        className="flex order-last"
                        popoverClassName={'lg:mr-2 '}
                        range={range}
                    />
                    <div className="order-first gap-2 flex gap-last">
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                { '!border-teal bg-teal/10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.VNDC }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.VNDC)}
                        >
                            Futures VNDC
                        </button>
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                { '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.USDT }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.USDT)}
                        >
                            Futures USDT
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-5 flex flex-col xl:flex-row sm:pt-6 gap-4 sm:gap-5">
                <div className="w-full xl:w-1/3 flex flex-col gap-y-4 sm:gap-y-5">
                    <CardNao className="rounded-lg !min-w-max w-full">
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
                    </CardNao>
                    <CardNao className="rounded-lg !min-w-max w-full">
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
                    <CardNao noBg className="bg-bgPrimary dark:bg-bgPrimary-dark !min-w-max !py-6 sm:!py-8 w-full">
                        <div className="flex items-center justify-between">
                            <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                                {t('nao:onus_performance:total_fee')}
                            </label>
                            <Popover className="relative flex">
                                {({ open, close }) => (
                                    <>
                                        <Popover.Button>
                                            <div className="px-2 py-[6px] bg-gray-12 dark:bg-dark-2 rounded-md flex items-center justify-between text-gray-15 dark:text-white min-w-[72px] space-x-1">
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
                                            <Popover.Panel className="absolute top-8 mt-3 right-0 z-5 bg-white dark:bg-dark-4 rounded-md border border-divider dark:border-divider-dark">
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
                        <div className="pt-4">
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">{feeFilter.total}</div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{feeFilter.ratio}%</span>
                        </div>
                    </CardNao>
                </div>
                <div className="w-full xl:w-2/3 h-full">
                    <CardNao className="rounded-lg whitespace-nowrap min-h-[350px]">
                        <div className="order-first gap-6 md:gap-2 gap-last grid xl:grid-cols-3">
                            <TextLiner className="w-full">{t('nao:onus_performance:chart_title')}</TextLiner>
                            <div className="flex gap-last xl:justify-end w-full overflow-auto no-scrollbar space-x-4 col-span-2">
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
                        {isMobile ? (
                            <>
                                {chartLoading ? (
                                    <>
                                        <div className="flex items-center justify-center w-full min-h-[300px] mt-6">
                                            <Spiner isDark="true" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-6">{renderChart}</div>
                                )}
                            </>
                        ) : (
                            <>
                                {chartLoading ? (
                                    <>
                                        <div className="flex items-center justify-center w-full min-h-[504px]">
                                            <Spiner isDark="true" />
                                        </div>
                                    </>
                                ) : (
                                    <div>{renderChart}</div>
                                )}
                            </>
                        )}
                    </CardNao>
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
