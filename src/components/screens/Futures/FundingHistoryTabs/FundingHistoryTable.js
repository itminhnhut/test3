import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import useWindowSize from 'hooks/useWindowSize';
import classNames from 'classnames';
import { Search, X, ChevronDown } from 'react-feather';
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
]
const limit = 10

export default function FundingHistoryTable({ currency }) {

    const { t, i18n: { language } } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width && width <= 820
    const pairConfigs = useSelector((state) => state.futures.pairConfigs)
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const [data, setData] = useState({
        dataSource: [],
        total: 0
    });
    const [activePairList, setActivePairList] = useState(false)
    const [pairPrice, setPairPrice] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        pageSize: days[0].value,
        symbol: currency === 'VNDC' ? 'BTCVNDC' : 'BTCUSDT'
    })

    const pairConfig = useMemo(() => {
        return pairConfigs.find(rs => rs.symbol === filter.symbol)
    }, [filter])

    useEffect(() => {
        if (!pairConfig) return;
        publicSocket.emit('subscribe:futures:ticker', pairConfig?.symbol);
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + pairConfig?.symbol, async (data) => {
            const _pairPrice = FuturesMarketWatch.create(data, pairConfig?.quoteAsset);
            if (pairConfig?.symbol === _pairPrice?.symbol && _pairPrice?.lastPrice > 0) {
                setPairPrice(_pairPrice)
            }
        });
        return () => {
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + pairConfig?.symbol);
        };
    }, [publicSocket, pairConfig]);

    async function getHistoryData() {
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
        setFilter({ ...filter, symbol: currency === 'VNDC' ? 'BTCVNDC' : 'BTCUSDT' })
    }, [currency])

    useEffect(() => {
        setCurrentPage(1)
        getHistoryData();
    }, [filter]);

    useEffect(() => {
        setCurrentPage(1)
    }, [isMobile])

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
            render: (data) => <span>{formatTime(data, 'yyyy-MM-dd HH:mm:ss')}</span>

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
            render: (data, item) => formatNumber(data * 100, 0, 4, true) + '%'

        },
    ];

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                ticks: { color: colors.darkBlue5 },
                display: true,
                title: {
                    display: true,
                    text: '% Funding Rate',
                    color: colors.darkBlue5,
                },
                grid: {
                    display: false,
                }
            },
            x: {
                ticks: { color: colors.darkBlue5 },
                grid: {
                    display: false
                }
            }

        },
        layout: {
            autoPadding: true
        }

    };

    const labels = data.dataSource.map(item => formatTime(item.calcTime, 'MM-dd HH:mm'));

    const dataLine = {
        labels,
        datasets: [
            {
                label: 'Funding Fee',
                data: data.dataSource.map(item => item.lastFundingRate * 100),
                borderColor: '#00C8BC',
                // backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: false,
                tension: 0.4
            },
        ],
    };

    const onChangeSymbol = (pair) => {
        setFilter({ ...filter, symbol: pair?.baseAsset + pair?.quoteAsset })
        setActivePairList(false)
    }

    const totalPage = useMemo(() => {
        return Math.ceil(data.dataSource.length / limit)
    }, [data])

    return (
        <div className={`rounded-[20px] shadow-funding dark:bg-[#071026] p-4 lg:p-12 pt-8 sm:pt-12 `}>
            <div className='h-full flex items-center justify-between mb-6'>
                <div
                    className='group relative cursor-pointer'
                    onMouseOver={() => setActivePairList(true)}
                    onMouseLeave={() => setActivePairList(false)}
                >
                    <div className='relative z-10 flex items-center font-bold text-lg leading-6'>
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
                    <div className='relative z-10 font-medium flex space-x-1'>
                        <span className="text-onus-grey">{t('futures:funding_rate')}:</span>
                        <span>{pairPrice?.fundingRate ? formatNumber(pairPrice?.fundingRate * 100, 4, 0, true) : 0}%</span>
                    </div>
                    <div
                        className='hidden group-hover:block absolute z-30 pt-4 left-0 top-full'
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
                        <div onClick={() => setFilter({ ...filter, pageSize: day.value })}
                            className={`px-4 py-[6px] font-medium text-xs cursor-pointer ${filter.pageSize === day.value ? 'text-teal rounded-md bg-teal-opacitier' : 'text-darkBlue-5'}`}>{day[language]}</div>
                    ))}
                </div>
            </div>
            <>
                <div className='w-full mb-12'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center w-fit h-fit gap-4'>
                            {/* {renderChartTabs(section9TimeTabs, 'time', section9Config, setSection9Config)} */}
                        </div>
                    </div>
                    <div className='flex w-full items-center justify-center'>
                        <Line options={options} data={dataLine} height='330' />
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
                                            <div className="text-sm mt-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="dark:text-darkBlue-5">{t('futures:funding_history_tab:funding_range')}</div>
                                                    <div>{item?.fundingIntervalHours} {t('common:hours')}</div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="dark:text-darkBlue-5">{t('futures:funding_rate')}</div>
                                                    <div>{formatNumber(item?.lastFundingRate * 100, 0, 4, true) + '%'}</div>
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

const PairList = memo(({ activePairList, pairConfigs, onChangeSymbol, currency }) => {
    const { t } = useTranslation()
    const [keyword, setKeyWord] = useState('')

    const renderPairListItems = useCallback(() => {
        let data = pairConfigs.filter(pair => pair.quoteAsset === currency)
        if (keyword) {
            data = data?.filter((o) =>
                o?.pair?.toLowerCase().includes(keyword?.toLowerCase())
            )
        }
        return data?.map((pair, indx) => {
            return (
                <div onClick={() => onChangeSymbol(pair)} key={indx} className={`text-sm font-medium flex items-center ${indx == 0 ? 'pb-3' : 'py-3'}`}>
                    <div>{pair?.baseAsset}</div>
                    <div className="text-gray-1">/{pair?.quoteAsset}</div>
                </div>
            )
        })
    }, [pairConfigs, keyword, currency])

    return (
        <div className={`${!activePairList ? 'hidden' : ''} py-4 min-w-[358px] bg-bgPrimary dark:bg-bgPrimary-dark dark:border dark:border-darkBlue-4 drop-shadow-onlyLight rounded-md`}>
            <div className='max-h-[300px] flex flex-col'>
                <div className='px-3 mb-6'>
                    <div className='px-2 py-1.5 rounded-md flex items-center bg-gray-5 dark:bg-darkBlue-3'>
                        <Search
                            size={16}
                            strokeWidth={1.2}
                            className='text-txtBtnSecondary dark:text-txtSecondary-dark'
                        />
                        <input
                            value={keyword}
                            onChange={(e) => setKeyWord(e.target?.value.trim())}
                            placeholder={t('futures:funding_history_tab:find_pair')}
                            className='mx-2.5 text-xs flex-grow'
                        />
                        {keyword && (
                            <div className='px-1'>
                                <X
                                    size={16}
                                    strokeWidth={1.2}
                                    onClick={() => setKeyWord('')}
                                    className='text-txtBtnSecondary dark:text-txtSecondary-dark'
                                />
                            </div>
                        )}
                    </div>
                </div>


                <div className='flex-grow overflow-y-auto w-full px-3 divide-y divide-divider dark:divide-darkBlue-3'>
                    {renderPairListItems()}
                </div>
            </div>
        </div>
    )
})
