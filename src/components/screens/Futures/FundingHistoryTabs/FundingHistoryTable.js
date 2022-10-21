import React, { Fragment, useCallback, useEffect, useState } from 'react';
import useDarkMode from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import useWindowSize from 'hooks/useWindowSize';
import classNames from 'classnames';
import { Search, X } from 'react-feather';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ReTable from 'components/common/ReTable';
import AssetLogo from 'components/wallet/AssetLogo';
import { Popover, Transition } from '@headlessui/react';
import Divider from 'components/common/Divider';
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
        label: 'futures:funding_history:opt_default',
        index: 0,
        keySort: 'symbol',
        sort: (arr, key) => arr
    },
    {
        label: 'futures:funding_history:opt_contract_a_z',
        index: 1,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_contract_z_a',
        index: 2,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_rate_inc',
        index: 3,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_rate_desc',
        index: 4,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    }
];

export default function FundingHistoryTable(props) {
    const [currentTheme] = useDarkMode();
    const { t } = useTranslation();
    const { width } = useWindowSize();

    const marketWatch = useSelector((state) => state.futures?.marketWatch);
    const allAssetConfig = useSelector((state) => state.utils.assetConfig);
    const [dataTable, setDataTable] = useState([]);
    const [data, setData] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTS[0]);

    async function getHistoryData() {
        try {
            const res = await FetchApi({
                url: API_GET_FUNDING_RATE_HISTORY,
                options: { method: 'GET' },
                params: { symbol: 'BTCUSDT' }
            });
            if (res?.data?.fundingHistories) {
                setData(res?.data?.fundingHistories);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getHistoryData();
    }, []);

    useEffect(() => {
        if (!marketWatch || !allAssetConfig) return;
        const res = Object.entries(marketWatch)
            .map(([value, data]) => {
                const config = allAssetConfig?.find((item) => item.baseAsset === value.assetCode);
                return {
                    asset: (
                        <div className="flex items-center">
                            <AssetLogo assetCode={config?.assetCode} size={32}/>
                            <div className="ml-2 text-sm">
                                <div className="font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                    {data?.baseAsset + '/' + data?.quoteAsset}
                                </div>
                            </div>
                        </div>
                    ),
                    symbol: data?.baseAsset,
                    key: value,
                    fundingRate: data.fundingRate,
                    fundingTime: data.fundingTime
                };
            });
        const sorted = selectedFilter.sort(res, selectedFilter.keySort);
        setDataTable(sorted);
    }, [marketWatch, selectedFilter]);

    // const allPairConfig =

    const handleChangeFilter = (item) => {
        setSelectedFilter(item);
        setCurrentPage(1);
    };

    const renderSearch = () => {
        return (
            <div className="flex justify-between mb-[40px]">
                <div className="flex gap-6">
                    <div
                        className="flex items-center px-3 py-2 mt-4 rounded-md h-9 lg:mt-0 lg:py-3 lg:px-5 bg-gray-5 dark:bg-darkBlue-4">
                        <Search
                            size={width >= 768 ? 20 : 16}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                        />
                        <input
                            className="text-sm w-full px-2.5 text-txtSecondary dark:text-txtSecondary-dark"
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e?.target?.value)}
                            placeholder={t('common:search')}
                        />
                        {selectedSymbol && (
                            <X
                                size={width >= 768 ? 20 : 16}
                                className="cursor-pointer"
                                onClick={() => setSelectedSymbol('')}
                            />
                        )}
                    </div>
                    <div>
                        <Popover className="relative">
                            {({
                                open,
                                close
                            }) => (
                                <>
                                    <Popover.Button>
                                        <div
                                            className="text-sm px-2 py-1 bg-bgInput dark:bg-bgInput-dark rounded-md flex items-center justify-between min-w-[169px] h-9 text-txtSecondary dark:text-txtSecondary-dark">
                                            {t(selectedFilter.label)}
                                            <img
                                                alt=""
                                                src={getS3Url('/images/nao/ic_arrow_bottom.png')}
                                                height="16"
                                                width="16"
                                            />
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
                                        <Popover.Panel
                                            className="absolute left-0 z-50 mt-1 rounded-md top-8 bg-nao-bg3">
                                            {FILTER_OPTS.map((item) => {
                                                const {
                                                    label,
                                                    index
                                                } = item;
                                                return (
                                                    <>
                                                        <div
                                                            key={index}
                                                            onClick={() => {
                                                                handleChangeFilter(item);
                                                                close();
                                                            }}
                                                            className={classNames(
                                                                'cursor-pointer px-3 py-3 min-w-[169px] text-sm shadow-onlyLight font-medium flex flex-col',
                                                                {
                                                                    'text-dominant':
                                                                        selectedFilter.index ===
                                                                        index
                                                                }
                                                            )}
                                                        >
                                                            {t(label)}
                                                        </div>
                                                        <Divider/>
                                                    </>
                                                );
                                            })}
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                </div>

                <div>
                    <Link to={''} href={''} className={'underline'}>
                        {t('futures:funding_history:link_overview')}
                    </Link>
                </div>
            </div>
        );
    };

    const [currentPage, setCurrentPage] = useState(1);

    const renderPagination = useCallback(() => {
        if (data?.length === 0) return null;
        return (
            <div className="flex items-center justify-center mt-10 mb-20">
                <RePagination
                    total={data?.length}
                    current={currentPage}
                    pageSize={10}
                    onChange={(currentPage) => setCurrentPage(currentPage)}
                    name="market_table___list"
                />
            </div>
        );
    }, [data, currentPage]);

    const columns = [

        {
            key: 'calcTime',
            dataIndex: 'calcTime',
            title: 'Thời gian',
            align: 'left',
            width: 100,
            sorter: false,
            fixed: width >= 992 ? 'none' : 'left',
            render: (data) => <span>{formatTime(data, 'yyyy-MM-dd HH:mm:ss')}</span>

        },
        {
            key: 'fundingIntervalHours',
            dataIndex: 'fundingIntervalHours',
            title: 'Khoảng funding',
            align: 'left',
            width: 120,
            sorter: false,
            render: (data, item) => data
        },
        {
            key: 'lastFundingRate',
            dataIndex: 'lastFundingRate',
            title: t('futures:funding_history:funding_rate'),
            align: 'left',
            width: 120,
            sorter: false,
            render: (data, item) => formatNumber(data * 100, 0, 4, true) + '%'

        },
    ];

    const options = {
        responsive: true,
        scales: {
            y: {
                display: true,
                title: {
                    display: true,
                    text: '% Funding Rate'
                },
                grid: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false
                }
            }

        },
        layout: {
            autoPadding: true
        }

    };

    const labels = data.map(item=> formatTime(item.calcTime, 'MM-dd HH:mm'));

    const dataLine = {
        labels,
        datasets: [
            {
                label: 'Funding Fee',
                data: data.map(item => item.lastFundingRate * 100),
                borderColor: '#00C8BC',
                // backgroundColor: 'rgba(53, 162, 235, 0.5)',
                fill: false,
                tension: 0.4
            },
        ],
    };

    console.log('__ data.line', dataLine);

    return (
        <>
            {renderSearch()}
            <>
                <div >
                    <Line options={options} data={dataLine}/>
                </div>

                <ReTable
                    // defaultSort={{ key: 'btc_value', direction: 'desc' }}
                    useRowHover
                    data={data || []}
                    columns={columns}
                    rowKey={(item) => item?.key}
                    loading={!data?.length}
                    scroll={{ x: true }}
                    // tableStatus={}
                    tableStyle={{
                        paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                        tableStyle: { minWidth: '1300px !important' },
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
                        pageSize: 10,
                        onChange: (currentPage) => setCurrentPage(currentPage)
                    }}
                />
            </>
            {renderPagination()}
        </>
    );
}

export const TimeLeft = ({ targetDate }) => {
    const countDownDate = new Date(targetDate).getTime();
    // const intervalRef = useRef()
    const stopTimer = () => {
        // if (intervalRef.current) clearInterval(intervalRef.current)
    };

    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    const getReturnValues = (countDown) => {
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        return {
            days,
            hours,
            minutes,
            seconds
        };
    };
    const result = getReturnValues(countDown);

    const addPaddingString = (number) => (number.toString().length === 1 ? '0' + number : number);

    return `${addPaddingString(result?.hours)}:${addPaddingString(
        result?.minutes
    )}:${addPaddingString(result?.seconds)}`;
};
