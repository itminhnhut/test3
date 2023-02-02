import React, { memo, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatTime, formatFundingRate } from 'redux/actions/utils';
import useWindowSize from 'hooks/useWindowSize';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import FetchApi from 'utils/fetch-api';
import { API_GET_FUNDING_RATE_HISTORY } from 'redux/actions/apis';
import colors from 'styles/colors';
import TableNoData from 'components/common/table.old/TableNoData';
import reverse from 'lodash/reverse';
import { useRouter } from 'next/router';
import ChevronDown from 'components/svg/ChevronDown';
import TableV2 from 'components/common/V2/TableV2';
import SearchInput from 'src/components/markets/SearchInput';
import AssetLogo from 'components/wallet/AssetLogo';
import PopoverV2 from 'components/common/V2/PopoverV2';
import sortBy from 'lodash/sortBy';
import NoData from 'components/common/V2/TableV2/NoData';

ChartJS.register(Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler);

export const CURRENCIES = [
    {
        name: 'VNDC',
        value: 'VNDC'
    },
    {
        name: 'USDT',
        value: 'USDT'
    }
];

const sortAscending = (arr, key) =>
    arr.sort(function (a, b) {
        return a[key] - b[key];
    });
const sortDescending = (arr, key) =>
    arr.sort(function (a, b) {
        return b[key] - a[key];
    });

const FILTER_OPTS = [
    {
        label: 'futures:funding_history_tab:opt_default',
        index: 0,
        keySort: 'symbol',
        sort: (arr, key) => arr
    },
    {
        label: 'futures:funding_history_tab:opt_contract_a_z',
        index: 1,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_contract_z_a',
        index: 2,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_rate_inc',
        index: 3,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_rate_desc',
        index: 4,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    }
];

const days = [
    {
        id: '7days',
        en: '7 days',
        vi: '7 ngày',
        value: 21
    },
    {
        id: '30days',
        en: '30 days',
        vi: '30 ngày',
        value: 90
    }
];
const limit = 10;

export default function FundingHistoryTable({ currency, active }) {
    const router = useRouter();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width && width <= 820;
    const pairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [data, setData] = useState({
        dataSource: [],
        total: 0
    });
    const chart = useRef(null);
    const [loading, setLoading] = useState(true);
    const [activePairList, setActivePairList] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        pageSize: days[0].value,
        symbol: null
    });

    const [flag, setFlag] = useState(false);

    const pairConfig = useMemo(() => {
        return pairConfigs.find((rs) => rs.symbol === filter.symbol);
    }, [filter, pairConfigs]);

    const getHistoryData = async () => {
        if (!filter.symbol) return;
        setLoading(true);
        try {
            const { data } = await FetchApi({
                url: API_GET_FUNDING_RATE_HISTORY,
                options: { method: 'GET' },
                params: filter
            });
            if (data) {
                setData({
                    dataSource: data?.fundingHistories || [],
                    total: data?.total || 0
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let symbol = urlParams.get('symbol');
        if (!symbol?.includes(currency)) {
            symbol = currency === 'VNDC' ? 'BTCVNDC' : 'BTCUSDT';
        }
        const url = `/${router.locale}/futures/funding-history?symbol=${symbol}`;
        window.history.pushState(null, null, url);
        setFilter({ ...filter, symbol: symbol });
    }, [currency, router]);

    useEffect(() => {
        setCurrentPage(1);
        getHistoryData();
    }, [filter]);

    useEffect(() => {
        setCurrentPage(1);
        if (active) {
            setFlag(true);
        }
    }, [isMobile, active]);

    const columns = [
        {
            key: 'calcTime',
            dataIndex: 'calcTime',
            title: t('common:time'),
            align: 'left',
            width: '40%',
            sorter: false,
            fixed: width >= 992 ? 'none' : 'left',
            render: (data) => <span>{formatTime(data, 'yyyy-MM-dd HH:mm:ss')}</span>
        },
        {
            key: 'fundingIntervalHours',
            dataIndex: 'fundingIntervalHours',
            title: t('futures:funding_history_tab:funding_range'),
            align: 'left',
            width: '20%',
            sorter: false,
            render: (data, item) => `${data} ${t('common:hours')}`
        },
        {
            key: 'lastFundingRate',
            dataIndex: 'lastFundingRate',
            title: t('futures:funding_rate'),
            align: 'right',
            width: '20%',
            sorter: false,
            render: (data, item) => formatFundingRate(data * 100)
        }
    ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: colors.hover.dark,
                displayColors: false,
                callbacks: {
                    title: function (tooltipItem, data) {
                        return formatTime(+tooltipItem[0]?.label, 'yyyy-MM-dd HH:mm:ss');
                    },
                    labelTextColor: function () {
                        return colors.teal;
                    },
                    label: function (context) {
                        return formatNumber(context.raw, 0, 6, true) + '%';
                    }
                }
            }
        },
        pointBackgroundColor: colors.teal,
        pointBorderColor: '#001219',
        pointBorderWidth: isMobile ? 1.5 : 2,
        elements: {
            point: {
                radius: isMobile ? 2 : 5
            }
        },
        scales: {
            y: {
                ticks: {
                    color: colors.darkBlue5,
                    font: {
                        size: isMobile ? 10 : 12
                    },
                    callback: (value, index, values) => {
                        return (value > 0 ? '' : '-') + Math.abs(value).toFixed(6) + '%';
                    }
                },
                display: true,
                grid: {
                    borderColor: colors.divider.dark,
                    color: colors.divider.dark,
                    borderDash: [1, 0, 1],
                    drawBorder: true,
                    display: true
                }
            },
            x: {
                ticks: {
                    color: colors.darkBlue5,
                    font: {
                        size: isMobile ? 10 : 12
                    },
                    callback: function (val, index, ticks) {
                        const label = this.getLabelForValue(val);
                        if (!label) return '';
                        return index % 3 === 0 ? formatTime(label, 'dd/MM') : '';
                    }
                },
                grid: {
                    borderColor: colors.divider.dark,
                    drawBorder: true,
                    display: false
                }
            }
        },
        layout: {
            autoPadding: true
        }
    };

    const createGradient = (ctx, area) => {
        const colorStart = '#47cc8526';
        const colorEnd = '#ffffff00';
        const gradient = ctx?.createLinearGradient(0, area.top, 0, area.bottom);
        gradient?.addColorStop(0, colorStart);
        gradient?.addColorStop(1, colorEnd);
        return gradient;
    };

    const dataLine = useMemo(() => {
        let dataReverse = [...data.dataSource];
        reverse(dataReverse);
        const labels = dataReverse.map((item) => item.calcTime);
        return {
            labels,
            datasets: [
                {
                    backgroundColor: createGradient(chart.current?.ctx, chart.current?.chartArea),
                    data: dataReverse.map((item) => item.lastFundingRate * 100),
                    borderColor: colors.teal,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        };
    }, [data]);

    const onChangeSymbol = (pair) => {
        const symbol = pair?.baseAsset + pair?.quoteAsset;
        const url = `/${router.locale}/futures/funding-history?symbol=${symbol}`;
        window.history.pushState(null, null, url);
        setFilter({ ...filter, symbol: symbol });
        setActivePairList(false);
    };

    const totalPage = useMemo(() => {
        return Math.ceil(data.dataSource.length / limit);
    }, [data]);

    const fundingRate = useMemo(() => {
        return data.dataSource.length > 0 ? data.dataSource[0].lastFundingRate : 0;
    }, [data]);

    return (
        <div className={classNames('mt-6 sm:mt-12', { hidden: !active })}>
            <div className="bg-darkBlue-3 p-4 sm:p-8 rounded-xl mb-12">
                <div className="h-full flex items-center justify-between mb-8">
                    <div className="sm:flex items-center relative cursor-pointer sm:space-x-8">
                        <div
                            className="relative z-10 flex items-center text-lg leading-6 "
                            onMouseOver={() => setActivePairList(true)}
                            onMouseLeave={() => setActivePairList(false)}
                        >
                            <span className="font-semibold sm:font-medium text-sm sm:text-xl">
                                {pairConfig?.baseAsset ? pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset : '-/-'}
                            </span>
                            <ChevronDown color={colors.darkBlue5} size={16} className={classNames('ml-2', { 'rotate-0': activePairList })} />
                            <div className="absolute z-30 pt-8 sm:pt-4 left-0 top-full">
                                <PairList
                                    activePairList={activePairList}
                                    pairConfigs={pairConfigs}
                                    onChangeSymbol={onChangeSymbol}
                                    symbol={filter}
                                    currency={currency}
                                />
                            </div>
                        </div>
                        <div className="relative z-10 flex space-x-1 mt-2 sm:mt-0 text-xs sm:text-base">
                            <span className="text-txtSecondary-dark">{t('futures:funding_rate')}:</span>
                            <span className="text-teal font-semibold">{formatFundingRate(fundingRate * 100)}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isMobile ? (
                            <FilterChart value={filter.pageSize} onChange={(day) => setFilter({ ...filter, pageSize: day.value })} />
                        ) : (
                            days.map((day) => (
                                <div
                                    key={day.id}
                                    onClick={() => setFilter({ ...filter, pageSize: day.value })}
                                    className={classNames('text-txtSecondary-dark px-4 py-3 border border-divider-dark rounded-full cursor-pointer', {
                                        '!border-teal !text-teal font-medium bg-teal/[0.1]': filter.pageSize === day.value
                                    })}
                                >
                                    {day[language]}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="flex w-full items-center justify-center ">
                    {flag && (
                        <Line
                            ref={chart}
                            options={options}
                            data={dataLine}
                            className={isMobile ? `max-h-[228px]` : `max-h-[420px]`}
                            height={isMobile ? 228 : 420}
                        />
                    )}
                </div>
            </div>
            <>
                <div className="sm:text-xl sm:leading-7 text-txtPrimary dark:text-txtPrimary-dark font-semibold mb-8">
                    {t('futures:funding_history_tab:funding_history')}
                </div>
                {!isMobile ? (
                    <div className="w-full">
                        <TableV2
                            useRowHover
                            data={data.dataSource}
                            columns={columns}
                            rowKey={(item) => `${item?.key}`}
                            loading={loading}
                            limit={10}
                            skip={0}
                            page={currentPage}
                            onChangePage={setCurrentPage}
                            pagingClassName="border-none"
                            className="border border-divider-dark rounded-xl"
                        />
                    </div>
                ) : (
                    <div className="w-full mt-8">
                        {data.dataSource.length > 0 ? (
                            <>
                                <div className="divide-y divide-divider dark:divide-divider-dark">
                                    {data.dataSource.map((item, index) => {
                                        const hidden = index + 1 > currentPage * limit;
                                        return (
                                            <div key={index} className={classNames(`${index === 0 ? 'pb-8' : 'py-8'}`, { hidden: hidden })}>
                                                <div className="font-semibold">{formatTime(item?.calcTime, 'yyyy/MM/dd  HH:mm:ss')}</div>
                                                <div className="text-sm mt-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="dark:text-txtSecondary-dark">{t('futures:funding_history_tab:funding_range')}</div>
                                                        <div>
                                                            {item?.fundingIntervalHours} {t('common:hours')}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="dark:text-txtSecondary-dark">{t('futures:funding_rate')}</div>
                                                        <div>{formatFundingRate(item?.lastFundingRate * 100)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {totalPage > currentPage && (
                                    <div
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="text-teal text-sm font-semibold text-center cursor-pointer mt-2"
                                    >
                                        {t('futures:load_more')}
                                    </div>
                                )}
                            </>
                        ) : (
                            <TableNoData title={t('common:no_data')} />
                        )}
                    </div>
                )}
            </>
        </div>
    );
}

const PairList = memo(({ activePairList, pairConfigs, onChangeSymbol, currency, symbol }) => {
    const { t } = useTranslation();
    const [keyword, setKeyWord] = useState('');

    const renderPairListItems = useCallback(() => {
        let data = pairConfigs.filter((pair) => pair.quoteAsset === currency);
        data = sortBy(data, ['pair'], ['asc']);
        if (keyword) {
            data = data?.filter((o) => o?.pair?.toLowerCase().includes(keyword?.toLowerCase()));
        }
        if (data.length <= 0) return <NoData isSearch />;
        return data?.map((pair, indx) => {
            return (
                <div
                    onClick={() => onChangeSymbol(pair)}
                    key={indx}
                    className={classNames('flex items-center justify-between px-4 py-2 sm:py-3 hover:bg-hover-dark')}
                >
                    <div className="space-x-2 flex items-center text-sm sm:text-base">
                        <AssetLogo assetId={pair?.baseAssetId} size={24} />
                        <div>
                            <span>{pair?.baseAsset}</span>
                            <span className="text-gray-1">/{pair?.quoteAsset}</span>
                        </div>
                    </div>
                    {symbol?.symbol === pair?.baseAsset + pair?.quoteAsset && <CheckedIcon />}
                </div>
            );
        });
    }, [pairConfigs, keyword, currency, symbol]);

    return (
        <div
            className={classNames(
                'py-4 min-w-[326px] sm:min-w-[400px] bg-bgPrimary dark:bg-darkBlue-3 dark:border dark:border-divider-dark shadow-popover rounded-md',
                {
                    hidden: !activePairList
                }
            )}
        >
            <div className="max-h-[300px] sm:max-h-[436px] flex flex-col">
                <div className="px-3 mb-6">
                    <SearchInput placeholder={t('futures:funding_history_tab:find_pair')} parentState={setKeyWord} />
                </div>

                <div className="flex-grow overflow-y-auto w-full space-y-3 divide-y divide-divider dark:divide-darkBlue-3">{renderPairListItems()}</div>
            </div>
        </div>
    );
});

const CheckedIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 1.333A6.674 6.674 0 0 0 1.333 8 6.674 6.674 0 0 0 8 14.667 6.674 6.674 0 0 0 14.667 8 6.674 6.674 0 0 0 8 1.333zm-1.333 9.609-2.475-2.47.941-.944 1.533 1.53 3.53-3.53.942.943-4.47 4.47z"
            fill="#E2E8F0"
        />
    </svg>
);

const FilterChart = ({ value, onChange }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const popover = useRef(null);

    const handleChangeFilter = (item) => {
        if (onChange) onChange(item);
        popover.current?.close();
    };

    const label = days.find((rs) => rs.value === value);

    return (
        <PopoverV2
            ref={popover}
            label={
                <div className="h-8 px-4 py-3 bg-dark-2 rounded-md flex items-center justify-between space-x-2 w-[100px]">
                    <p className="text-xs truncate">{label[language]}</p>
                    <ChevronDown size={16} />
                </div>
            }
            className="w-full py-2 text-xs !mt-2 z-20"
        >
            <div className="flex flex-col">
                {days.map((item) => (
                    <div
                        key={item.value}
                        onClick={() => {
                            handleChangeFilter(item);
                            close();
                        }}
                        className={classNames('cursor-pointer px-4 py-2 text-txtSecondary-dark hover:bg-hover-dark', {
                            '!text-white': value === item.value
                        })}
                    >
                        {item[language]}
                    </div>
                ))}
            </div>
        </PopoverV2>
    );
};
