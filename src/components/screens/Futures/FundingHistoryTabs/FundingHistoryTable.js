import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatTime, formatFundingRate } from 'redux/actions/utils';
import useWindowSize from 'hooks/useWindowSize';
import classNames from 'classnames';
import { ChevronDown, Search, X } from 'react-feather';
import { useSelector } from 'react-redux';
import ReTable from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import FetchApi from 'utils/fetch-api';
import { API_GET_FUNDING_RATE_HISTORY } from 'redux/actions/apis';
import colors from 'styles/colors';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import TableNoData from 'components/common/table.old/TableNoData';
import reverse from 'lodash/reverse'
import { useRouter } from 'next/router'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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

export default function FundingHistoryTable({ currency }) {
    const router = useRouter()
    const { t, i18n: { language } } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width && width <= 820;
    const pairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [data, setData] = useState({
        dataSource: [],
        total: 0
    });
    const [activePairList, setActivePairList] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        pageSize: days[0].value,
        symbol: null
    })

    const pairConfig = useMemo(() => {
        return pairConfigs.find(rs => rs.symbol === filter.symbol);
    }, [filter]);


    async function getHistoryData() {
        if (!filter.symbol) return
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
        }
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let symbol = urlParams.get('symbol')
        if (!symbol?.includes(currency)) {
            symbol = currency === 'VNDC' ? 'BTCVNDC' : 'BTCUSDT'
        }
        const url = `/${router.locale}/futures/funding-history?symbol=${symbol}`;
        window.history.pushState(null, null, url);
        setFilter({ ...filter, symbol: symbol })
    }, [currency, router])

    useEffect(() => {
        setCurrentPage(1);
        getHistoryData();
    }, [filter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [isMobile]);

    const renderPagination = useCallback(() => {
        if (data.dataSource?.length === 0) return null;
        return (
            <div className="flex items-center justify-center mt-10 mb-20">
                <RePagination
                    total={data.dataSource?.length}
                    current={currentPage}
                    pageSize={limit}
                    onChange={(page) => setCurrentPage(page)}
                    name="market_table___list"
                />
            </div>
        );
    }, [data, filter, currentPage]);

    const columns = [

        {
            key: 'calcTime',
            dataIndex: 'calcTime',
            title: t('common:time'),
            align: 'left',
            width: 100,
            sorter: false,
            fixed: width >= 992 ? 'none' : 'left',
            render: (data) => <span>{formatTime(data, 'yyyy/MM/dd HH:mm:ss')}</span>

        },
        {
            key: 'fundingIntervalHours',
            dataIndex: 'fundingIntervalHours',
            title: t('futures:funding_history_tab:funding_range'),
            align: 'right',
            width: 120,
            sorter: false,
            render: (data, item) => `${data} ${t('common:hours')}`
        },
        {
            key: 'lastFundingRate',
            dataIndex: 'lastFundingRate',
            title: t('futures:funding_rate'),
            align: 'right',
            width: 120,
            sorter: false,
            render: (data, item) => formatFundingRate(data * 100)

        },
    ];

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return [formatNumber(context.raw, 0, 6, true) + '%']
                    },
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'nearest',
            axis: 'x',
        },
        scales: {
            y: {
                ticks: {
                    color: colors.darkBlue5,
                    callback: (value, index, values) => {
                        return (value > 0 ? '' : '-') + (Math.abs(value)).toFixed(6) + '%'
                    }
                },
                display: true,
                grid: {
                    display: false,
                }
            },
            x: {
                ticks: {
                    color: colors.darkBlue5,
                    callback: function (val, index) {
                        return index % 3 === 0 ? this.getLabelForValue(val) : '';
                    },
                },
                grid: {
                    display: false
                }
            }

        },
        layout: {
            autoPadding: true
        }

    };

    let dataReverse = [...data.dataSource]
    reverse(dataReverse)
    const labels = dataReverse.map(item => formatTime(item.calcTime, 'dd/MM'));
    const dataLine = {
        labels,
        datasets: [
            {
                label: t('futures:funding_rate'),
                data: dataReverse.map(item => item.lastFundingRate * 100),
                borderColor: '#00C8BC',
                fill: false,
                tension: 0.4
            },
        ],
    };

    const onChangeSymbol = (pair) => {
        const symbol = pair?.baseAsset + pair?.quoteAsset
        const url = `/${router.locale}/futures/funding-history?symbol=${symbol}`;
        window.history.pushState(null, null, url);
        setFilter({ ...filter, symbol: symbol })
        setActivePairList(false)
    }

    const totalPage = useMemo(() => {
        return Math.ceil(data.dataSource.length / limit);
    }, [data]);

    const fundingRate = useMemo(() => {
        return data.dataSource.length > 0 ? data.dataSource[0].lastFundingRate : 0
    }, [data])

    return (
        <div className={`dark:bg-[#071026] p-4 lg:p-12 pt-0`}>
            <div className='h-full flex items-center justify-between mb-6'>
                <div
                    className="group relative cursor-pointer"
                    onMouseOver={() => setActivePairList(true)}
                    onMouseLeave={() => setActivePairList(false)}
                >
                    <div className="relative z-10 flex items-center font-bold text-lg leading-6">
                        {pairConfig?.baseAsset ? pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset : '-/-'}
                        <ChevronDown
                            color={colors.darkBlue5}
                            size={16}
                            className={classNames(
                                ' ml-2 transition-transform duration-75',
                                { 'rotate-180': activePairList }
                            )}
                        />
                    </div>
                    <div className="relative z-10 font-medium flex space-x-1">
                        <span className="text-onus-grey">{t('futures:funding_rate')}:</span>
                        <span>{formatFundingRate(fundingRate * 100)}</span>
                    </div>
                    <div
                        className="hidden group-hover:block absolute z-30 pt-4 left-0 top-full"
                    >
                        <PairList
                            activePairList={activePairList}
                            pairConfigs={pairConfigs}
                            onChangeSymbol={onChangeSymbol}
                            symbol={filter}
                            currency={currency}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {days.map(day => (
                        <div key={day.id} onClick={() => setFilter({ ...filter, pageSize: day.value })}
                            className={`px-4 py-[6px] font-medium text-xs cursor-pointer ${filter.pageSize === day.value ? 'text-teal rounded-md bg-teal-opacitier' : 'text-darkBlue-5'}`}>{day[language]}</div>
                    ))}
                </div>
            </div>
            <>
                <div className="w-full mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center w-fit h-fit gap-4">
                            {/* {renderChartTabs(section9TimeTabs, 'time', section9Config, setSection9Config)} */}
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-center">
                        <Line options={options} data={dataLine} height="330" />
                    </div>
                </div>
                {!isMobile ? <>
                    <div className="w-full">
                        <div className="text-[28px] text-txtPrimary dark:text-txtPrimary-dark font-semibold mb-6">
                            {t('futures:funding_history_tab:funding_history')}
                        </div>
                        <ReTable
                            // defaultSort={{ key: 'btc_value', direction: 'desc' }}
                            className="funding-table"
                            useRowHover
                            data={data.dataSource || []}
                            columns={columns}
                            rowKey={(item) => item?.key}
                            loading={!data.dataSource.length}
                            scroll={{ x: true }}
                            // tableStatus={}
                            tableStyle={{
                                paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                                // tableStyle: { minWidth: '1300px !important' },
                                headerStyle: {},
                                rowStyle: {},
                                shadowWithFixedCol: width < 1366,
                                noDataStyle: {
                                    minHeight: '480px'
                                }
                            }}
                            paginationProps={{
                                hide: true,
                                current: currentPage,
                                pageSize: limit,
                                onChange: (currentPage) => setCurrentPage(currentPage)
                            }}
                        />
                    </div>
                    {renderPagination()}
                </>
                    :
                    <div className="w-full mt-8">
                        {data.dataSource.length > 0 ? <>
                            <div className="divide-y divide-divider dark:divide-darkBlue-3">
                                {data.dataSource.map((item, index) => {
                                    const hidden = index + 1 > currentPage * limit
                                    return (
                                        <div key={index} className={classNames(`${index === 0 ? 'pb-6' : 'py-6'}`, { 'hidden': hidden })}>
                                            <div className="font-semibold">{formatTime(item?.calcTime, 'yyyy/MM/dd  HH:mm:ss')}</div>
                                            <div className="text-sm mt-2 font-medium">
                                                <div className="flex items-center justify-between">
                                                    <div className="dark:text-darkBlue-5">{t('futures:funding_history_tab:funding_range')}</div>
                                                    <div>{item?.fundingIntervalHours} {t('common:hours')}</div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="dark:text-darkBlue-5">{t('futures:funding_rate')}</div>
                                                    <div>{formatFundingRate(item?.lastFundingRate * 100)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {totalPage > currentPage && <div onClick={() => setCurrentPage(currentPage + 1)} className="text-teal text-sm font-medium underline text-center cursor-pointer">{t('futures:load_more')}</div>}
                        </>
                            :
                            <TableNoData title={t('common:no_data')} />
                        }

                    </div>
                }
            </>
        </div>
    );
}

const PairList = memo(({
    activePairList,
    pairConfigs,
    onChangeSymbol,
    currency
}) => {
    const { t } = useTranslation();
    const [keyword, setKeyWord] = useState('');

    const renderPairListItems = useCallback(() => {
        let data = pairConfigs.filter(pair => pair.quoteAsset === currency);
        if (keyword) {
            data = data?.filter((o) =>
                o?.pair?.toLowerCase()
                    .includes(keyword?.toLowerCase())
            );
        }
        return data?.map((pair, indx) => {
            return (
                <div onClick={() => onChangeSymbol(pair)} key={indx}
                    className={`text-sm font-medium flex items-center ${indx == 0 ? 'pb-3' : 'py-3'}`}>
                    <div>{pair?.baseAsset}</div>
                    <div className="text-gray-1">/{pair?.quoteAsset}</div>
                </div>
            );
        });
    }, [pairConfigs, keyword, currency]);

    return (
        <div
            className={`${!activePairList ? 'hidden' : ''} py-4 min-w-[358px] bg-bgPrimary dark:bg-bgPrimary-dark dark:border dark:border-darkBlue-4 drop-shadow-onlyLight rounded-md`}>
            <div className="max-h-[300px] flex flex-col">
                <div className="px-3 mb-6">
                    <div className="px-2 py-1.5 rounded-md flex items-center bg-gray-5 dark:bg-darkBlue-3">
                        <Search
                            size={16}
                            strokeWidth={1.2}
                            className="text-txtBtnSecondary dark:text-txtSecondary-dark"
                        />
                        <input
                            value={keyword}
                            onChange={(e) => setKeyWord(e.target?.value.trim())}
                            placeholder={t('futures:funding_history_tab:find_pair')}
                            className="mx-2.5 text-xs flex-grow"
                        />
                        {keyword && (
                            <div className="px-1">
                                <X
                                    size={16}
                                    strokeWidth={1.2}
                                    onClick={() => setKeyWord('')}
                                    className="text-txtBtnSecondary dark:text-txtSecondary-dark"
                                />
                            </div>
                        )}
                    </div>
                </div>


                <div className="flex-grow overflow-y-auto w-full px-3 divide-y divide-divider dark:divide-darkBlue-3">
                    {renderPairListItems()}
                </div>
            </div>
        </div>
    );
});
